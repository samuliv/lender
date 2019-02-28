import { Component, OnInit } from '@angular/core';
import { ExtraService } from '../../services/extra/extra.service';
import { NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-readmessage',
  templateUrl: 'readmessage.page.html',
  styleUrls: ['readmessage.page.scss']
})
export class ReadMessagePage implements OnInit {

  messageSenderName: string;
  messageTime: string;
  message: string;
  param: any;

  constructor(private extra: ExtraService, private navController: NavController, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.extra.getMessage(parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10)).subscribe(res => {
      this.message = res.message;
      this.messageTime = res.time;
      this.messageSenderName = res.from.toString();
    });
  }

  goBack() {
    this.navController.navigateBack('/tabs/messages');
  }

  reply() {
    console.log('TODO');
  }

}
