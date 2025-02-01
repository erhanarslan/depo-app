import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseSectionComponent } from './warehouse-section.component';

describe('WarehouseSectionComponent', () => {
  let component: WarehouseSectionComponent;
  let fixture: ComponentFixture<WarehouseSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
