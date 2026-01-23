import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Searches } from './searches';

describe('Searches', () => {
  let component: Searches;
  let fixture: ComponentFixture<Searches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Searches]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Searches);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
