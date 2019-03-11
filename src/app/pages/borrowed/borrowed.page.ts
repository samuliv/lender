import { Component, OnInit } from '@angular/core';
import { LendItem } from '../../interfaces/lenditem';
import { ExtraService } from '../../services/extra/extra.service';
import { AlertController, IonItemSliding, ActionSheetController, Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UnfeedbackedItem } from 'src/app/interfaces/unfeedbacked-item';

@Component({
  selector: 'app-borrowed',
  templateUrl: 'borrowed.page.html',
  styleUrls: ['borrowed.page.scss']
})
export class BorrowedPage implements OnInit {

  viewPage: string;
  borrowedItems: LendItem[] = [];
  pendingItems: LendItem[] = [];
  feedbackItems: UnfeedbackedItem[] = [];
  toolbarBadgeBorrowed: number;
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
      this.viewPage = 'borrowed';
      this.resetToolbarBadges();
  }

  ngOnInit() {
    this.events.subscribe('refresh-borrowed', () => {
      this.refreshBorrowedList();
      this.refreshPendingList();
    });
    this.refreshAll();
  }

  resetToolbarBadges() {
    this.toolbarBadgeFeedback = 0;
    this.toolbarBadgePending = 0;
    this.toolbarBadgeBorrowed = 0;
  }

  refreshAll() {
    this.refreshBorrowedList();
    this.refreshPendingList();
    this.refreshFeedbackList();
  }

  refreshBorrowedListBadge() {
    let countPendingItems = 0;
    if (this.borrowedItems.length > 0) {
      this.borrowedItems.forEach((i) => {
        if ( i.status === 'pending' ) {
          countPendingItems++;
        }
      });
    }
    this.toolbarBadgeBorrowed = countPendingItems;
  }

  refreshPendingListBadge() {
    this.toolbarBadgePending = this.pendingItems.length;
  }

  refreshAllBadges() {
    this.refreshBorrowedListBadge();
    this.refreshPendingListBadge();
  }

  refreshBorrowedList() {
    this.toolbarBadgeBorrowed = 0;
    this.extra.getListBorrowed(this.wbma.getMyUserID()).subscribe(res => {
      this.borrowedItems = res;
      this.wbma.dataMerge(this.borrowedItems);
      this.refreshBorrowedListBadge();
    });
  }

  refreshPendingList() {
    this.toolbarBadgePending = 0;
    this.extra.getListBorrowedPending(this.wbma.getMyUserID()).subscribe(res => {
      this.pendingItems = res;
      this.wbma.dataMerge(this.pendingItems);
      this.refreshPendingListBadge();
    });
  }

  refreshFeedbackList() {
    this.toolbarBadgeFeedback = 0;
    this.extra.getUnfeedbackedItems(this.wbma.getMyUserID(), false).subscribe(res => {
      this.toolbarBadgeFeedback = res.length;
      this.feedbackItems = res;
      this.wbma.dataMerge(this.feedbackItems);
    })
  }

  refershCurrentView() {
    switch ( this.viewPage ) {
      case 'borrowed':
        this.refreshBorrowedList();
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
    console.log('borrowed.page.ts : ionViewDidEnter()');
  }

  async itemClick(item: LendItem) {

    if (item.readed === false) {
      item.readed = true;
      this.extra.markBorrowedItemAsReaded(item.lend_id).subscribe((res) => {
        console.log(res);
      });
    }

    const buttons: any = [{
      text: 'Send Messsage to User',
      handler: () => {
        this.sendMessage(item);
      },
    }, {
      text: 'View User Profile',
      handler: () => {
        this.router.navigate(['/view-user-profile/' + item.user_id + '_' + 'borroed']);
      }
    }, {
      text: 'View Item Info',
      handler: () => {
        console.log('TODO');
      }
    }, {
      text: 'View Location on Map',
      handler: () => {
        console.log('TODO');
      }
    }
  ];

    if ( item.cancellable ) {
      buttons.push({text: 'Cancel Request', role: 'destructive', handler: () => {
        this.cancel(item);
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
    this.router.navigate(['/send-message/borrowed-' + item.user_id]);
  }

  negativeRefresh() {
    if ( this.viewPage === 'borrowed' ) {
      this.refreshPendingList();
    } else {
      this.refreshBorrowedList();
    }
  }

  async cancel(item: LendItem) {
    const alert = await this.alertController.create({
      header: 'Cancel Borrowing Request',
      subHeader: '',
      message: 'Are you sure you want to Cancel this already Accepted Borrowing Request?',
      buttons: [
        {
          text: 'Yes, cancel',
          handler: () => {
            this.extra.cancelBorrow(item.lend_id).subscribe(res => {
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
