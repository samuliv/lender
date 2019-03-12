import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { ExtraService } from 'src/app/services/extra/extra.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.page.html',
  styleUrls: ['./send-message.page.scss'],
})
export class SendMessagePage implements OnInit {

  goBackTo: string;
  recipientID: number;
  messageIsLongEnough = false;
  messageText = '';
  recipientName = '';
  extraParams = '';

  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private extra: ExtraService,
    private wbma: WbmaService,
    private glb: GlobalService,
    ) { }

  ngOnInit() {
    const items = this.activatedRoute.snapshot.paramMap.get('source').split('-');
    this.goBackTo = items[0];
    this.recipientID = parseInt(items[1], 10);
    if (items.length === 3) {
      this.extraParams = items[2];
    }
    this.wbma.getUserInformation(this.recipientID).subscribe((user) => {
      this.recipientName = user.username;
    });
  }

  checkIsMessageLongEnough() {
    this.messageIsLongEnough = (this.messageText.length > 2);
  }

  sendMessageButtonClick() {
    this.extra.sendMessage(this.wbma.getMyUserID(), this.recipientID, this.messageText).subscribe((messageSent) => {
      if (messageSent.success) {
        this.goBack();
      } else {
        this.glb.messagePrompt('Error', 'Sending a message failed.');
      }
    })
  }

  goBack() {
    switch (this.goBackTo) {
      case 'lent':
        this.navController.navigateBack('/tabs/lent');
        break;
      case 'messages':
        this.navController.navigateBack('/tabs/messages');
        break;
      case 'readmessage':
        this.navController.navigateBack('/readmessage/'  + this.extraParams);
        break;
      default:
        this.navController.navigateBack('/tabs/borrowed');
        break;
    }
  }

}
