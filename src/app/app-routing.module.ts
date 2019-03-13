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
  { path: 'add-lendable-item/:source', loadChildren: './pages/add-lendable-item/add-lendable-item.module#AddLendableItemPageModule', canActivate: [AuthGuard] },
  { path: 'view-media/:id', loadChildren: './pages/view-media/view-media.module#ViewMediaPageModule', canActivate: [AuthGuard] },
  { path: 'request-item/:id', loadChildren: './pages/request-item/request-item.module#RequestItemPageModule', canActivate: [AuthGuard] },
  { path: 'give-feedback/:source', loadChildren: './pages/give-feedback/give-feedback.module#GiveFeedbackPageModule', canActivate: [AuthGuard] },
  { path: 'change-password', loadChildren: './pages/change-password/change-password.module#ChangePasswordPageModule', canActivate: [AuthGuard] },
  { path: 'browse-map/:params', loadChildren: './pages/browse-map/browse-map.module#BrowseMapPageModule', canActivate: [AuthGuard] },
  { path: 'set-default-location/:params', loadChildren: './pages/set-default-location/set-default-location.module#SetDefaultLocationPageModule', canActivate: [AuthGuard] },
  { path: 'view-user-profile/:params', loadChildren: './pages/view-user-profile/view-user-profile.module#ViewUserProfilePageModule', canActivate: [AuthGuard] },
  { path: 'change-profile-picture', loadChildren: './pages/change-profile-picture/change-profile-picture.module#ChangeProfilePicturePageModule', canActivate: [AuthGuard] },
  { path: 'view-item/:params', loadChildren: './pages/view-item/view-item.module#ViewItemPageModule', canActivate: [AuthGuard] }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
