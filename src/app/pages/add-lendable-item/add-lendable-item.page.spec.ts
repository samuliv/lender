import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLendableItemPage } from './add-lendable-item.page';

describe('AddLendableItemPage', () => {
  let component: AddLendableItemPage;
  let fixture: ComponentFixture<AddLendableItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLendableItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLendableItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
