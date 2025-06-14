import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturePdfComponent } from './facture-pdf.component';

describe('FacturePdfComponent', () => {
  let component: FacturePdfComponent;
  let fixture: ComponentFixture<FacturePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturePdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
