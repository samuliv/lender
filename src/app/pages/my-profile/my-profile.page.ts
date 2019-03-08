import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { ExtraService } from 'src/app/services/extra/extra.service';
import { UserInfo } from 'src/app/interfaces/user-info';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  userName = '';
  userFullName = '';
  userEmail = '';

  userInfo: UserInfo;
  lendableStuff: string;

  constructor(
    private navController: NavController,
    private wbma: WbmaService,
    private extra: ExtraService,
    ) {
      this.wbma.getUserInformation(this.wbma.getMyUserID()).subscribe((res) => {
        this.userName = res.username;
        this.userEmail = res.email;
        if ( res.full_name ) {
          this.userFullName = res.full_name;
        } else {
          this.userFullName = '';
        }
      });
      this.extra.getUserInfo(this.wbma.getMyUserID()).subscribe((res) => {
        this.userInfo = res;
      });
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

  ngOnInit() {
  }

  

  goBack() {
    this.navController.navigateBack('/tabs/settings');
  }

}
