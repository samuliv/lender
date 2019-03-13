import { Component, OnInit } from '@angular/core';
import { LendItem } from '../../interfaces/lenditem';
import { ExtraService } from '../../services/extra/extra.service';
import { AlertController, IonItemSliding, ActionSheetController, Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UnfeedbackedItem } from 'src/app/interfaces/unfeedbacked-item';

@Component({
  selector: 'app-lent',
  templateUrl: 'lent.page.html',
  styleUrls: ['lent.page.scss']
})
export class LentPage implements OnInit {

  viewPage: string;
  lentItems: LendItem[] = [];
  pendingItems: LendItem[] = [];
  feedbackItems: UnfeedbackedItem[] = [];
  toolbarBadgeLent: number;
  toolbarBadgePending: number;
  toolbarBadgeFeedback: number;

  constructor(
    private extra: ExtraService,
    private wbma: WbmaService,
    private alertController: AlertController,
    private router: Router,
    private events: Events,
    private glb: GlobalService,
    private actionSheetController: ActionSheetController) {
      this.viewPage = 'lent';
      this.resetToolbarBadges();
  }

  ngOnInit() {
    this.events.subscribe('refresh-lent', () => {
      this.refreshLentList();
      this.refreshPendingList();
    });
    this.events.subscribe('login', () => {
      this.refreshAll();
    });
    this.events.subscribe('feedback-given', (source, id) => {
      if (source === 'lent') {
        this.refreshFeedbackList();
      }
    });
    this.refreshAll();
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
    this.toolbarBadgeLent = 0;
    this.extra.getListLent(this.wbma.getMyUserID()).subscribe(res => {
      this.lentItems = res;
      this.wbma.dataMerge(this.lentItems);
      this.wbma.usernameMerge(this.lentItems);
      this.refreshLentListBadge();
    });
  }

  refreshPendingList() {
    this.toolbarBadgePending = 0;
    this.extra.getListLentPending(this.wbma.getMyUserID()).subscribe(res => {
      this.pendingItems = res;
      this.wbma.dataMerge(this.pendingItems);
      this.wbma.usernameMerge(this.pendingItems);
      this.refreshPendingListBadge();
    });
  }

  refreshFeedbackList() {
    this.toolbarBadgeFeedback = 0;
    this.extra.getUnfeedbackedItems(this.wbma.getMyUserID(), true).subscribe(res => {
      this.toolbarBadgeFeedback = res.length;
      this.feedbackItems = res;
      this.wbma.dataMerge(this.feedbackItems);
      this.wbma.usernameMerge(this.feedbackItems);
    })
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

  doRefresh(event) {
    this.refershCurrentView();
    event.target.complete();
  }

  ionViewDidEnter() {
    console.log('lent.page.ts : ionViewDidEnter()');
  }

  giveFeedback(item: UnfeedbackedItem) {
    this.router.navigate(['/give-feedback/lent-' + item.lend_id]);
  }

  async itemClick(item: LendItem) {

    const buttons: any = [{
      text: 'Send Messsage to User',
      handler: () => {
        this.sendMessage(item);
      }
    }, {
      text: 'View User Profile',
      handler: () => {
        this.router.navigate(['/view-user-profile/' + item.user_id + '_' + 'lent']);
      }
    }, {
      text: 'View Item Info',
      handler: () => {
        this.router.navigate(['/view-item/lent-' + item.item_id]);
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

    buttons.push({text: 'Close', role: 'cancel'});

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

  async reject(item: LendItem) {
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
                this.glb.tabBarIconsNeedRefreshing();
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

  async accept(item: LendItem) {
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
                this.glb.tabBarIconsNeedRefreshing();
                item.acceptable = false;
                item.rejectable = false;
                item.cancellable = true;
                item.status = 'accepted';
                this.negativeRefresh();
                this.refreshAllBadges();
                console.log('Success.');
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

  async cancel(item: LendItem) {
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
