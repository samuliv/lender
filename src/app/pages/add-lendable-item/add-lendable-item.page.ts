import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-lendable-item',
  templateUrl: './add-lendable-item.page.html',
  styleUrls: ['./add-lendable-item.page.scss'],
})
export class AddLendableItemPage implements OnInit {

  constructor(private navController: NavController) { }

  ngOnInit() {
  }

  goBack() {
    this.navController.navigateBack('/my-lendable-items/:data');
  }

}
