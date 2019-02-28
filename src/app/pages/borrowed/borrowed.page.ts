import { Component } from '@angular/core';

@Component({
  selector: 'app-borrowed',
  templateUrl: 'borrowed.page.html',
  styleUrls: ['borrowed.page.scss']
})
export class BorrowedPage {
  viewPage: string;
  constructor() {
    this.viewPage = 'all';
  }
}
