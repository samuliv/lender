import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { AlertController } from '@ionic/angular';
import { ExtraService } from 'src/app/services/extra/extra.service';
import { UsernameAvailable } from 'src/app/interfaces/usernameavailable';
import { LoginInfo } from 'src/app/interfaces/logininfo';

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

  constructor(private wbma: WbmaService, private extra: ExtraService, private alertController: AlertController) { }

  ngOnInit() {
    console.log('login.page.ts : ngOnInit()');
  }

  loginButtonClick() {
    this.wbma.login(this.username, this.password);
    this.username = '';
    this.password = '';
  }

  registerButtonClick() {
    this.wbma.register(this.username, this.password, this.email, this.full_name);
    this.username = '';
    this.password = '';
    this.email = '';
    this.full_name = '';
    this.creatingAccount = false;
  }

  createAccount() {
    this.creatingAccount = !this.creatingAccount;
  }

}
