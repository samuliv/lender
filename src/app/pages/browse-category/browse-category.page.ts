import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-browse-category',
  templateUrl: './browse-category.page.html',
  styleUrls: ['./browse-category.page.scss'],
})
export class BrowseCategoryPage implements OnInit {

  constructor(private navController: NavController, private activatedRoute: ActivatedRoute) { }

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
