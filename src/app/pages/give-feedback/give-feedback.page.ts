import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Events } from '@ionic/angular';
import { ExtraService } from 'src/app/services/extra/extra.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-give-feedback',
  templateUrl: './give-feedback.page.html',
  styleUrls: ['./give-feedback.page.scss'],
})
export class GiveFeedbackPage implements OnInit {

  source = '';
  id = -1;
  feedback = 0;
  feedbackText = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private extra: ExtraService,
    private events: Events,
    private glb: GlobalService,
  ) { }

  ngOnInit() {
    this.source = this.activatedRoute.snapshot.paramMap.get('source').split('-')[0];
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('source').split('-')[1], 10);
  }

  goBack() {
    if ( this.source === 'lent' ) {
      this.navController.navigateBack('/tabs/lent');
    } else {
      this.navController.navigateBack('/tabs/borrowed');
    }
  }

  giveFeedback() {
    this.extra.giveFeedback(this.id, this.feedback, this.feedbackText).subscribe((res) => {
      if (res.success) {
        this.events.publish('feedback-given', this.source, this.id);
        this.goBack();
      } else {
        this.glb.messagePrompt('Failed to give Feedback', res.error);
      }
    })
  }

  choose(val: number) {
    this.feedback = val;
  }

}
