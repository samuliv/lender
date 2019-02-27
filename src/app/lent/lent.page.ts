import { Component } from '@angular/core';
import { LendItem } from '../interfaces/lenditem';
import { Observable } from 'rxjs';
import { ExtraService } from '../extra.service';

@Component({
  selector: 'app-lent',
  templateUrl: 'lent.page.html',
  styleUrls: ['lent.page.scss']
})
export class LentPage {

  viewPage: string;
  listItems: Observable<LendItem[]>;

  constructor(public extra: ExtraService) {
    this.viewPage = 'all';
  }
  refreshList() {
    this.listItems = this.extra.getLendingsList(1);
  }
  ionViewDidEnter() {
    console.log('lent.page.ts : ionViewDidEnter()');
    this.refreshList();
  }
}
