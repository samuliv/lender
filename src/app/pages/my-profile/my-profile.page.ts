import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { ExtraService } from 'src/app/services/extra/extra.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  userName = '';
  userFullName = '';
  userEmail = '';

  constructor(
    private navController: NavController,
    private wbma: WbmaService
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
  }

  ngOnInit() {
  }

  

  goBack() {
    this.navController.navigateBack('/tabs/settings');
  }

}
