import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UserInfo } from 'src/app/interfaces/user-info';
import { ExtraService } from 'src/app/services/extra/extra.service';
import { Feedback } from 'src/app/interfaces/feedback';

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.page.html',
  styleUrls: ['./view-user-profile.page.scss'],
})
export class ViewUserProfilePage implements OnInit {

  userName = '';
  userEmail = '';
  userID = 0;
  myUserID = 0;
  params: string[] = [];
  profilePic = this.wbma.getTempProfilePic();

  fetched = 0;

  lent = 0;
  borrowed = 0;
  rating = 0;
  feedbackPositive = 0;
  feedbackNegative = 0;
  lendableStuff = 0;
  lendableStuffAmount = 0;

  rollInterval: any;
  userInfo: UserInfo;
  rollPosition = 0;
  
  loading = true;

  feedback: Feedback[] = [];

  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private wbma: WbmaService,
    private router: Router,
    private glb: GlobalService,
    private extra: ExtraService,
  ) {
    this.params = this.activatedRoute.snapshot.paramMap.get('params').split('_');
  }

  ngOnInit() {
    this.userID = parseInt(this.params[0], 10);
    this.wbma.getUserInformation(this.userID).subscribe((userInfo) => {
      this.myUserID = this.wbma.getMyUserID();
      this.userID = userInfo.user_id;
      this.userName = userInfo.username;
      this.userEmail = userInfo.email;
    });
    this.wbma.getUserProfilePicture(this.userID).then((res: string) => {
      this.profilePic = res;
    }).catch((e) => { console.log(e); });
    this.extra.getUserInfo(this.userID).subscribe((res) => {
      this.userInfo = res;
      this.fetched++;
      this.beginRoll();
    });
    setTimeout( () => {
      this.getUserData();

      this.extra.getFeedback(this.userID).subscribe(res => {
        this.feedback = res;
        this.getUserNamesFeedback(this.feedback);
        this.loading = false;
      });
  

    }, 500);
  }


  getUserNamesFeedback(arr: Feedback[]) {
    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        this.wbma.getUserInformation(arr[i].user_id).subscribe((userData) => {
          arr[i].user_name = userData.username;
        });
      }
    }
  }

  sendMessageTouser () {
    if (this.userID !== 0 && this.userID !== this.wbma.getMyUserID()) {
      this.router.navigate(['send-message/viewuserprofile-' + this.userID + '-' + this.activatedRoute.snapshot.paramMap.get('params')]);
    } else {
      if (this.userID === this.wbma.getMyUserID()) {
        this.glb.messagePrompt('Sorry', 'You cannot send messages to yourself =)');
      }
    }
  }

  getUserData() {
    this.wbma.getLendableItems().subscribe((res) => {
      let myItems = 0;
      if (res.length > 0){
        for (let i = 0; i < res.length; i++) {
          if (res[i].user_id === this.userID) {
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

  goBack() {
    switch (this.params[1]) {
      case 'browse':
        this.navController.navigateBack('/tabs/browse');
        break;
      case 'lent':
        this.navController.navigateBack('/tabs/lent');
        break;
      case 'borrowed':
        this.navController.navigateBack('/tabs/borrowed');
        break;
      case 'readmessage':
        this.navController.navigateBack('/readmessage/' + this.params[2]);
        break;
    }
  }

}
