import { Component, OnInit } from '@angular/core';
import { ExtraService } from '../../services/extra/extra.service';
import { NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { WbmaService } from 'src/app/services/wbma/wbma.service';

@Component({
  selector: 'app-readmessage',
  templateUrl: 'readmessage.page.html',
  styleUrls: ['readmessage.page.scss']
})
export class ReadMessagePage implements OnInit {

  messageSenderName: string;
  messageTime: string;
  message: string;
  param: any;

  constructor(
    private extra: ExtraService,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private wbma: WbmaService) {
  }

  ngOnInit() {
    this.extra.getMessage(parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10)).subscribe(res => {
      this.message = res.message;
      this.messageTime = res.ago;
      this.wbma.getUserInformation(res.from).subscribe((user) => {
        this.messageSenderName = user.username;
      });
    });
  }

  goBack() {
    this.navController.navigateBack('/tabs/messages');
  }

  reply() {
    console.log('TODO');
  }

}
