import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GiveFeedbackPage } from './give-feedback.page';

const routes: Routes = [
  {
    path: '',
    component: GiveFeedbackPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GiveFeedbackPage]
})
export class GiveFeedbackPageModule {}
