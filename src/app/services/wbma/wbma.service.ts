import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MediaItem} from 'src/app/interfaces/mediaitem';
import {LoginInfo} from 'src/app/interfaces/logininfo';
import {UsernameAvailable} from 'src/app/interfaces/usernameavailable';
import {RegisterNewUserInfo} from 'src/app/interfaces/registernewuserinfo';
import {Router} from '@angular/router';
import {SearchFilteringOptions} from 'src/app/interfaces/searchfilteringoptions';
import {User} from 'src/app/interfaces/user';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WbmaMergableItem } from 'src/app/interfaces/wbma-mergable-item';
import { MemoryService } from '../memory/memory.service';
import { WbmaMergableUserItem } from 'src/app/interfaces/wbma-mergable-useritem';
import { Events } from '@ionic/angular';

/*
  Metropolia WBMA-api Communication Service
 */
@Injectable({
    providedIn: 'root'
})
export class WbmaService {

    private apiUrl = 'http://media.mw.metropolia.fi/wbma/';
    private appTag = 'LENDER';
    private loggedIn = false;

    constructor(private http: HttpClient, private router: Router, private memory: MemoryService) {
        if (this.getToken() !== '' && this.getMyUserID() !== -1) {
            console.log('Login found. User ID: ' + this.getMyUserID());
            this.setLoginStatus(true);
        }
    }

    setLoginStatus(status: boolean) {
        console.log('setLoginStatus: [' + status + ']');
        if (this.loggedIn !== status) {
            this.loggedIn = status;
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

    getAllMediaByUserID(user_id: number) {
        return this.http.get<MediaItem[]>(this.apiUrl + 'media/user/' + user_id);
    }

    getUserInformation(user_id: number) {
        return this.http.get<User>(this.apiUrl + 'users/' + user_id.toString(), this.accessTokenHeader());
    }

    getAllUsers() {
        return this.http.get<User[]>(this.apiUrl + 'users', this.accessTokenHeader());
    }


    getSingleMedia(media_id: number) {
        return this.http.get<MediaItem>(this.apiUrl + 'media/' + media_id.toString());
    }

    loginPost(formData: any) {
        return this.http.post<LoginInfo>(this.apiUrl + 'login', formData);
    }

    login(username: string, password: string) {
        return new Promise((resolve, reject) => {
            const formData = {'username': username, 'password': password};
            this.loginPost(formData)
            .pipe(catchError(err => {
                reject(err.error.message);
                return throwError(err);
            }))
            .subscribe(res => {
                if (res.message === 'Logged in successfully') {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user_id', res.user.user_id.toString());
                    this.setLoginStatus(true);
                    this.memory.setMyInfo(res.user.username, res.user.email);
                    this.router.navigate(['tabs/browse']);
                    resolve('');
                } else {
                    console.log('ERROR: ' + res.message);
                    reject(res.message);
                }
            });
        });
    }

    getTempProfilePic() {
        return 'https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png';
    }

    getUserProfilePicture(user_id: number) {
        return new Promise((resolve, reject) => {
            this.getAllMediaByUserID(user_id).subscribe((userMedia) => {
                let profilePic = '';
                for (let i = 0; i < userMedia.length; i++) {
                    if ( userMedia[i].description === 'lender-profile-picture' && userMedia[i].title === 'lender-profile-picture' ) {
                        profilePic = this.getApiUploadsUrl() + userMedia[i].filename;
                    }
                }
                if (profilePic !== '') {
                    resolve(profilePic);
                }
            });
        });
    }

    register(username: string, password: string, email: string, full_name: string) {
        const formData = {'username': username, 'password': password, 'email': email, 'full_name': full_name};
        return this.http.post<RegisterNewUserInfo>(this.apiUrl + 'users', formData);
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

    updateMyProfile(formData: any) {
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

    dataMerge(arr: WbmaMergableItem[]) {
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

    usernameMerge(arr: WbmaMergableUserItem[]) {
        if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                this.getUserInformation(arr[i].user_id).subscribe((userInfo) => {
                    arr[i].user_name = userInfo.username;
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
        //986
        if(mediaItem.file_id === 986) {
            console.log(mediaItem);
        }
        mediaItem.media_data = JSON.parse(mediaItem.description);
        mediaItem.media_data.thumb = this.getApiUploadsUrl() + mediaItem.filename.split('.').slice(0, -1).join('.') + '-tn160.png';
    }

    /* Prefilter data because not fully working WBMA Backend =( */
    preFilter(mediaItem: MediaItem[]) {
        if (mediaItem.length > 0) {
            for (let i = mediaItem.length-1; i>=0; i--) {
              if (mediaItem[i].description === 'lender-profile-picture') {
                mediaItem.splice(i,1);
              }
            }
          }
    }

    readMediaData(mediaItem: MediaItem[]) {
        mediaItem.forEach((i) => {
            if (i.description !== 'lender-profile-picture') {
                this.readSingleMediaData(i);
            }
        });
        return mediaItem;
    }

    filterMediaItems(mediaItems: MediaItem[], filteringOptions: SearchFilteringOptions) {
        return mediaItems;
    }

}
