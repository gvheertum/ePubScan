import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailReadstatusComponent } from './book-detail-readstatus.component';

describe('BookDetailReadstatusComponent', () => {
  let component: BookDetailReadstatusComponent;
  let fixture: ComponentFixture<BookDetailReadstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookDetailReadstatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDetailReadstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
