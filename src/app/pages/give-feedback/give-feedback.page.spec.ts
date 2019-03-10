import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveFeedbackPage } from './give-feedback.page';

describe('GiveFeedbackPage', () => {
  let component: GiveFeedbackPage;
  let fixture: ComponentFixture<GiveFeedbackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiveFeedbackPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveFeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
