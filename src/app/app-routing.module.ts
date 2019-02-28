import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'readmessage/:id', loadChildren: './pages/readmessage/readmessage.module#ReadMessagePageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'my-lendable-items', loadChildren: './pages/my-lendable-items/my-lendable-items.module#MyLendableItemsPageModule' },
  { path: 'browse-category', loadChildren: './pages/browse-category/browse-category.module#BrowseCategoryPageModule' },
  { path: 'choose-location', loadChildren: './pages/choose-location/choose-location.module#ChooseLocationPageModule' },
  { path: 'send-message', loadChildren: './pages/send-message/send-message.module#SendMessagePageModule' },
  { path: 'my-profile-page', loadChildren: './pages/my-profile-page/my-profile-page.module#MyProfilePagePageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
