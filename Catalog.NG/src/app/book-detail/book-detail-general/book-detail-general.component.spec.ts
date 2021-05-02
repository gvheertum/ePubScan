import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailGeneralComponent } from './book-detail-general.component';

describe('BookDetailGeneralComponent', () => {
  let component: BookDetailGeneralComponent;
  let fixture: ComponentFixture<BookDetailGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookDetailGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDetailGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
