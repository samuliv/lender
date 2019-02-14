import { Component } from '@angular/core';
import { ExtraService } from '../extra.service';
import { Message } from '../interfaces/message';
import { Feedback } from '../interfaces/feedback';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-requests',
  templateUrl: 'requests.page.html',
  styleUrls: ['requests.page.scss']
})
export class RequestsPage {

  viewPage: string;
  inbox: Message[];
  outbox: Message[];
  feedback: Feedback[];

  constructor(private extra: ExtraService) {
    this.viewPage = 'inbox';
  }

  refreshInbox() {
    console.log('refreshInbox()');
    this.extra.getMessages(1).subscribe(res => {
      this.inbox = res;
    });
  }

  refreshOutbox() {
    console.log('refreshOutbox()');
    this.extra.getMessages(1).subscribe(res => {
      this.inbox = res;
      console.log(res);
    });
  }

  refreshFeedback() {
    console.log('refreshFeedback()');
    this.extra.getFeedback(1).subscribe(res => {
      this.feedback = res;
    });
  }

  ionViewDidEnter() {
    console.log('myitems.page.ts : ionViewDidEnter()');
    this.refreshInbox();
    this.refreshOutbox();
    this.refreshFeedback();
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
  
  doRefresh(e: Event) {
    console.log('doRefresh()');
    this.refreshCurrent();
    setTimeout(() => {
      e.target.complete();
    }, 200);
  }

}
