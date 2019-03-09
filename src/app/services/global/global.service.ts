import { Injectable } from '@angular/core';
import { Events, AlertController } from '@ionic/angular';
import { ExtraService } from '../extra/extra.service';
import { WbmaService } from '../wbma/wbma.service';
import { NotifyService } from '../notify/notify.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  badgeTabBarLent = 0;
  badgeTabBarBorrowed = 0;
  badgeTabBarMessages = 0;
  backgroundRefresh: any;
  backgroundRefreshRunning = false;

  constructor(
    private events: Events,
    private extra: ExtraService,
    private wbma: WbmaService,
    private notify: NotifyService,
    private alertController: AlertController,
  ) {
    this.checkStatus();
    this.backgroundRefreshStart();
  }

  backgroundRefreshStart() {
    if (!this.backgroundRefreshRunning) {
      console.log('backgroundRefresh : STARTED');
      this.backgroundRefresh = setInterval(() => {
        this.checkStatus();
      }, 10000)
      this.backgroundRefreshRunning = true;
    }
  }

  backgroundRefreshStop() {
    if (this.backgroundRefreshRunning) {
      console.log('backgroundRefresh : STOPPED');
      clearInterval(this.backgroundRefresh);
    }
  }
  

  tabBarIconsNeedRefreshing() {
    this.checkStatus();
  }

  checkStatus() {
    console.log('### Status Check [global.service.ts] checkStatus() ###');
    if (this.wbma.getLoginStatus()) {
      this.extra.getUserStatus(this.wbma.getMyUserID()).subscribe((stat) => {
        if (stat.success) {
          let tabBarNeedsRefreshing = false;
          if (this.badgeTabBarBorrowed !== stat.unreaded_borrowings) {
            this.badgeTabBarBorrowed = stat.unreaded_borrowings;
            tabBarNeedsRefreshing = true;
            this.events.publish('refresh-borrowed');
          }
          if (this.badgeTabBarLent !== stat.unhandled_lends) {
            this.badgeTabBarLent = stat.unhandled_lends;
            tabBarNeedsRefreshing = true;
            this.events.publish('refresh-lent');
          }
          if (this.badgeTabBarMessages !== stat.unreaded_messages) {
            this.badgeTabBarMessages = stat.unreaded_messages;
            tabBarNeedsRefreshing = true;
            this.events.publish('refresh-messages');
            this.notify.publish('New Message', '');
          }
          if (tabBarNeedsRefreshing) {
            this.events.publish('refresh-tab-badges');
          }
        }
      });
    } else {
      console.log('getStatus(): Cannot get, because of no session / login.');
    }
  }

  getBadgeTabBarLent() {
    return this.badgeTabBarLent;
  }

  getBadgeTabBarBorrowed() {
    return this.badgeTabBarBorrowed;
  }

  getBadgeTabBarMessages() {
    return this.badgeTabBarMessages;
  }

  focusSiteElementById(elementId: string) {
    setTimeout( () => {
      const nick = document.getElementById(elementId);
      nick.focus();
    }, 250);
  }
  
  async messagePrompt(headerText: string, messageText: string, fun?: any) {
    const alert = await this.alertController.create({
      header: headerText,
      message: messageText,
      buttons: [
        {
          text: 'OK',
          handler: fun
        }
      ]
    });
    await alert.present();
  }

  isEmailValid(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
