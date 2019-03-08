import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.page.html',
  styleUrls: ['./view-media.page.scss'],
})
export class ViewMediaPage implements OnInit {

  mediaItemLodaded = false;
  mediaItemMIMEBASE = '';
  mediaItemURL = '';
  mediaID = -1;

  constructor(
    private navController: NavController,
    private wbma: WbmaService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.mediaID = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
    this.wbma.getSingleMedia(this.mediaID).subscribe((media) => {
      this.mediaItemLodaded = true;
      this.mediaItemMIMEBASE = media.mime_type.split('/')[0];
      this.mediaItemURL = this.wbma.getApiUploadsUrl() + media.filename;
    });
  }

  goBack() {
    this.navController.navigateBack('/tabs/browse');
  }

}
