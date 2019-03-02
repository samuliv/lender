import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { MediaData } from 'src/app/interfaces/mediadata';

@Component({
  selector: 'app-my-lendable-items',
  templateUrl: './my-lendable-items.page.html',
  styleUrls: ['./my-lendable-items.page.scss'],
})
export class MyLendableItemsPage implements OnInit {

  constructor(private navController: NavController, private activatedRoute: ActivatedRoute, private wbma: WbmaService) { }

  myLendableItems: MediaData[];
  showNoItemsAddedMessage: boolean;

  ngOnInit() {
    this.showNoItemsAddedMessage = false;
    this.refreshList();
  }

  refreshList() {
    this.wbma.getLendableItems().subscribe((res) => {
      res = this.wbma.readMediaData(res);
      console.log(res);
    });
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
