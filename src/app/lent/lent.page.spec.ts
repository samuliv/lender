import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LentPage } from './lent.page';

describe('LentPage', () => {
  let component: LentPage;
  let fixture: ComponentFixture<LentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LentPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
