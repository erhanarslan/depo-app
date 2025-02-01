import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShelfDialogComponent } from './add-shelf-dialog.component';

describe('AddShelfDialogComponent', () => {
  let component: AddShelfDialogComponent;
  let fixture: ComponentFixture<AddShelfDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShelfDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddShelfDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
