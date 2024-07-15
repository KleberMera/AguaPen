import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesUsuariosComponent } from './reportes-usuarios.component';

describe('ReportesUsuariosComponent', () => {
  let component: ReportesUsuariosComponent;
  let fixture: ComponentFixture<ReportesUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesUsuariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportesUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
