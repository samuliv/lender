import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.page.html',
  styleUrls: ['./send-message.page.scss'],
})
export class SendMessagePage implements OnInit {

  goBackTo: string;
  userId: number;

  constructor(private navController: NavController, private activatedRoute: ActivatedRoute, private glb: GlobalService) { }

  ngOnInit() {
    const items = this.activatedRoute.snapshot.paramMap.get('source').split('-');
    this.goBackTo = items[0];
    this.userId = parseInt(items[1], 10);    
  }

  goBack() {
    switch (this.goBackTo) {
      case 'lent':
        this.navController.navigateBack('/tabs/lent');
        break;
      case 'messages':
        this.navController.navigateBack('/tabs/messages');
        break;
      default:
        this.navController.navigateBack('/tabs/borrowed');
        break;
    }
  }

}
