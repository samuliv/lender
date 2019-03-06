import { Component, OnInit } from '@angular/core';
import { LendItem } from '../../interfaces/lenditem';
import { ExtraService } from '../../services/extra/extra.service';
import { AlertController, IonItemSliding, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { WbmaService } from 'src/app/services/wbma/wbma.service';

@Component({
  selector: 'app-lent',
  templateUrl: 'lent.page.html',
  styleUrls: ['lent.page.scss']
})
export class LentPage implements OnInit {

  viewPage: string;
  lentItems: LendItem[];
  pendingItems: LendItem[];
  toolbarBadgeLent: number;
  toolbarBadgePending: number;
  toolbarBadgeFeedback: number;


  constructor(
    private extra: ExtraService,
    private wbma: WbmaService,
    private alertController: AlertController,
    private router: Router,
    private actionSheetController: ActionSheetController) {
      this.viewPage = 'lent';
      this.resetToolbarBadges();
  }

  ngOnInit() {
    this.refreshAll();
    this.refreshLentList();
  }

  resetToolbarBadges() {
    this.toolbarBadgeFeedback = 0;
    this.toolbarBadgePending = 0;
    this.toolbarBadgeLent = 0;
  }

  myLendableItems() {
    this.router.navigate(['/my-lendable-items/lent']);
  }

  refreshAll() {
    this.refreshLentList();
    this.refreshPendingList();
    this.refreshFeedbackList();
  }

  refreshLentListBadge() {
    let countPendingItems = 0;
    this.lentItems.forEach((i) => {
      if ( i.status === 'pending' ) {
        countPendingItems++;
      }
      this.toolbarBadgeLent = countPendingItems;
    });
  }

  refreshPendingListBadge() {
    let countPendingItems = 0;
    this.pendingItems.forEach((i) => {
      if ( i.status === 'pending' ) {
        countPendingItems++;
      }
      this.toolbarBadgePending = countPendingItems;
    });
  }

  refreshAllBadges() {
    this.refreshLentListBadge();
    this.refreshPendingListBadge();
  }

  refreshLentList() {
    this.extra.getListLent(this.wbma.getMyUserID()).subscribe(res => {
      this.lentItems = res;
      this.wbma.dataMerge(this.lentItems);
      this.refreshLentListBadge();
    });
  }

  refreshPendingList() {
    this.extra.getListLentPending(this.wbma.getMyUserID()).subscribe(res => {
      this.pendingItems = res;
      this.refreshPendingListBadge();
    });
  }

  refreshFeedbackList() {
    // this.extra.getListLent(this.wbma.getMyUserID()).subscribe(res => {
    //   this.pendingItems = res;
    // });
    // TODO
  }

  refershCurrentView() {
    switch ( this.viewPage ) {
      case 'lent':
        this.refreshLentList();
        break;
      case 'pending':
        this.refreshPendingList();
        break;
      default:
        this.refreshFeedbackList();
        break;
    }
  }

  ionViewDidEnter() {
    console.log('lent.page.ts : ionViewDidEnter()');
  }

  async itemClick(item: LendItem) {

    const buttons: any = [{
      text: 'Send Messsage to User',
      handler: () => {
        this.sendMessage(item);
      }
    }];

    if ( item.rejectable ) {
      buttons.push({text: 'Reject Request', role: 'destructive', handler: () => {
        this.reject(item);
       }});
    }

    if ( item.cancellable ) {
      buttons.push({text: 'Cancel Request', role: 'destructive', handler: () => {
        this.cancel(item);
      }});
    }

    if ( item.acceptable ) {
      buttons.push({text: 'Accept Request', handler: () => {
        this.accept(item);
      }});
    }

    buttons.push({text: 'Close'});

    const actionSheet = await this.actionSheetController.create({
      header: 'Request Operations',
      buttons: buttons
    });



    await actionSheet.present();
  }

  sendMessage(item: LendItem) {
    this.router.navigate(['/send-message/lent-' + item.user_id]);
  }

  negativeRefresh() {
    if ( this.viewPage === 'lent' ) {
      this.refreshPendingList();
    } else {
      this.refreshLentList();
    }
  }

  closeIis(iis: IonItemSliding) {
    iis.close().catch((e) => { console.log('Cannot Close IonItemSliding Element'); });
  }

  async reject(item: LendItem, iis?: IonItemSliding) {
    if (iis !== null && iis !== undefined ) {
      this.closeIis(iis);
    }
    const alert = await this.alertController.create({
      header: 'Reject Lend Request',
      subHeader: '',
      message: 'Are you sure you want to reject this Lend Request?',
      buttons: [
        {
          text: 'Reject',
          handler: () => {
            this.extra.rejectRequest(item.lend_id).subscribe(res => {
              if ( res.success ) {
                item.acceptable = false;
                item.rejectable = false;
                item.cancellable = false;
                item.status = 'rejected';
                this.negativeRefresh();
                this.refreshAllBadges();
              } else {
                console.log('ERROR: ' + res.error);
              }
            });
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async accept(item: LendItem, iis?: IonItemSliding) {
    if (iis !== null && iis !== undefined ) {
      this.closeIis(iis);
    }
    const alert = await this.alertController.create({
      header: 'Accept Lend Request',
      subHeader: '',
      message: 'Are you sure you want to Accept this Lend Request?',
      buttons: [
        {
          text: 'Accept',
          handler: () => {
            this.extra.acceptRequest(item.lend_id).subscribe(res => {
              if ( res.success ) {
                item.acceptable = false;
                item.rejectable = false;
                item.cancellable = true;
                item.status = 'accepted';
                this.negativeRefresh();
                this.refreshAllBadges();
              } else {
                console.log('ERROR: ' + res.error);
              }
            });
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async cancel(item: LendItem, iis?: IonItemSliding) {
    if (iis !== null && iis !== undefined ) {
      this.closeIis(iis);
    }
    const alert = await this.alertController.create({
      header: 'Cancel Lend Request',
      subHeader: '',
      message: 'Are you sure you want to Cancel this already Accepted Lend Request?',
      buttons: [
        {
          text: 'Cancel Lend',
          handler: () => {
            this.extra.cancelRequest(item.lend_id).subscribe(res => {
              if ( res.success ) {
                item.cancellable = false;
                item.status = 'cancelled';
                this.negativeRefresh();
                this.refreshAllBadges();
              } else {
                console.log( 'Error: ' + res.error );
              }
            });
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
