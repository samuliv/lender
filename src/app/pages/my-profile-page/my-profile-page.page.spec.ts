import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfilePagePage } from './my-profile-page.page';

describe('MyProfilePagePage', () => {
  let component: MyProfilePagePage;
  let fixture: ComponentFixture<MyProfilePagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProfilePagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfilePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
