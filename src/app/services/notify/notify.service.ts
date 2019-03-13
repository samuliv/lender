import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    private localNotifications: LocalNotifications,
  ) { }

  publish (notificationText: string, dataParameters: string) {
    console.log('Notify Publish: ' + notificationText);
    this.localNotifications.schedule({
      text: notificationText,
      data: dataParameters
    });
  }

}
