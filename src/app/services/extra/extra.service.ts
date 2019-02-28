import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LendItem } from '../../interfaces/lenditem';
import { Message } from '../../interfaces/message';
import { Feedback } from '../../interfaces/feedback';
import { Success } from '../../interfaces/success';

@Injectable({
  providedIn: 'root'
})
export class ExtraService {

  extraURL = 'https://tucloud.fi/metropolia/lender/';

  constructor(private http: HttpClient) {
  }

  private serialize (obj) {
    const str = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return '&' + str.join('&');
  }

  private async xtraGET (operation: string, parameters: any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.extraURL + '?operation=' + operation + this.serialize(parameters)).subscribe((data: any) => {
        if ( !data.success ) {
          console.log(data);
          console.error('[xtraGET] [error] : ' + data.error);
        }
        resolve(data);
      });
    });
  }

  public getListLent(user_id: number) {
    return this.http.get<LendItem[]>(this.extraURL + '?operation=lent&user_id=' + user_id);
  }

  public getMessages(user_id: number) {
    return this.http.get<Message[]>(this.extraURL + '?operation=messages&user_id=' + user_id);
  }

  public getMessage(message_id: number) {
    return this.http.get<Message>(this.extraURL + '?operation=message&message_id=' + message_id);
  }

  public getFeedback(user_id: number) {
    return this.http.get<Feedback[]>(this.extraURL + '?operation=feedback&user_id=' + user_id);
  }

  public markMessageAsReaded(message_id: number) {
    return this.http.get<Success>(this.extraURL + '?operation=markmessageasreaded&id=' + message_id);
  }

  public backgroundRefresh() {
    // todo
  }

}