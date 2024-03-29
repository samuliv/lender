import { Component, OnInit } from '@angular/core';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { Events } from '@ionic/angular';
import { ExtraService } from 'src/app/services/extra/extra.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username = '';
  password = '';
  email = ''
  full_name = '';
  creatingAccount = false;
  showLoading = false;

  errorWithUsername = '';
  errorWithPassword = '';
  errorWithEmail = '';
  errorWithFullName = '';

  loginFormValidated = false;
  registerFormValidated = false;
  refreshTimer: any;
  isNetworkConnection = false;

  constructor(
    private wbma: WbmaService,
    private extra: ExtraService,
    private glb: GlobalService,
    private events: Events,
    ) { }

  ngOnInit() {
    console.log('login.page.ts : ngOnInit()');
    this.isNetworkConnection = this.glb.getNetworkStatus();
    this.events.subscribe(('network-status-changed'), () => {
      this.isNetworkConnection = this.glb.getNetworkStatus();
    });
  }

  someParameterChanged() {
    this.errorWithUsername = '';
    this.errorWithPassword = '';
    this.errorWithEmail = '';
    this.errorWithFullName = '';
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout( () => {
      this.validate();
    }, 400);
  }

  validate() {
    let validationErrors = false;
    if (this.username === '') {
      validationErrors = true;
    } else {
      if (this.username.length < 3) {
        this.errorWithUsername = 'Username must be longer.';
      }
    }
    if (this.password === '') {
      validationErrors = true;
    } else {
      if (this.password.length < 3) {
        this.errorWithPassword = 'Password must be longer.';
      }
    }
    if (!validationErrors) {
      this.loginFormValidated = true;
    }
    if (!this.creatingAccount) {
      return;
    }
    if (this.email === '') {
      validationErrors = true;
    } else {
      if (!this.glb.isEmailValid(this.email)) {
        this.errorWithEmail = 'Email is not valid.';
      }
    }
    if (this.full_name !== '') {
      if (this.full_name.length < 3) {
        this.errorWithFullName = 'Full name must be longer';
      }
    }
    if (this.username !== '' && this.errorWithUsername === '') {
      this.wbma.checkIfUserExists(this.username).subscribe((thisUsernameIs) => {
        if (thisUsernameIs.available) {
          if ( !validationErrors &&
              this.errorWithEmail === '' && this.errorWithFullName === '' &&
              this.errorWithPassword === '' && this.errorWithUsername === '' )
                {
                  this.registerFormValidated = true;
                }
        } else {
          this.errorWithUsername = 'Username is already taken.';
        }
      });
    }
  }

  loginButtonClick() {
    this.showLoading = true;
    this.wbma.login(this.username, this.password).then((res) => {
      this.username = '';
      this.password = '';
      this.showLoading = false;
      this.events.publish('login');
    }).catch((err) => {
      this.showLoading = false;
      this.glb.messagePrompt('Login Error', err);
    });
  }

  registerButtonClick() {
    this.showLoading = true;
    this.wbma.register(this.username, this.password, this.email, this.full_name)
      .pipe(catchError(err => {
        this.showLoading = false;
        this.glb.messagePrompt('Could not register', err.error.error);
        return throwError(err);
      }))
      .subscribe((res) => {
        this.showLoading = false;
        this.username = '';
        this.password = '';
        this.email = '';
        this.full_name = '';
        this.creatingAccount = false;  
      });
  }

  createAccount() {
    this.creatingAccount = !this.creatingAccount;
    this.someParameterChanged();
  }

}
