import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddLendableItemPage } from './add-lendable-item.page';

const routes: Routes = [
  {
    path: '',
    component: AddLendableItemPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddLendableItemPage]
})
export class AddLendableItemPageModule {}
