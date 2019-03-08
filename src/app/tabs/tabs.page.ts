import { Component } from '@angular/core';
import { GlobalService } from '../services/global/global.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  badgeNumberLent: number;
  badgeNumberBorrowed: number;
  badgeNumberMessages: number;
  
  constructor (
    private glbl: GlobalService,
    private events: Events,
  ) {
    this.fetchBadgeNumbers();
    this.events.subscribe('refresh-tab-badges', () => {
      this.fetchBadgeNumbers();
    });
  }

  fetchBadgeNumbers() {
    this.badgeNumberBorrowed = this.glbl.getBadgeTabBarBorrowed();
    this.badgeNumberLent = this.glbl.getBadgeTabBarLent();
    this.badgeNumberMessages = this.glbl.getBadgeTabBarMessages();
  }

}
