import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseCategoryPage } from './browse-category.page';

describe('BrowseCategoryPage', () => {
  let component: BrowseCategoryPage;
  let fixture: ComponentFixture<BrowseCategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseCategoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
