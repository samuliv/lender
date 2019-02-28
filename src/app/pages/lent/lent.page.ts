import { Component } from '@angular/core';
import { LendItem } from '../../interfaces/lenditem';
import { ExtraService } from '../../services/extra/extra.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lent',
  templateUrl: 'lent.page.html',
  styleUrls: ['lent.page.scss']
})
export class LentPage {

  viewPage: string;
  lentItems: LendItem[];
  pendingItems: LendItem[];
  toolbarBadgeLent: number;
  toolbarBadgePending: number;
  toolbarBadgeFeedback: number;

  constructor(public extra: ExtraService, private alertController: AlertController) {
    this.viewPage = 'lent';
    this.resetToolbarBadges();
  }

  resetToolbarBadges() {
    this.toolbarBadgeFeedback = 0;
    this.toolbarBadgePending = 0;
    this.toolbarBadgeLent = 0;
  }

  refreshList() {
    this.extra.getListLent(1).subscribe( res => {
      this.lentItems = res;
    });
  }

  ionViewDidEnter() {
    console.log('lent.page.ts : ionViewDidEnter()');
    this.refreshList();
  }

  itemClick(item: LendItem) {
    console.log('ItemClick');
  }

  sendMessage(item: LendItem) {

  }

  async reject(item: LendItem) {
    const alert = await this.alertController.create({
      header: 'Reject Lend Request',
      subHeader: '',
      message: 'Are you sure you want to reject this Lend Request?',
      buttons: [
        {
          text: 'Reject',
          handler: () => {
            item.status = 'rejected';
            item.accetable = false;
            item.rejectable = false;
            item.cancellable = false;
            console.log('TODO');
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async accept(item: LendItem) {
    const alert = await this.alertController.create({
      header: 'Accept Lend Request',
      subHeader: '',
      message: 'Are you sure you want to Accept this Lend Request?',
      buttons: [
        {
          text: 'Accept',
          handler: () => {
            console.log('TODO');
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async cancel(item: LendItem) {
    const alert = await this.alertController.create({
      header: 'Cancel Lend Request',
      subHeader: '',
      message: 'Are you sure you want to Cancel this already Accepted Lend Request?',
      buttons: [
        {
          text: 'Cancel Lend',
          handler: () => {
            console.log('TODO');
          }
        }, {
          text: 'No',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

}
