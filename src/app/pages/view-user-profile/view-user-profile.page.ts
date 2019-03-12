import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.page.html',
  styleUrls: ['./view-user-profile.page.scss'],
})
export class ViewUserProfilePage implements OnInit {

  userName = '';
  userID = 0;
  myUserID = 0;
  params: string[] = [];
  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private wbma: WbmaService,
    private router: Router,
    private glb: GlobalService,
  ) {
    this.params = this.activatedRoute.snapshot.paramMap.get('params').split('_');
  }

  ngOnInit() {
    this.wbma.getUserInformation(parseInt(this.params[0], 10)).subscribe((userInfo) => {
      this.myUserID = this.wbma.getMyUserID();
      this.userID = userInfo.user_id;
      this.userName = userInfo.username;
    });
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
