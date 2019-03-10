import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  passwordChangeable = false;
  firstError = '';
  secondError = '';
  password = '';
  passwordAgain ='';

  constructor(private navController: NavController, private wbma: WbmaService, private glb: GlobalService) { }

  ngOnInit() {
  }

  someParameterChanged() {
    this.passwordChangeable = false;
    this.firstError = '';
    this.secondError = '';
    if ( this.password === '' ) {
      return;
    }
    if (this.password.length < 5) {
      this.firstError = 'Password is too short.';
    }
    if (this.password !== this.passwordAgain && this.passwordAgain !== ''){
      this.secondError = 'Passwords does not match.';
    }
    if(this.password == this.passwordAgain && this.firstError === '' && this.secondError === '') {
      this.passwordChangeable = true;
    }
  }

  changePassword() {
    this.wbma.updateMyProfile({ password: this.password }).subscribe((res) => {
      if (res.message === 'User data updated') {
        this.glb.messagePrompt('Password changed', 'Your password is now changed!', () => { this.goBack(); });
      }
    });
  }

  goBack() {
    this.navController.navigateBack('/my-profile');
  }

}
