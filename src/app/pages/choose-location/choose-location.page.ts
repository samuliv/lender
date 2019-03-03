import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { OpenCageDataService } from 'src/app/services/opencagedata/opencagedata.service';
import { Address } from 'src/app/interfaces/address';

@Component({
  selector: 'app-choose-location',
  templateUrl: './choose-location.page.html',
  styleUrls: ['./choose-location.page.scss'],
})
export class ChooseLocationPage implements OnInit {

  addressOptions: Address[];
  address: string;
  constructor(private activatedRoute: ActivatedRoute, private navController: NavController, private ocds: OpenCageDataService) { }

  ngOnInit() {
  }

  itemClick(item: Address) {
    console.log(item.coordinates.latitude + ', ' + item.coordinates.longitude);
  }

  searchForAddress() {
    this.ocds.searchByAddress(this.address).subscribe((res) => {
      this.addressOptions = this.ocds.translateToAddress(res);
    });
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
