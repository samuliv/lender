import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-lendable-item',
  templateUrl: './add-lendable-item.page.html',
  styleUrls: ['./add-lendable-item.page.scss'],
})
export class AddLendableItemPage implements OnInit {

  itemCategory: string;
  itemTitle: string;
  itemDescription: string;
  itemPrice: string;
  itemLocation: string;
  itemCategorySelected: boolean;
  itemLocationDefault: boolean;
  itemLocationSelected: boolean;
  itemMediaSelected: boolean;
  submitButtonText: string;

  source: string;

  constructor(
    private navController: NavController,
    private router: Router,
    private wbma: WbmaService,
    private activatedRoute: ActivatedRoute
    ) {
      this.itemCategory = '(please select)';
      this.itemLocation = '(default location)';
      this.itemTitle = '';
      this.itemDescription = '';
      this.itemLocationDefault = true;
      this.itemLocationSelected = false;
      this.itemMediaSelected = false;
      this.submitButtonText = 'Add Item';
      this.source = this.activatedRoute.snapshot.paramMap.get('source');
  }

  chooseCategory() {
    this.router.navigate(['/browse-category/add-lendable-item_' + this.source]);
  }

  validateForm() {
    const errors: string[] = [];
    if ( !this.itemCategorySelected ) {
      errors.push('Category must be specified.');
    }
    if ( this.itemTitle.length < 3 ) {
      errors.push('Item title must contain over 3 characters.');
    }
    if ( this.itemDescription.length < 3 ) {
      errors.push('Item description must contain over 3 characters.');
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

  ngOnInit() {
  }

  goBack() {
    this.navController.navigateBack('/my-lendable-items/' + this.source.split('-')[1]);
  }

}
