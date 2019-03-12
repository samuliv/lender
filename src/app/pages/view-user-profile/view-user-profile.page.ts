import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.page.html',
  styleUrls: ['./view-user-profile.page.scss'],
})
export class ViewUserProfilePage implements OnInit {

  params: string[] = [];
  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
  ) {
    this.params = this.activatedRoute.snapshot.paramMap.get('params').split('_');
  }

  ngOnInit() {
  }

  goBack() {
    switch (this.params[1]) {
      case 'browse':
        this.navController.navigateBack('/tabs/browse');
        break;
      case 'lent':
        this.navController.navigateBack('/tabs/lent');
        break;
      case 'borrowed':
        this.navController.navigateBack('/tabs/borrowed');
        break;
      case 'readmessage':
        this.navController.navigateBack('/readmessage/' + this.params[2]);
        break;
    }
  }

}
