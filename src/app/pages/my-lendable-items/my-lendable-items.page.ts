import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-my-lendable-items',
  templateUrl: './my-lendable-items.page.html',
  styleUrls: ['./my-lendable-items.page.scss'],
})
export class MyLendableItemsPage implements OnInit {

  constructor(private navController: NavController) { }

  ngOnInit() {
  }

  goBack() {
    this.navController.navigateBack('/tabs/settings');
  }

}
