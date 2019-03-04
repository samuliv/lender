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

  private serialize (obj: any) {
    const str = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return '&' + str.join('&');
  }

  public acceptRequest(request_id: number) {
    return this.http.get<Success>(this.extraURL + '?operation=acceptRequest&request_id=' + request_id.toString());
  }

  public rejectRequest(request_id: number) {
    return this.http.get<Success>(this.extraURL + '?operation=rejectRequest&request_id=' + request_id.toString());
  }

  public cancelRequest(request_id: number) {
    return this.http.get<Success>(this.extraURL + '?operation=cancelRequest&request_id=' + request_id.toString());
  }

  public getListLent(user_id: number) {
    return this.http.get<LendItem[]>(this.extraURL + '?operation=lends&user_id=' + user_id);
  }

  public getListLentPending(user_id: number) {
    return this.http.get<LendItem[]>(this.extraURL + '?operation=lends&pending=true&user_id=' + user_id);
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

  public getCategories() {
    return this.http.get<any>(this.extraURL + '?operation=categories2');
  }

  public markMessageAsReaded(message_id: number) {
    return this.http.get<Success>(this.extraURL + '?operation=markmessageasreaded&id=' + message_id);
  }

  public backgroundRefresh() {
    // todo
  }

}
