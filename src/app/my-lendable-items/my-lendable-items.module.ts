import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyLendableItemsPage } from './my-lendable-items.page';

const routes: Routes = [
  {
    path: '',
    component: MyLendableItemsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyLendableItemsPage]
})
export class MyLendableItemsPageModule {}
