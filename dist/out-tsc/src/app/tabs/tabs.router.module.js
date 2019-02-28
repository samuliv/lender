var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';
var routes = [
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
var TabsPageRoutingModule = /** @class */ (function () {
    function TabsPageRoutingModule() {
    }
    TabsPageRoutingModule = __decorate([
        NgModule({
            imports: [
                RouterModule.forChild(routes)
            ],
            exports: [RouterModule]
        })
    ], TabsPageRoutingModule);
    return TabsPageRoutingModule;
}());
export { TabsPageRoutingModule };
//# sourceMappingURL=tabs.router.module.js.map