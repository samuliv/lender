import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDefaultLocationPage } from './set-default-location.page';

describe('SetDefaultLocationPage', () => {
  let component: SetDefaultLocationPage;
  let fixture: ComponentFixture<SetDefaultLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetDefaultLocationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDefaultLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
