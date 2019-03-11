import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-set-default-location',
  templateUrl: './set-default-location.page.html',
  styleUrls: ['./set-default-location.page.scss'],
})
export class SetDefaultLocationPage implements OnInit {

  constructor(
    private navController: NavController,
  ) { }

  ngOnInit() {
  }

  goBack() {
    this.navController.navigateBack('/tabs/browse');
  }
}
