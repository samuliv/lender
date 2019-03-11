import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseMapPage } from './browse-map.page';

describe('BrowseMapPage', () => {
  let component: BrowseMapPage;
  let fixture: ComponentFixture<BrowseMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
