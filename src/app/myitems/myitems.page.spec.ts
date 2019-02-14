import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyItemsPage } from './myitems.page';

describe('MyItemsPage', () => {
  let component: MyItemsPage;
  let fixture: ComponentFixture<MyItemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyItemsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
