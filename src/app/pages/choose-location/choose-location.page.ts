import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-choose-location',
  templateUrl: './choose-location.page.html',
  styleUrls: ['./choose-location.page.scss'],
})
export class ChooseLocationPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private navController: NavController) { }

  ngOnInit() {
  }

  goBack() {
    const source = this.activatedRoute.snapshot.paramMap.get('source');
    switch ( source ) {
      case 'lent':
        this.navController.navigateBack('/tabs/lent');
        break;
      default:
        this.navController.navigateBack('/tabs/browse');
        break;
    }
  }


}
