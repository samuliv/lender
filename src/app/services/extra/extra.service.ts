import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LendItem } from '../../interfaces/lenditem';
import { Message } from '../../interfaces/message';
import { Feedback } from '../../interfaces/feedback';
import { Success } from '../../interfaces/success';
import { UserInfo } from '../../interfaces/user-info';
import { MediaItem } from 'src/app/interfaces/mediaitem';
import { AvailabilityResponse } from 'src/app/interfaces/availabilityresponse';
import { Status } from 'src/app/interfaces/status';
import { Category } from 'src/app/interfaces/category';

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

  public itemDeleted(item_id: number) {
    return this.http.get<Success>(this.extraURL + '?operation=item-deleted&item_id=' + item_id.toString());
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

  public getMessages(user_id: number, sent?: boolean) {
    return this.http.get<Message[]>(this.extraURL + '?operation=messages&user_id=' + user_id + (sent ? '&sent=true' : ''));
  }

  public getMessage(message_id: number) {
    return this.http.get<Message>(this.extraURL + '?operation=message&message_id=' + message_id);
  }

  public getFeedback(user_id: number) {
    return this.http.get<Feedback[]>(this.extraURL + '?operation=feedback&user_id=' + user_id);
  }

  public getUserStatus(user_id: number) {
    return this.http.get<Status>(this.extraURL + '?operation=status&user_id=' + user_id);
  }

  public getCategories() {
    return this.http.get<any>(this.extraURL + '?operation=categories2');
  }

  public markMessageAsReaded(message_id: number) {
    return this.http.get<Success>(this.extraURL + '?operation=markmessageasreaded&id=' + message_id);
  }

  public getCategoryNameById(id: number) {
    return this.http.get<Category>(this.extraURL + '?operation=get-category-byid&id=' + id);
  }

  public requestLend(item_id: number, time_from: string, time_to: string, requester: number, owner: number) {
    return this.http.get<Success>(this.extraURL + '?operation=lend-request&id=' + item_id.toString() + '&start=' + 
                                  time_from + '&end=' + time_to + '&requester=' + requester.toString() + '&owner=' + owner.toString());
  }

  public getUserInfo(user_id: number) {
    return this.http.get<UserInfo>(this.extraURL + '?operation=user-info&user_id=' + user_id.toString());
  }

  public backgroundRefresh() {
    // todo
  }

  public availabilityCheck(item: MediaItem, startTime: string, endTime: string) {
    return this.http.get<AvailabilityResponse>(this.extraURL + '?operation=availability-check&id=' + item.file_id + '&start=' + startTime + '&end=' + endTime + '&owner=' + item.user_id);
  }

}
