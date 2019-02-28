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
import { Router } from '@angular/router';
var MessagesPage = /** @class */ (function () {
    function MessagesPage(extra, router) {
        this.extra = extra;
        this.router = router;
        this.viewPage = 'inbox';
    }
    MessagesPage.prototype.ngOnInit = function () {
        console.log('myitems.page.ts : ngOnInit()');
        this.refreshAll();
    };
    MessagesPage.prototype.refreshInbox = function () {
        var _this = this;
        console.log('refreshInbox()');
        this.extra.getMessages(1).subscribe(function (res) {
            _this.inbox = res;
        });
    };
    MessagesPage.prototype.refreshOutbox = function () {
        var _this = this;
        console.log('refreshOutbox()');
        this.extra.getMessages(1).subscribe(function (res) {
            _this.inbox = res;
            console.log(res);
        });
    };
    MessagesPage.prototype.refreshFeedback = function () {
        var _this = this;
        console.log('refreshFeedback()');
        this.extra.getFeedback(1).subscribe(function (res) {
            _this.feedback = res;
        });
    };
    MessagesPage.prototype.refreshAll = function () {
        this.refreshInbox();
        this.refreshOutbox();
        this.refreshFeedback();
    };
    MessagesPage.prototype.readMessage = function (id) {
        this.router.navigate(['/readmessage/' + id]);
    };
    MessagesPage.prototype.refreshCurrent = function () {
        switch (this.viewPage) {
            case 'inbox':
                this.refreshInbox();
                break;
            case 'sent':
                this.refreshOutbox();
                break;
            default:
                this.refreshFeedback();
                break;
        }
    };
    MessagesPage.prototype.doRefresh = function (event) {
        console.log('doRefresh()');
        this.refreshCurrent();
        event.target.complete();
    };
    MessagesPage = __decorate([
        Component({
            selector: 'app-messages',
            templateUrl: 'messages.page.html',
            styleUrls: ['messages.page.scss']
        }),
        __metadata("design:paramtypes", [ExtraService, Router])
    ], MessagesPage);
    return MessagesPage;
}());
export { MessagesPage };
//# sourceMappingURL=messages.page.js.map