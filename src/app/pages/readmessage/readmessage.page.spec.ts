import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadMessagePage } from './readmessage.page';

describe('ReadMessagePage', () => {
  let component: ReadMessagePage;
  let fixture: ComponentFixture<ReadMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReadMessagePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
