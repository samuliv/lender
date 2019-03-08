import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard] },
  { path: 'readmessage/:id', loadChildren: './pages/readmessage/readmessage.module#ReadMessagePageModule', canActivate: [AuthGuard] },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule', canActivate: [AuthGuard] },
  { path: 'my-lendable-items/:source',
    loadChildren: './pages/my-lendable-items/my-lendable-items.module#MyLendableItemsPageModule',
    canActivate: [AuthGuard] },
  { path: 'browse-category/:source',
    loadChildren: './pages/browse-category/browse-category.module#BrowseCategoryPageModule',
    canActivate: [AuthGuard] },
  { path: 'choose-location/:source',
    loadChildren: './pages/choose-location/choose-location.module#ChooseLocationPageModule',
    canActivate: [AuthGuard] },
  { path: 'send-message/:source',
    loadChildren: './pages/send-message/send-message.module#SendMessagePageModule',
    canActivate: [AuthGuard] },
  { path: 'my-profile', loadChildren: './pages/my-profile/my-profile.module#MyProfilePageModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'add-lendable-item/:source', loadChildren: './pages/add-lendable-item/add-lendable-item.module#AddLendableItemPageModule' },
  { path: 'view-media', loadChildren: './pages/viewMedia/view-media/view-media.module#ViewMediaPageModule' },
  { path: 'view-media', loadChildren: './pages/view-media/view-media.module#ViewMediaPageModule' },
  { path: 'request-item', loadChildren: './pages/request-item/request-item.module#RequestItemPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
