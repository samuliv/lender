import { Component, OnInit } from '@angular/core';
import { NavController, Events, ActionSheetController } from '@ionic/angular';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { Router, ActivatedRoute } from '@angular/router';

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
  itemMediaSelected: boolean;
  submitButtonText: string;
  source: string; // for routing fix

  constructor(
    private navController: NavController,
    private router: Router,
    private wbma: WbmaService,
    private activatedRoute: ActivatedRoute,
    private events: Events,
    private actionSheetController: ActionSheetController,
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
      this.itemMediaSelected = false;
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
    }
    if ( !this.itemMediaSelected ) {
      errors.push('Image or Video must have been selected for the Item.');
    }
    return errors;
  }

  submitForm() {
    if (this.validateForm().length === 0) {
      // Form is Valid, we can submit
    } else {
      console.log('Not valid Form!');
      console.log(this.validateForm());
    }
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
