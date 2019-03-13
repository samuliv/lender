import { Injectable } from '@angular/core';
import { Events, AlertController, ToastController } from '@ionic/angular';
import { ExtraService } from '../extra/extra.service';
import { WbmaService } from '../wbma/wbma.service';
import { NotifyService } from '../notify/notify.service';
import { MediaItem } from 'src/app/interfaces/mediaitem';
import { Network } from '@ionic-native/network/ngx';
import { Badge } from '@ionic-native/badge/ngx';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  badgeTabBarLent = 0;
  badgeTabBarBorrowed = 0;
  badgeTabBarMessages = 0;
  currentAppBadge = 0;
  backgroundRefresh: any;
  backgroundRefreshRunning = false;
  mediaItemsChace: MediaItem[] = [];
  ntwrkStatus = true;

  constructor(
    private events: Events,
    private extra: ExtraService,
    private wbma: WbmaService,
    private notify: NotifyService,
    private alertController: AlertController,
    private network: Network,
    private tosastController: ToastController,
    private badge: Badge,
  ) {
    this.checkStatus();
    this.backgroundRefreshStart();
    this.startNetworkStatusSubscribtion();
  }

  getNetworkStatus() {
    return this.ntwrkStatus;
  }

  /* Monitor the network Online/Offline Status */
  startNetworkStatusSubscribtion() {
    let disconnect = this.network.onDisconnect().subscribe(() => {
      if (this.ntwrkStatus === true) {
        this.ntwrkStatus = false;
        this.events.publish('network-status-changed', true);
        this.presentToast('Network Offline'), 'danger';
      }
    });
    let connect = this.network.onConnect().subscribe(() => {
      if (this.ntwrkStatus === false) {
        this.ntwrkStatus = true;
        this.events.publish('network-status-changed', false);
        this.events.publish('network-went-to-offline');
        this.presentToast('Network Online');
      }
    });
  }

  async presentToast(text: string, color?: string) {
    if (!color) {
      color = '';
    }
    const toast = await this.tosastController.create({
      message: text,
      position: 'top',
      duration: 3000
    });
    toast.present();
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

  refreshAppBadge() {
    const badgeNumberToBe = this.badgeTabBarBorrowed + this.badgeTabBarLent + this.badgeTabBarMessages;
    if (this.currentAppBadge != badgeNumberToBe) {
      // Update app badge number
      if (badgeNumberToBe === 0) {
        this.badge.clear();
        this.currentAppBadge = 0;
      } else {
        this.badge.set(badgeNumberToBe);
        this.currentAppBadge = badgeNumberToBe;
      }
    }
  }

  checkStatus() {
    console.log('### Status Check [global.service.ts] checkStatus() ###');
    if (this.wbma.getLoginStatus()) {
      this.extra.getUserStatus(this.wbma.getMyUserID()).subscribe((stat) => {
        if (stat.success) {
          let tabBarNeedsRefreshing = false;
          if (this.badgeTabBarBorrowed !== stat.unreaded_borrowings) {
            if (this.badgeTabBarBorrowed < stat.unreaded_borrowings) {
              this.events.publish('refresh-borrowed');
            }
          this.badgeTabBarBorrowed = stat.unreaded_borrowings;
          tabBarNeedsRefreshing = true;
          }
          if (this.badgeTabBarLent !== stat.unhandled_lends) {
            if (this.badgeTabBarLent < stat.unhandled_lends) {
              this.events.publish('refresh-lent');
            }
          this.badgeTabBarLent = stat.unhandled_lends;
          tabBarNeedsRefreshing = true;
          }
          if (this.badgeTabBarMessages !== stat.unreaded_messages) {
            if (this.badgeTabBarMessages < stat.unreaded_messages) {
              this.events.publish('refresh-messages');
              this.notify.publish('New Message', '');
              }
            this.badgeTabBarMessages = stat.unreaded_messages;
            tabBarNeedsRefreshing = true;
            }
          if (tabBarNeedsRefreshing) {
            this.events.publish('refresh-tab-badges');
          }
          this.refreshAppBadge();
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

  mediaItemsChaceSet(value: MediaItem[]) {
    this.mediaItemsChace = value;
  }
  mediaItemsChaceClear() {
    this.mediaItemsChace = [];
  }
  mediaItemsChaceGet() {
    return this.mediaItemsChace;
  }

}
