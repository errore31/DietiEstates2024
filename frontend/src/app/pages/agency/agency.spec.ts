import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Agency } from './agency';

describe('Agency', () => {
  let component: Agency;
  let fixture: ComponentFixture<Agency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Agency);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
