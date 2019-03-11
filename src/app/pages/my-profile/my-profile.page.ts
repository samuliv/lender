import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { ExtraService } from 'src/app/services/extra/extra.service';
import { UserInfo } from 'src/app/interfaces/user-info';
import { GlobalService } from 'src/app/services/global/global.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  userName = '';
  userEmail = '';
  userNameEdit = '';
  userEmailEdit = '';

  userInfo: UserInfo;
  lendableStuff: string;
  editingProfile = false;

  errorWithUsername = '';
  errorWithEmail = '';
  formChecked = false;
  refreshTimer: any;

  constructor(
    private navController: NavController,
    private wbma: WbmaService,
    private extra: ExtraService,
    private glb: GlobalService,
    private router: Router,
    ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.wbma.getUserInformation(this.wbma.getMyUserID()).subscribe((res) => {
      this.userName = res.username;
      this.userEmail = res.email;
    });
    this.extra.getUserInfo(this.wbma.getMyUserID()).subscribe((res) => {
      this.userInfo = res;
    });
    this.getUserData();
  }

  getUserData() {
    this.wbma.getLendableItems().subscribe((res) => {
      let myItems = 0;
      const myUserID = this.wbma.getMyUserID();
      if (res.length > 0){
        for (let i = 0; i < res.length; i++) {
          if (res[i].user_id === myUserID) {
            myItems++;
          }
        }
        this.lendableStuff = myItems.toString();
      }
    });
  }

  editProfile() {
    this.userNameEdit = this.userName;
    this.userEmailEdit = this.userEmail;
    this.editingProfile = true;
    this.formChecked = true;
    this.glb.focusSiteElementById('nick');
  }

  someParameterChanged() {
    this.checkFields();
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout( () => {
      this.checkUsernameAvailability();
    }, 250);
  }

  checkFields() {
    this.formChecked = false;
    this.errorWithEmail = '';
    this.errorWithUsername = '';
    if (this.userNameEdit.length < 3) {
      this.errorWithUsername = 'Username must be over 2 characters!';
    }
    if (!this.glb.isEmailValid(this.userEmailEdit)) {
      this.errorWithEmail = 'Email is not in valid format.';
    }
  }

  checkUsernameAvailability() {
    if (this.errorWithUsername !== '' ) { 
      return;
    }
    if (this.userName === this.userNameEdit) {
      if (this.errorWithEmail === '') {
        this.formChecked = true;
      }
      return;
    }
    this.wbma.checkIfUserExists(this.userNameEdit).subscribe((username) => {
      if (username.available) {
        if (this.errorWithEmail === '') {
          this.formChecked = true;
        }
      } else {
        this.errorWithUsername = 'This username is already taken.';
      }
    });
  }

  saveChanges() {
    const formData = { 'username' : this.userNameEdit, 'email' : this.userEmailEdit };
    this.wbma.updateMyProfile(formData)
    .pipe(catchError(err => {
      this.glb.messagePrompt('Error', 'Info update failed.');
      return throwError(err);
    }))
    .subscribe((res) => {
      if (res.message === 'User data updated') {
        this.userName = this.userNameEdit;
        this.userEmail = this.userEmailEdit;
        this.editingProfile = false;
      }
    });
  }

  dismissChanges() {
    this.editingProfile = false;
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  changeMyDefaultLocation() {
    this.router.navigate(['/set-default-location']);
  }

  goBack() {
    this.navController.navigateBack('/tabs/settings');
  }

}
