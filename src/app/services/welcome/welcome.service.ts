import { Injectable, ɵConsole } from '@angular/core';
import { AlertController, Events } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  constructor(
    private alertController: AlertController,
    private router: Router,
    private events: Events,
  ) { }

  doWelcomeThings() {
    if (!this.tourAlreadyPresented()) {
      this.welcomeMessage();
    } else {
      console.log('No tour - it is already shown or dismissed.');
    }
  }

  startWelcomeTour() {
    this.noTourNextTime();
    this.tourStep(0);
  }

  tourStep(step: number) {
    let title = '';
    let message = '';
    let goToPage = '';
    let eventPublish = '';
    let final = false;
    switch ( step ) {
      case 0:
        title = 'Browse Tab';
        message = 'The first tab is browsing page. Use search filters to match the items you need.<br><br>Hint: You can use also Quick Search located in the Top Bar.<br>Hint: More options available with Top Bar button <b>More Options</b>';
        break;
      case 1:
        goToPage = 'tabs/lent';
        title = 'Lent Tab';
        message = 'Here you find the items you have lent to other people - or the items other people have been requested from yout.';
        break;
      case 2:
        eventPublish = 'tour-lent-feedback';
        title = 'Lent / Feedback';
        message = 'Remember to give Feedback to users!';
        break;
      case 3:
        eventPublish = 'tour-lent-feedback-reset';
        goToPage = 'tabs/borrowed';
        title = 'Borrowed Tab';
        message = 'Third tab is similar to the second tab - but here you find what you have borrowed from others.';
        break;
      case 4:
        goToPage = 'tabs/messages';
        title = 'Messages Tab';
        message = 'In this tab you see all received notifications and sent/received messages.';
        break;
      case 5:
        eventPublish = 'tour-messages-feedback';
        title = 'Messages / Feedback';
        message = 'In the sub section <i>Feedback</i> you can read all the feedback you\'ve got.';
        break;
      case 6:
        eventPublish = 'tour-messages-feedback-reset';
        goToPage = 'tabs/settings';
        title = 'Settings Tab';
        message = 'In the last tab Settings you can change your own information and add your items to lend to others.';
        break;
      case 7:
        goToPage = 'tabs/lent';
        title = 'Ready to Start';
        message = 'The tour has ended, feel free to start browsing or add your own items!';
        final = true;
    }
    if (eventPublish !== '') {
      this.events.publish(eventPublish);
    }
    if (goToPage) {
      this.router.navigate([goToPage]);
    }
    this.tourMessage(step, title, message, final);
  }

  async tourMessage(step: number, headerText: string, messageText: string, final?: boolean) {
    const alert = await this.alertController.create({
      header: headerText,
      message: messageText,
      buttons: [
        {
          text: 'Stop Tour',
          handler: () => {
            console.log('Tour stopped');
          }
        }, {
          'text': (final ? 'Finish Tour' : 'OK, Next'),
          handler: () => {
            if (final) {
              console.log('Tour finished.');
            } else {
              this.tourStep(step + 1);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  tourAlreadyPresented() {
    const lenderTour = localStorage.getItem('lendertour');
    if ( lenderTour === 'ok' ) {
      return true;
    }
    return false;
  }

  noTourNextTime() {
    localStorage.setItem('lendertour', 'ok');
    console.log('Stored: No Tour Next Time');
  }

  async welcomeMessage() {
    const alert = await this.alertController.create({
      header: 'Welcome to Lender!',
      message: 'Thank you so much for downloading our app!<br><br>Do you want a quick view how to use the application?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.noTourNextTime();
          }
        }, {
          'text': 'Yes',
          handler: () => {
            this.startWelcomeTour();
          }
        }
      ]
    });
    await alert.present();
  }

}