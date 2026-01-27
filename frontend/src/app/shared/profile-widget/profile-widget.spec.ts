import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileWidget } from './profile-widget';

describe('ProfileWidget', () => {
  let component: ProfileWidget;
  let fixture: ComponentFixture<ProfileWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
