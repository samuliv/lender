import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLendableItemsPage } from './my-lendable-items.page';

describe('MyLendableItemsPage', () => {
  let component: MyLendableItemsPage;
  let fixture: ComponentFixture<MyLendableItemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyLendableItemsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLendableItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
