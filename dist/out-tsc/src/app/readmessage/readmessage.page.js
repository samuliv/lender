var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ExtraService } from '../extra.service';
import { NavController } from '@ionic/angular';
var ReadMessagePage = /** @class */ (function () {
    function ReadMessagePage(extra, navController) {
        this.extra = extra;
        this.navController = navController;
        this.message.from = 0;
    }
    ReadMessagePage.prototype.ngOnInit = function () {
        var _this = this;
        this.extra.getMessage(1).subscribe(function (res) {
            _this.message = res;
            console.log('=)');
        });
    };
    ReadMessagePage.prototype.goBack = function () {
        this.navController.navigateBack('/tabs/messages');
    };
    ReadMessagePage = __decorate([
        Component({
            selector: 'app-readmessage',
            templateUrl: 'readmessage.page.html',
            styleUrls: ['readmessage.page.scss']
        }),
        __metadata("design:paramtypes", [ExtraService, NavController])
    ], ReadMessagePage);
    return ReadMessagePage;
}());
export { ReadMessagePage };
//# sourceMappingURL=readmessage.page.js.map