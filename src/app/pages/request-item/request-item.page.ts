import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { ActivatedRoute } from '@angular/router';
import { MediaItem } from 'src/app/interfaces/mediaitem';
import { TimeService } from 'src/app/services/time/time.service';
import { ExtraService } from 'src/app/services/extra/extra.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-request-item',
  templateUrl: './request-item.page.html',
  styleUrls: ['./request-item.page.scss'],
})
export class RequestItemPage implements OnInit {

  mediaID = 0;
  startTime = '';
  endTime = '';
  title = '';
  description = '';
  mediaItem: MediaItem;

  pricePerHour = '';
  pricePerHourNumber = -1;
  priceTotal = '';

  constructor(
    private navController: NavController,
    private wbma: WbmaService,
    private extra: ExtraService,
    private activatedRoute: ActivatedRoute,
    private time: TimeService,
    private alertController: AlertController,
    private glb: GlobalService,
    ) {
      const chunks = this.activatedRoute.snapshot.paramMap.get('id').split('_');
      this.mediaID = parseInt(chunks[0], 10);
      this.startTime = chunks[1];
      this.endTime = chunks[2];
    }

  someParameterChanged() {
    if (this.startTime !== ''){
      if (this.endTime === '' || this.time.calculateTimeDifference(this.startTime, this.endTime) === -1 ) {
        this.endTime = this.time.getTimeAfter(this.startTime, 3600);
      }
    }
    this.calculateTotalCost();
  }

  sendRequest(mediaItem: MediaItem) {
    if (this.startTime && this.endTime) {
      const start = new Date(this.startTime);
      const end = new Date(this.endTime);
      if (start.getTime() < end.getTime()) {
        this.extra.requestLend(mediaItem.file_id, this.startTime, this.endTime, this.wbma.getMyUserID(), mediaItem.user_id).subscribe((res) => {
          if (res.success) {
            this.successMessage();
          } else {
            this.errorMessage(res.error);
          }
        });
      } else {
        this.glb.messagePrompt('Start & End Times', 'Please check your time range!');
      }
    }
  }

  async sendRequestButtonClick() {
    const alert = await this.alertController.create({
      header: 'Send Request',
      subHeader: '',
      message: 'Do you want to send the Lending request? The lending is about to cost you ' + this.priceTotal,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.sendRequest(this.mediaItem);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async successMessage() {
    const alert = await this.alertController.create({
      header: 'Lend Request Sent',
      message: 'Your lending request is successfully sent to the lender.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.goBack();
          }
        }
      ]
    });
    await alert.present();
  }

  async errorMessage(error: string) {
    const alert = await this.alertController.create({
      header: 'Request Failed',
      message: error,
      buttons: [
        {
          text: 'OK'
        }
      ]
    });
    await alert.present();
  }

  calculateTotalCost() {
    const timeDiff = this.time.calculateTimeDifference(this.startTime, this.endTime);
    if (timeDiff !== -1){
      this.priceTotal = ( (timeDiff/3600) * this.pricePerHourNumber).toFixed(2).toString() + ' €';
    } else {
      this.priceTotal = '';
    }
  }

  ngOnInit() {
    this.wbma.getSingleMedia(this.mediaID).subscribe((media) => {
      this.wbma.readSingleMediaData(media);
      this.mediaItem = media;
      this.pricePerHour = media.media_data.price.toString() + ' €/h';
      this.pricePerHourNumber = media.media_data.price;
      this.calculateTotalCost();
      this.wbma.getUserInformation(media.user_id).subscribe((user) => {
        this.mediaItem.user_name = user.username;
      })
    })
  }

  goBack() {
    this.navController.navigateBack('/tabs/browse');
  }
}
