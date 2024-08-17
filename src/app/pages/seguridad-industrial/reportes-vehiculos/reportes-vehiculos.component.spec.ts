import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesVehiculosComponent } from './reportes-vehiculos.component';

describe('ReportesVehiculosComponent', () => {
  let component: ReportesVehiculosComponent;
  let fixture: ComponentFixture<ReportesVehiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesVehiculosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportesVehiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
