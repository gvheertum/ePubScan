import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailAvailabilitystatusComponent } from './book-detail-availabilitystatus.component';

describe('BookDetailAvailabilitystatusComponent', () => {
  let component: BookDetailAvailabilitystatusComponent;
  let fixture: ComponentFixture<BookDetailAvailabilitystatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookDetailAvailabilitystatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDetailAvailabilitystatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
