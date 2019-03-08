import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestItemPage } from './request-item.page';

describe('RequestItemPage', () => {
  let component: RequestItemPage;
  let fixture: ComponentFixture<RequestItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
