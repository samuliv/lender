import { Component, OnInit } from '@angular/core';
import { NavController, Events } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ExtraService } from 'src/app/services/extra/extra.service';

@Component({
  selector: 'app-browse-category',
  templateUrl: './browse-category.page.html',
  styleUrls: ['./browse-category.page.scss'],
})
export class BrowseCategoryPage implements OnInit {

  source: string;
  subParameters: string;
  categories: any;
  allSelected: boolean;
  noAll: boolean;
  selectedCategory: number;

  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private extraService: ExtraService,
    private events: Events) {
      const fullSource: string = this.activatedRoute.snapshot.paramMap.get('source');
      const splitted: string[] = fullSource.split('_');
      this.allSelected = true;
      this.noAll = false;
      this.selectedCategory = 0;
      this.source = splitted[0];
      if (this.source === 'add-lendable-item') {
        this.noAll = true; // Hide All Button
        this.selectedCategory = -1;
        this.allSelected = false;
      }
      if (this.source === 'browse') {
        if (localStorage.getItem('selected-category')) {
          this.selectedCategory = parseInt(localStorage.getItem('selected-category'), 10);
        }
      }
      if(splitted.length > 1) {
        this.selectedCategory = parseInt(splitted[2]);
      }
      if ( splitted.length > 1 ) {
        this.subParameters = splitted[1];
      } else {
        this.subParameters = '';
      }
      if ( splitted.length > 1 ) {
        this.subParameters = splitted[1];
      } else {
        this.subParameters = '';
      }
  }

  ngOnInit() {
    this.extraService.getCategories().subscribe((res) => {
      this.categories = res;
      if (this.selectedCategory !== 0) {
        this.selectCategory(this.selectedCategory);
      }
    });
  }

  selectCategory(id: number) {
    if (this.selectedCategory !== 0) {
      this.categories.forEach(i => {
        if (i.id === id) {
          this.itemClick(i);
          return;
        }
      });
    }
  }

  arrayMatch(a1: string[], a2: string[]) {
    if (a1.length === 0 || a2.length === 0) {
      return false;
    } else {
      for (let a = 0; a < a1.length; a++) {
        for (let b = 0; b < a2.length; b++) {
          if (a1[a] === a2[b]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  itemClickAll(byMouse?: boolean) {
    if (this.selectedCategory === 0) {
      this.goBack();
      return;
    }
    this.clearSelections();
    this.allSelected = true;
    this.selectedCategory = 0;
    console.log('Selected Category: All');
    this.events.publish('category-clicked-' + this.source, 0, 'All', []);
  }

  clearSelections() {
    for (let i = 0; i < this.categories.length; i++){
      this.categories[i].selected = false;
      if (this.categories[i].level !== 0) {
        this.categories[i].display = false;
      }
    }
  }

  itemClick(item: any, byMouse?: boolean) {
    console.log('Selected Category:' + item.id + ' (' + item.name + ')');
    if (this.selectedCategory === item.id && byMouse) {
      this.goBack();
      return;
    }
    this.events.publish('category-clicked-' + this.source, item.id, item.name, item.contains);
    this.selectedCategory = item.id;
    this.allSelected = false;
    if ( this.categories.length > 0 ) {
      this.clearSelections();
      item.selected = true;
      const items = item.path.split(' ');
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].level === 0 || this.arrayMatch(items, this.categories[i].path.split(' '))) {
          this.categories[i].display = true;
        } else {
          this.categories[i].display = false;
        }
      }
    }
  }

  goBack() {
    switch ( this.source ) {
      case 'add-lendable-item':
        this.navController.navigateBack('/add-lendable-item/' + this.subParameters);
        break;
      case 'lent':
        this.navController.navigateBack('/tabs/lent');
        break;
      default:
        this.navController.navigateBack('/tabs/browse');
        break;
    }
  }

}
