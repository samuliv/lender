import { Component, OnInit } from '@angular/core';
import { ExtraService } from '../../services/extra/extra.service';
import { NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { WbmaService } from 'src/app/services/wbma/wbma.service';

@Component({
  selector: 'app-readmessage',
  templateUrl: 'readmessage.page.html',
  styleUrls: ['readmessage.page.scss']
})
export class ReadMessagePage implements OnInit {

  messageSenderName: string;
  messageRecipientName: string;
  messageSenderID: number;
  messageRecipientID: number;
  messageTime: string;
  message: string;
  param: any;
  messageID = 0;
  constructor(
    private extra: ExtraService,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private wbma: WbmaService,
    private router: Router) {
  }

  ngOnInit() {
    this.messageID = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
    this.extra.getMessage(this.messageID).subscribe(res => {
      this.message = res.message;
      this.messageTime = res.ago;
      this.messageRecipientID = res.to;
      this.messageSenderID = res.from;
      this.wbma.getUserInformation(res.from).subscribe((user) => {
        this.messageSenderName = user.username;
      });
      this.wbma.getUserInformation(res.to).subscribe((user) => {
        this.messageRecipientName = user.username;
      });
    });
  }

  viewSenderUserProfile() {
    this.router.navigate(['/view-user-profile/' + this.messageSenderID + '_' + 'readmessage' + '_' + this.messageID]);
  }

  viewRecipientUserProfile() {
    this.router.navigate(['/view-user-profile/' + this.messageRecipientID + '_' + 'readmessage' + '_' + this.messageID]);
  }

  goBack() {
    this.navController.navigateBack('/tabs/messages');
  }

  reply() {
    let recipient = 0;
    if (this.messageSenderID === this.wbma.getMyUserID()) {
      recipient = this.messageRecipientID;
    } else {
      recipient = this.messageSenderID;
    }
    this.router.navigate(['/send-message/readmessage-' + recipient + '-' + this.messageID]);
  }

}
