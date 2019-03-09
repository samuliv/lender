import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MediaItem} from 'src/app/interfaces/mediaitem';
import {LoginInfo} from 'src/app/interfaces/logininfo';
import {UsernameAvailable} from 'src/app/interfaces/usernameavailable';
import {RegisterNewUserInfo} from 'src/app/interfaces/registernewuserinfo';
import {Router} from '@angular/router';
import {SearchFilteringOptions} from 'src/app/interfaces/searchfilteringoptions';
import {Success} from 'src/app/interfaces/success';
import {LendItem} from 'src/app/interfaces/lenditem';
import {User} from 'src/app/interfaces/user';

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
        if (this.getToken() !== '' && this.getMyUserID() !== -1) {
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

    accessTokenHeader() {
        return {
            headers: new HttpHeaders({
                'x-access-token': this.getToken(),
            })
        };
    }

    accessTokenHeaderWithJSON() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.getToken(),
            })
        };
    }

    logout() {
        localStorage.removeItem('token');
        this.setLoginStatus(false);
        console.log('logout() finished.');
    }

    getToken() {
        if (localStorage.getItem('token') == null || localStorage.getItem('token') === '') {
            return '';
        }
        return localStorage.getItem('token');
    }

    getMyUserID() {
        if (localStorage.getItem('user_id') == null || localStorage.getItem('user_id') === '') {
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
        return this.http.get<MediaItem[]>(this.apiUrl + 'tags/' + this.appTag);
    }

    getAllMediaByAppTagAsMediaItem() {
        return this.http.get<MediaItem[]>(this.apiUrl + 'tags/' + this.appTag);
    }

    getUserInformation(user_id: number) {
        return this.http.get<User>(this.apiUrl + 'users/' + user_id.toString(), this.accessTokenHeader());
    }

    getSingleMedia(media_id: number) {
        return this.http.get<MediaItem>(this.apiUrl + 'media/' + media_id.toString());
    }

    loginPost(formData: any) {
        return this.http.post<LoginInfo>(this.apiUrl + 'login', formData);
    }

    login(username: string, password: string) {
        const formData = {'username': username, 'password': password};
        this.loginPost(formData).subscribe(res => {
            if (res.message === 'Logged in successfully') {
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

    register(username: string, password: string, email: string, full_name: string) {
        const formData = {'username': username, 'password': password, 'email': email, 'full_name': full_name};
        this.registerPost(formData).subscribe(res => {
            console.log(res);
        });
    }

    registerPost(formData: any) {
        return this.http.post<RegisterNewUserInfo>(this.apiUrl + 'users', formData);
    }

    deleteMedia(media_id: number) {
        return this.http.delete<any>(this.apiUrl + 'media/' + media_id, this.accessTokenHeader());
    }

    addTagToFile(file_id: number, tag: string) {
        const formData = {'file_id': file_id, 'tag': tag};
        return this.http.post<any>(this.apiUrl + 'tags', formData, this.accessTokenHeaderWithJSON());
    }

    updateMyProfile(formData: FormData) {
        return this.http.put<any>(this.apiUrl + 'users', formData, this.accessTokenHeaderWithJSON());
    }

    uploadFile(formData: FormData) {
        return this.http.post<any>(this.apiUrl + 'media', formData, this.accessTokenHeader());
    }

    updateMediaItem(id: number, title: string, description: string) {
        return this.http.put<any>(
            this.apiUrl + 'media/' + id.toString(),
            {
                'title': title,
                'description': description
            },
            this.accessTokenHeader()
        );
    }

    dataMerge(arr: LendItem[]) {
        if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                arr[i].item_thumb = './assets/imgs/lendertest2.png';
                this.getSingleMedia(arr[i].item_id).subscribe((res) => {
                    arr[i].item_title = res.title;
                    if (res.hasOwnProperty('thumbnails') && res.thumbnails.hasOwnProperty('w160')) {
                        arr[i].item_thumb = this.getApiUploadsUrl() + res.thumbnails.w160;
                    }
                });
            }
        }
    }

    getApiUrl() {
        return this.apiUrl;
    }

    getApiUploadsUrl() {
        return this.getApiUrl() + 'uploads/';
    }

    getAppTag() {
        return this.appTag;
    }

    readSingleMediaData(mediaItem: MediaItem) {
        mediaItem.media_data = JSON.parse(mediaItem.description);
        mediaItem.media_data.thumb = this.getApiUploadsUrl() + mediaItem.filename.split('.').slice(0, -1).join('.') + '-tn160.png';
    }

    readMediaData(mediaItem: MediaItem[]) {
        mediaItem.forEach((i) => {
            this.readSingleMediaData(i);
        });
        return mediaItem;
    }

    filterMediaItems(mediaItems: MediaItem[], filteringOptions: SearchFilteringOptions) {
        return mediaItems;
    }

}
