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

  userName = 'username';
  userEmail = 'user@';
  userNameEdit = '';
  userEmailEdit = '';

  userInfo: UserInfo;
  editingProfile = false;

  lent = 0;
  borrowed = 0;
  rating = 0;
  feedbackPositive = 0;
  feedbackNegative = 0;
  lendableStuff = 0;
  lendableStuffAmount = 0;

  errorWithUsername = '';
  errorWithEmail = '';
  formChecked = false;
  refreshTimer: any;
  rollPosition = 0;
  rollInterval: any;

  fetched = 0;

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
    /* Timeout for not to broke the sliding animation */
    setTimeout( () => {
      this.wbma.getUserInformation(this.wbma.getMyUserID()).subscribe((res) => {
        this.userName = res.username;
        this.userEmail = res.email;
      });
      this.extra.getUserInfo(this.wbma.getMyUserID()).subscribe((res) => {
        this.userInfo = res;
        this.fetched++;
        this.beginRoll();
      });
      this.getUserData();
    }, 500);
  }

  ionViewDidLeave () {
    this.rollPosition = 99;
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
        this.lendableStuffAmount = myItems;
        this.fetched++;
        this.beginRoll();
      }
    });
  }

  beginRoll() {
    if(this.fetched === 2) {
      console.log('Starting roll...');
      this.roll();
    }
  }

  roll() {
    this.rollPosition++;
    this.lent = Math.round(this.userInfo.lent * (this.rollPosition / 100));
    this.borrowed = Math.round(this.userInfo.borrowed * (this.rollPosition / 100));
    this.feedbackNegative = Math.round(this.userInfo.feedback_negative * (this.rollPosition / 100));
    this.feedbackPositive = Math.round(this.userInfo.feedback_positive * (this.rollPosition / 100));
    this.lendableStuff = Math.round(this.lendableStuffAmount * (this.rollPosition / 100));
    this.rating = Math.round(this.userInfo.rating * (this.rollPosition / 100));
    if (this.rollPosition === 100) {
      clearInterval(this.rollInterval);
      console.log('Rolling finished.');
    } else {
      setTimeout( () => {
        this.roll();
      }, 10 + Math.round(this.rollPosition / 3)); // slow-down effect
    }
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
    this.rollPosition = 99;
    this.navController.navigateBack('/tabs/settings');
  }

}
