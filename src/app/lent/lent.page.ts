import { Component } from '@angular/core';
import { LendItem } from '../interfaces/lenditem';
import { Observable } from 'rxjs';
import { ExtraService } from '../extra.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lent',
  templateUrl: 'lent.page.html',
  styleUrls: ['lent.page.scss']
})
export class LentPage {

  viewPage: string;
  listItems: Observable<LendItem[]>;

  constructor(public extra: ExtraService, private alertController: AlertController) {
    this.viewPage = 'latest';
  }

  refreshList() {
    this.listItems = this.extra.getLendingsList(1);
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
