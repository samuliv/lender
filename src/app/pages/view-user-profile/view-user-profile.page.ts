import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.page.html',
  styleUrls: ['./view-user-profile.page.scss'],
})
export class ViewUserProfilePage implements OnInit {

  constructor(
    private navController: NavController,
  ) { }

  ngOnInit() {
  }

  goBack() {
    this.navController.navigateBack('/tabs/browse');
  }

}
