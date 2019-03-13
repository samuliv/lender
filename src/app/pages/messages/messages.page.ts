import { Component, OnInit } from '@angular/core';
import { ExtraService } from '../../services/extra/extra.service';
import { Message } from '../../interfaces/message';
import { Feedback } from '../../interfaces/feedback';
import { Router } from '@angular/router';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Events, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-messages',
  templateUrl: 'messages.page.html',
  styleUrls: ['messages.page.scss']
})
export class MessagesPage implements OnInit {

  viewPage: string;
  inbox: Message[] = [];
  outbox: Message[] = [];
  feedback: Feedback[] = [];
  badgeInbox = 0;

  constructor(
    private extra: ExtraService,
    private wbma: WbmaService,
    private glb: GlobalService,
    private events: Events,
    private router: Router,
    private actionSheetController: ActionSheetController,
    ) {
    this.viewPage = 'inbox';
  }

  ngOnInit() {
    console.log('messages.page.ts : ngOnInit()');
    this.refreshAll();
    this.events.subscribe('refresh-messages', () => {
      this.refreshInbox();
    });
    this.events.subscribe('tour-messages-feedback', (source, id) => {
      this.viewPage = 'feedback';
    });
    this.events.subscribe('tour-messages-feedback-reset', (source, id) => {
      this.viewPage = 'inbox';
    });

  }

  getUserNames(arr: Message[], sent: boolean) {
    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        this.wbma.getUserInformation((sent ? arr[i].to : arr[i].from)).subscribe((userData) => {
          if (sent) {
            arr[i].recipient_name = userData.username;
          } else {
            arr[i].sender_name = userData.username;
          }
        });
      }
    }
  }

  getUserNamesFeedback(arr: Feedback[]) {
    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        this.wbma.getUserInformation(arr[i].user_id).subscribe((userData) => {
          arr[i].user_name = userData.username;
        });
      }
    }
  }

  refreshBadgeInbox() {
    console.log('refreshBadgeInbox()');
    this.badgeInbox = 0;    
    if (this.inbox.length > 0) {
      this.inbox.forEach((i) => {
        if (!i.readed) {
          this.badgeInbox++;
        }
      });
    }
  }

  refreshInbox() {
    console.log('refreshInbox()');
    this.extra.getMessages(this.wbma.getMyUserID()).subscribe(res => {
      this.inbox = res;
      this.getUserNames(this.inbox, false);
      this.refreshBadgeInbox();
    });
  }

  refreshOutbox() {
    console.log('refreshOutbox()');
    this.extra.getMessages(this.wbma.getMyUserID(), true).subscribe(res => {
      this.outbox = res;
      this.getUserNames(this.outbox, true);
    });
  }

  refreshFeedback() {
    console.log('refreshFeedback()');
    this.extra.getFeedback(this.wbma.getMyUserID()).subscribe(res => {
      this.feedback = res;
      this.getUserNamesFeedback(this.feedback);
      this.feedback.forEach((i) => {
        this.wbma.getSingleMedia(i.item).subscribe((media) => {
          i.item_name = media.title;
        })
      })
    });
  }

  refreshAll() {
    this.refreshInbox();
    this.refreshOutbox();
    this.refreshFeedback();
  }

  // readInboxMessage(id: number, alreadyReaded: boolean, message: Message) {
  //   if ( !alreadyReaded ) {
  //     this.extra.markMessageAsReaded(id).subscribe(res => {
  //       console.log('This message was unreaded. Trying to mark as readed:');
  //       console.log('...markMessageAsReaded(id): success = ' + res.success);
  //       if ( res.success ) {
  //         message.readed = true;
  //         this.refreshBadgeInbox();
  //         this.glb.tabBarIconsNeedRefreshing();
  //       }
  //     });
  //   }
  //   this.router.navigate(['/readmessage/' + id]);
  // }

  inboxMessageClick(message: Message) {
    if (message.readed === false) {
      this.extra.markMessageAsReaded(message.id).subscribe(res => {
        if ( res.success ) {
          message.readed = true;
          this.refreshBadgeInbox();
          this.glb.tabBarIconsNeedRefreshing();
        }
      });
    } else {
      this.messageOperations(message);
    }
  }

  outboxMessageClick(message: Message) {
    this.messageOperations(message);
  }

  async messageOperations(message: Message) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Message Operations',
      buttons: [ {
        text: 'Reply',
        handler: () => {
          this.router.navigate(['/send-message/messages-' + message.from]);
        }
      }, {
        text: 'Delete Message',
        role: 'destructive',
        handler: () => {
          this.extra.deleteMessage(message.id).subscribe((messageDeleted) => {
            if (messageDeleted.success) {
              let removeID = -1;
              if (this.viewPage === 'inbox') {
                removeID = this.inbox.indexOf(message);
                if (removeID !== -1) {
                  this.inbox.splice(removeID, 1);
                }
              }
              if (this.viewPage === 'sent') {
                removeID = this.outbox.indexOf(message);
                if (removeID !== -1) {
                  this.outbox.splice(removeID, 1);
                }
              } 
            }
          });
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }
    ]
    });

    await actionSheet.present();
  }

  // readOutboxMessage(id: number) {
  //   this.router.navigate(['/readmessage/' + id]);
  // }

  readFeedback(id: number) {
    this.router.navigate(['/readmessage/' + id]);
  }

  refreshCurrent() {
    switch ( this.viewPage ) {
      case 'inbox':
        this.refreshInbox();
        break;
      case 'sent':
        this.refreshOutbox();
        break;
      default:
        this.refreshFeedback();
        break;
    }
  }

  doRefresh(event) {
    console.log('doRefresh()');
    this.refreshCurrent();
    event.target.complete();
  }

}
