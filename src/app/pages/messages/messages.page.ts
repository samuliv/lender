import { Component, OnInit } from '@angular/core';
import { ExtraService } from '../../services/extra/extra.service';
import { Message } from '../../interfaces/message';
import { Feedback } from '../../interfaces/feedback';
import { Router } from '@angular/router';
import { WbmaService } from 'src/app/services/wbma/wbma.service';

@Component({
  selector: 'app-messages',
  templateUrl: 'messages.page.html',
  styleUrls: ['messages.page.scss']
})
export class MessagesPage implements OnInit {

  viewPage: string;
  inbox: Message[];
  outbox: Message[];
  feedback: Feedback[];

  constructor(private extra: ExtraService, private wbma: WbmaService, private router: Router) {
    this.viewPage = 'inbox';
  }

  ngOnInit() {
    console.log('myitems.page.ts : ngOnInit()');
    this.refreshAll();
  }

  refreshInbox() {
    console.log('refreshInbox()');
    this.extra.getMessages(this.wbma.getMyUserID()).subscribe(res => {
      this.inbox = res;
    });
  }

  refreshOutbox() {
    console.log('refreshOutbox()');
    this.extra.getMessages(this.wbma.getMyUserID()).subscribe(res => {
      this.inbox = res;
      console.log(res);
    });
  }

  refreshFeedback() {
    console.log('refreshFeedback()');
    this.extra.getFeedback(this.wbma.getMyUserID()).subscribe(res => {
      this.feedback = res;
    });
  }

  refreshAll() {
    this.refreshInbox();
    this.refreshOutbox();
    this.refreshFeedback();
  }

  readInboxMessage(id: number, alreadyReaded: boolean, message: Message) {
    if ( !alreadyReaded ) {
      this.extra.markMessageAsReaded(id).subscribe(res => {
        console.log('This message was unreaded. Trying to mark as readed:');
        console.log('...markMessageAsReaded(id): success = ' + res.success);
        if ( res.success ) {
          message.readed = true;
        }
      });
    }
    this.router.navigate(['/readmessage/' + id]);
  }

  readOutboxMessage(id: number) {
    this.router.navigate(['/readmessage/' + id]);
  }

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
