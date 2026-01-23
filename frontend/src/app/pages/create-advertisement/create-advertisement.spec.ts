import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdvertisement } from './create-advertisement';

describe('CreateAdvertisement', () => {
  let component: CreateAdvertisement;
  let fixture: ComponentFixture<CreateAdvertisement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAdvertisement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAdvertisement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
