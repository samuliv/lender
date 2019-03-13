import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { GpsDistanceService } from 'src/app/services/gps-distance/gps-distance.service';
import { GpsPositionService } from 'src/app/services/gps-position/gps-position.service';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.page.html',
  styleUrls: ['./view-item.page.scss'],
})
export class ViewItemPage implements OnInit {

  params: string[] = [];
  item_id = 0;
  mediaURL = '';
  title = '';
  description = '';
  price = '';
  distance = '';
  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private wbma: WbmaService,
    private gpsDistance: GpsDistanceService,
    private gpsPositionService: GpsPositionService,
  ) { }

  ngOnInit() {
    this.params = this.activatedRoute.snapshot.paramMap.get('params').split('-');
    this.item_id = parseInt(this.params[1], 10);
    this.wbma.getSingleMedia(this.item_id).subscribe((media) => {
      this.wbma.readSingleMediaData(media);
      this.mediaURL = this.wbma.getApiUploadsUrl() +  media.thumbnails.w320;
      this.title = media.title;
      this.description = media.media_data.description;
      this.price = media.media_data.price.toString() + ' €/h';
      this.distance = this.gpsDistance.calculateDistance(          
        this.gpsPositionService.latitude,
        this.gpsPositionService.longitude,
        media.media_data.lat,
        media.media_data.lon).toPrecision(2).toString() + " km away";
    });
  }

  goBack() {
    if (this.params[0] === 'lent') {
      this.navController.navigateBack('/tabs/lent');
    } else {
      this.navController.navigateBack('/tabs/borrowed');
    }
  }

}
