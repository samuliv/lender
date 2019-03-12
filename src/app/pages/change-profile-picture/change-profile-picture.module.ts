import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChangeProfilePicturePage } from './change-profile-picture.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeProfilePicturePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChangeProfilePicturePage]
})
export class ChangeProfilePicturePageModule {}
