import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-lendable-items',
  templateUrl: './my-lendable-items.page.html',
  styleUrls: ['./my-lendable-items.page.scss'],
})
export class MyLendableItemsPage implements OnInit {

  constructor(private navController: NavController, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  goBack() {
    const source = this.activatedRoute.snapshot.paramMap.get('source');
    if (source === 'settings') {
      this.navController.navigateBack('/tabs/settings');
    } else {
      this.navController.navigateBack('/tabs/lent');
    }
  }

}
