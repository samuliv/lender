import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MediaItem } from 'src/app/interfaces/mediaitem';
import { LoginInfo } from 'src/app/interfaces/logininfo';
import { UsernameAvailable } from 'src/app/interfaces/usernameavailable';
import { RegisterNewUserInfo } from 'src/app/interfaces/registernewuserinfo';
import { Router } from '@angular/router';
import { MediaData } from 'src/app/interfaces/mediadata';
import { Observable } from 'rxjs';
import { LendItem } from 'src/app/interfaces/lenditem';
import { map } from 'rxjs/operators';
import { SearchFilteringOptions } from 'src/app/interfaces/searchfilteringoptions';
/*
  WBMA-api Communication Service
 */
@Injectable({
  providedIn: 'root'
})
export class WbmaService {
  private apiUrl = 'http://media.mw.metropolia.fi/wbma/';
  private appTag = 'LENDER';
  private loggedIn = false;
  constructor(private http: HttpClient, private router: Router) {
    if (this.getToken() !== '' && this.getMyUserID() !== -1 ) {
      console.log('Login found. User ID: ' + this.getMyUserID());
      this.setLoginStatus(true);
    }
  }

  setLoginStatus(status: boolean) {
    console.log('setLoginStatus: [' + status + ']');
    if (this.loggedIn !== status) {
      this.loggedIn = status;
      // this.events.publish('loginstatuschange'); TODO
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.setLoginStatus(false);
    console.log('logout() finished.');
  }

  getToken() {
    if ( localStorage.getItem('token') == null || localStorage.getItem('token') === '' ) {
      return '';
    }
    return localStorage.getItem('token');
  }

  getMyUserID() {
    if ( localStorage.getItem('user_id') == null || localStorage.getItem('user_id') === '' ) {
      return -1;
    }
    return parseInt(localStorage.getItem('user_id'), 10);
  }

  checkIfUserExists(userName: string) {
    return this.http.get<UsernameAvailable>(this.apiUrl + 'users/username/' + userName);
  }

  getLoginStatus() {
    console.log('getLoginStatus() : ' + this.loggedIn);
    return this.loggedIn;
  }

  getLendableItems() {
    return this.http.get<MediaItem[]>(this.apiUrl + 'tags/' + this.appTag)
  }

  getAllMediaByAppTagAsMediaItem() {
    return this.http.get<MediaItem[]>(this.apiUrl + 'tags/' + this.appTag);
  }

  loginPost(formData: any) {
    return this.http.post<LoginInfo>(this.apiUrl + 'login', formData);
  }

  login(username: string, password: string) {
    const formData = { 'username' : username, 'password': password };
    this.loginPost(formData).subscribe(res => {
      if ( res.message === 'Logged in successfully' ) {
        console.log('SUCCESS: Login OK.');
        localStorage.setItem('token', res.token);
        localStorage.setItem('user_id', res.user.user_id.toString());
        this.setLoginStatus(true);
        this.router.navigate(['tabs/browse']);
      } else {
        console.log('ERROR: ' + res.message);
      }
    });
  }

  register(formData: any) {
    return this.http.post<RegisterNewUserInfo>(this.apiUrl + 'users', formData);
  }

  addTagToFile(file_id: number, tag: string) {
    const formData = { 'file_id' : file_id, 'tag': tag };
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.getToken(),
      })
    };
    return this.http.post<any>(this.apiUrl + 'tags', formData, headers);
  }

  updateMyProfile(formData: FormData) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.getToken(),
      })
    };
    return this.http.put<any>(this.apiUrl + 'users', formData, headers);
  }

  uploadFile(formData: FormData) {
    const headers = {
      headers: new HttpHeaders({
        'x-access-token': this.getToken(),
      })
    };
    return this.http.post<any>(this.apiUrl + 'media', formData, headers);
  }

  updateMediaItem(id: number, title: string, description: string) {
    const headers = {
      headers: new HttpHeaders({
        'x-access-token': this.getToken(),
      })
    };
    return this.http.put<any>(this.apiUrl + 'media/' + id.toString(), { 'title': title, 'description': description }, headers);
  }

  getApiUrl() {
    return this.apiUrl;
  }

  getApiUploadsUrl() {
    return this.getApiUrl() + 'uploads/';
  }

  readMediaData(mediaItem: MediaItem[]) {
    mediaItem.forEach((i) => {
      i.media_data = JSON.parse(i.description);
      i.media_data.thumb = this.getApiUploadsUrl() + i.filename.split('.').slice(0, -1).join('.') + '-tn160.png';
    });
    return mediaItem;
  }

  filterMediaItems(mediaItems: MediaItem[], filteringOptions: SearchFilteringOptions) {
    return mediaItems;
  }

}
