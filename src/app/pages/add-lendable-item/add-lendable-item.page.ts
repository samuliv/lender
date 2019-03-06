import { Component, OnInit } from '@angular/core';
import { NavController, Events, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Chooser } from '@ionic-native/chooser/ngx'
import { MediaData } from 'src/app/interfaces/mediadata';
import { OpenStreetMapService } from 'src/app/services/openstreetmap/openstreetmap.service';
import { ExtraService } from 'src/app/services/extra/extra.service';

@Component({
  selector: 'app-add-lendable-item',
  templateUrl: './add-lendable-item.page.html',
  styleUrls: ['./add-lendable-item.page.scss'],
})
export class AddLendableItemPage implements OnInit {
  itemCategoryID = -1;
  itemCategory = '(please select)';
  itemTitle = '';
  itemDescription = '';
  itemPrice = '0';
  itemLocation = '(default location)';
  itemCustomLocationSet = false;
  itemCustomLocationLat = 0;
  itemCustomLocationLon = 0;
  itemUseDefaultLocation = true;

  source: string; // for routing fix
  file: Blob;
  fileIsUploaded: boolean;
  editItemID: number;

  constructor(
    private navController: NavController,
    private router: Router,
    private wbma: WbmaService,
    private activatedRoute: ActivatedRoute,
    private events: Events,
    private actionSheetController: ActionSheetController,
    private chooser: Chooser,
    private openstreetmap: OpenStreetMapService,
    private extra: ExtraService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    ) {
      this.source = this.activatedRoute.snapshot.paramMap.get('source');
      this.editItemID = parseInt(this.source.split('_')[0], 10);

      if (this.editItemID > 0) {
        this.wbma.getSingleMedia(this.editItemID).subscribe((res) => {
          this.itemTitle = res.title;
          const json = JSON.parse(res.description);
          this.itemCategoryID = parseInt(json.category, 10);
          this.itemCategory = '';
          this.itemPrice = json.price.toString().replace(',', '.');
          this.itemDescription = json.description;
          this.itemLocation = '';
          this.itemCustomLocationLat = json.lat;
          this.itemCustomLocationLon = json.lon;
          this.itemCustomLocationSet = true;
          this.itemUseDefaultLocation = false;
          this.openstreetmap.describeCoordinates(json.lat, json.lon).then((location: string) => {
            this.itemLocation = location;
          });
          this.extra.getCategoryNameById(this.itemCategoryID).subscribe(cat => {
            if (cat.success) {
              this.itemCategory = cat.response;
            }
          });
        });
      }

      this.events.subscribe('category-clicked', (categoryID, categoryName) => {
        this.itemCategoryID = categoryID;
        this.itemCategory = categoryName;
      });

      this.events.subscribe('location-choosed', (lat, lon, city) => {
        console.log('Event: location-choosed');
        this.itemUseDefaultLocation = false,
        this.itemCustomLocationSet = true;
        this.itemCustomLocationLat = lat;
        this.itemCustomLocationLon = lon;
        this.itemLocation = city;
      });
  }

  chooseCategory() {
    this.router.navigate(['/browse-category/add-lendable-item_' + this.source]);
  }

  parsePrice(price: string): number {
    if (price === '') {
      return -1;
    } else {
      price.replace(/,/g, '.');
      if (isNaN(parseFloat(price))) {
        return -1;
      } else {
        return parseFloat(price);
      }
    }
  }

  validateForm() {
    const errors: string[] = [];
    if ( this.itemCategoryID < 1 ) {
      errors.push('Category must be specified.');
    }
    if ( this.itemTitle.length < 3 ) {
      errors.push('Item title must contain over 3 characters.');
    }
    if ( this.itemDescription.length < 3 ) {
      errors.push('Item description must contain over 3 characters.');
    }
    // TODO : LOCATION
    if ( this.itemPrice === '' ) {
      errors.push('Item price must be specified.');
    } else {
      if ( this.parsePrice(this.itemPrice) === -1 ) {
        errors.push('Item price is not in valid format.');
      }
    }
    if ( this.editItemID === 0 && !this.fileIsUploaded ) {
      errors.push('Image or Video must have been selected for the Item.');
    }
    return errors;
  }

  async submitForm() {
    let validationErrors: string[] = [];
    validationErrors = this.validateForm();
    if (validationErrors.length === 0) {
      // Form is Valid, we can submit
      const loading = await this.loadingController.create({ message: (this.editItemID === 0 ? 'Uploading...' : 'Saving...') });
      await loading.present();
      const formData = new FormData();
      formData.append('title', this.itemTitle);
      formData.append('file', this.file);

      let lat = 0;
      let lon = 0;

      if ( this.itemUseDefaultLocation ) {
        // TODO
      } else {
        lat = this.itemCustomLocationLat;
        lon = this.itemCustomLocationLon;
      }

      const description: MediaData = {
        category: this.itemCategoryID,
        price: this.parsePrice(this.itemPrice),
        description: this.itemDescription,
        lat: lat,
        lon: lon,
      };
      const jsonString = JSON.stringify(description);
      if ( this.editItemID === 0 ) {
        // User is uploading new file
        formData.append('description', jsonString);
        this.wbma.uploadFile(formData)
          .subscribe((res: any) => {
            if ( res.message === 'File uploaded' ) {
              setTimeout(() => {
                loading.dismiss();
                this.goBack();
               }, 2000); // 2000ms delay for thumbnail-creation ;)
            }
          });
      } else {
        // Editing existing file
        this.wbma.updateMediaItem(this.editItemID, this.itemTitle, jsonString).subscribe((res) => {
          if (res.message === 'File info updated') {
            loading.dismiss();
            this.goBack();
          }
        });
      }
    } else {
      let alertMessage = '';
      for (let i = 0; i < validationErrors.length; i++ ) {
        alertMessage += (i !== 0 ? '<br>' : '') + validationErrors[i];
      }
      this.presentAlert('Check your Details', alertMessage);
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({ message: 'Uploading...' });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
    this.goBack();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }


  useDefaultLocation() {
    this.itemUseDefaultLocation = true;
    this.itemCustomLocationSet = false;
    this.itemLocation = '(default location)';
    this.checkDoesDefaultLocationExists();
  }

  checkDoesDefaultLocationExists() {
    // TODO
  }

  choosePicture() {
    if ( this.editItemID !== 0 ) {
      this.presentAlert('WBMA Backend', 'Image/video cannot be modified after first upload due to the WBMA Backend restrictions :(');
    } else {
      this.chooser.getFile('image/*, video/*').then(uploadedFile => {
        if ( uploadedFile ) {
          const uploadedImage: any = document.getElementById('uploadedImage');
          this.file = new Blob([uploadedFile.data], { type: uploadedFile.mediaType });
          uploadedImage.src = uploadedFile.dataURI;
          this.fileIsUploaded = true;
        } else {
          this.fileIsUploaded = false;
        }
      })
      .catch((e) => {
        console.log(e.error);
        this.fileIsUploaded = false;
      });
    }
  }

  chooseCustomLocation() {
    this.router.navigate(['/choose-location/add-lendable-item_' + this.source]);
  }

  async itemLocationClick() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose Item Location',
      buttons: [
        { text: 'Choose Custom Location',
          handler: () => {
            this.chooseCustomLocation();
          }
        } , {
          text: 'Use Default Location',
          handler: () => {
            this.useDefaultLocation();
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }]
    });
    await actionSheet.present();
  }

  ngOnInit() {
  }

  goBack() {
    this.navController.navigateBack('/my-lendable-items/' + this.source.split('-')[1]);
  }

}
