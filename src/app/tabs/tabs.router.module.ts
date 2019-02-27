import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'browse',
        children: [
          {
            path: '',
            loadChildren: '../browse/browse.module#BrowsePageModule'
          }
        ]
      },
      {
        path: 'lent',
        children: [
          {
            path: '',
            loadChildren: '../lent/lent.module#LentPageModule'
          }
        ]
      },
      {
        path: 'borrowed',
        children: [
          {
            path: '',
            loadChildren: '../borrowed/borrowed.module#BorrowedPageModule'
          }
        ]
      },
      {
        path: 'messages',
        children: [
          {
            path: '',
            loadChildren: '../messages/messages.module#MessagesPageModule'
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: '../settings/settings.module#SettingsPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/browse',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/browse',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
