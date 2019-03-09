import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { AlertController } from '@ionic/angular';
import { ExtraService } from 'src/app/services/extra/extra.service';
import { UsernameAvailable } from 'src/app/interfaces/usernameavailable';
import { LoginInfo } from 'src/app/interfaces/logininfo';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string;
  password: string;
  email: string;
  full_name: string;
  creatingAccount = false;

  constructor(
    private wbma: WbmaService,
    private extra: ExtraService,
    private glb: GlobalService
    ) { }

  ngOnInit() {
    console.log('login.page.ts : ngOnInit()');
  }

  loginButtonClick() {
    this.wbma.login(this.username, this.password).then((res) => {
      this.username = '';
      this.password = '';
    }).catch((err) => {
      this.glb.messagePrompt('Login Error', err);
    });
  }

  registerButtonClick() {
    this.wbma.register(this.username, this.password, this.email, this.full_name)
      .pipe(catchError(err => {
        this.glb.messagePrompt('Could not register', err.error.error);
        return throwError(err);
      }))
      .subscribe((res) => {
        this.username = '';
        this.password = '';
        this.email = '';
        this.full_name = '';
        this.creatingAccount = false;  
      });
  }

  createAccount() {
    this.creatingAccount = !this.creatingAccount;
  }

}
