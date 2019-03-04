import { Component, OnInit } from '@angular/core';
import { NavController, Events, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Chooser } from '@ionic-native/chooser/ngx'
import { MediaData } from 'src/app/interfaces/mediadata';

@Component({
  selector: 'app-add-lendable-item',
  templateUrl: './add-lendable-item.page.html',
  styleUrls: ['./add-lendable-item.page.scss'],
})
export class AddLendableItemPage implements OnInit {
  itemCategoryID: number;
  itemCategory: string;
  itemTitle: string;
  itemDescription: string;
  itemPrice: string;
  itemLocation: string;
  itemCustomLocationSet: boolean;
  itemCustomLocationLat: number;
  itemCustomLocationLon: number;
  itemUseDefaultLocation: boolean;
  submitButtonText: string;
  source: string; // for routing fix
  file: Blob;
  fileIsUploaded: boolean;

  constructor(
    private navController: NavController,
    private router: Router,
    private wbma: WbmaService,
    private activatedRoute: ActivatedRoute,
    private events: Events,
    private actionSheetController: ActionSheetController,
    private chooser: Chooser,
    private alertController: AlertController,
    private loadingController: LoadingController,
    ) {
      this.itemCategory = '(please select)';
      this.itemCategoryID = -1;
      this.itemLocation = '(default location)';
      this.itemTitle = '';
      this.itemPrice = '0';
      this.itemDescription = '';
      this.itemUseDefaultLocation = true;
      this.itemCustomLocationLat = 0;
      this.itemCustomLocationLon = 0;
      this.itemCustomLocationSet = false;
      this.submitButtonText = 'Add Item';
      this.source = this.activatedRoute.snapshot.paramMap.get('source');

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
    if ( this.itemPrice === '' ) {
      errors.push('Item price must be specified.');
    } else {
      if ( this.parsePrice(this.itemPrice) === -1 ) {
        errors.push('Item price is not in valid format.');
      }
    }
    if ( !this.fileIsUploaded ) {
      errors.push('Image or Video must have been selected for the Item.');
    }
    return errors;
  }

  submitForm() {
    let validationErrors: string[] = [];
    validationErrors = this.validateForm();
    if (validationErrors.length === 0) {
      // Form is Valid, we can submit
      this.presentLoading();
      const formData = new FormData();
      formData.append('title', this.itemTitle);
      formData.append('file', this.file);

      const lat = 0;
      const lon = 0;

      const description: MediaData = {
        category: this.itemCategoryID,
        price: this.parsePrice(this.itemPrice),
        description: this.itemDescription,
        lat: lat,
        lon: lon,
      };
      
      formData.append('description', JSON.stringify(description));
      this.wbma.uploadFile(formData)
        .subscribe((res: any) => {
          if ( res.message === 'File uploaded' ) {
            
          }
        })
    } else {
      let alertMessage = '';
      for (let i = 0; i < validationErrors.length; i++ ) {
        alertMessage += (i != 0 ? '<br>' : '') + validationErrors[i];
      }
      this.presentAlert(alertMessage);
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Uploading...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
    this.goBack();
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Check your Details',
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
