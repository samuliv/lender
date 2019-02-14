import { Component } from '@angular/core';
import { LendItem } from '../interfaces/lenditem';
import { Observable } from 'rxjs';
import { ExtraService } from '../extra.service';

@Component({
  selector: 'app-myitems',
  templateUrl: 'myitems.page.html',
  styleUrls: ['myitems.page.scss']
})
export class MyItemsPage {

  viewPage: string;
  listItems: Observable<LendItem[]>;

  constructor(public extra: ExtraService) {
    this.viewPage = 'all';
  }
  refreshList() {
    this.listItems = this.extra.getLendingsList(1);
  }
  ionViewDidEnter() {
    console.log('myitems.page.ts : ionViewDidEnter()');
    this.refreshList();
  }
}
