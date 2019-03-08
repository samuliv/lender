import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMediaPage } from './view-media.page';

describe('ViewMediaPage', () => {
  let component: ViewMediaPage;
  let fixture: ComponentFixture<ViewMediaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMediaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
