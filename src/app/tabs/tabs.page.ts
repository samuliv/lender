import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  badgeNumberLent: number;
  badgeNumberBorrowed: number;
  badgeNumberMessages: number;
  constructor () {
    this.badgeNumberMessages = 1;
    this.badgeNumberLent = 0;
    this.badgeNumberBorrowed = 0;
  }
}
