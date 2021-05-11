import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReadstatusUpdaterComponent } from './book-readstatus-updater.component';

describe('BookReadstatusUpdaterComponent', () => {
  let component: BookReadstatusUpdaterComponent;
  let fixture: ComponentFixture<BookReadstatusUpdaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookReadstatusUpdaterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookReadstatusUpdaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
