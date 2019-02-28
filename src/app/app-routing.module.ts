import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'readmessage/:id', loadChildren: './readmessage/readmessage.module#ReadMessagePageModule' },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'my-lendable-items', loadChildren: './my-lendable-items/my-lendable-items.module#MyLendableItemsPageModule' },
  { path: 'browse-category', loadChildren: './browse-category/browse-category.module#BrowseCategoryPageModule' },
  { path: 'choose-location', loadChildren: './choose-location/choose-location.module#ChooseLocationPageModule' },
  { path: 'send-message', loadChildren: './send-message/send-message.module#SendMessagePageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
