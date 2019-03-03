import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-browse-category',
  templateUrl: './browse-category.page.html',
  styleUrls: ['./browse-category.page.scss'],
})
export class BrowseCategoryPage implements OnInit {

  source: string;
  subParameters: string;

  constructor(private navController: NavController, private activatedRoute: ActivatedRoute) {
    const fullSource: string = this.activatedRoute.snapshot.paramMap.get('source');
    const splitted: string[] = fullSource.split('_');

    this.source = splitted[0];
    if ( splitted.length > 1 ) {
      this.subParameters = splitted[1];
    } else {
      this.subParameters = '';
    }

    console.log('Source: ' + this.source);
    console.log('subParameters: ' + this.subParameters);
    //console.log('edit_id: ' + this.edit_id);

    if ( splitted.length > 1 ) {
      this.subParameters = splitted[1];
    } else {
      this.subParameters = '';
    }


  }

  ngOnInit() {
  }

  goBack() {
    switch ( this.source ) {
      case 'add-lendable-item':
        this.navController.navigateBack('/add-lendable-item/' + this.subParameters);
        break;
      case 'lent':
        this.navController.navigateBack('/tabs/lent');
        break;
      default:
        this.navController.navigateBack('/tabs/browse');
        break;
    }
  }

}
