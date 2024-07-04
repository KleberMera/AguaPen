import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosTrabajadoresComponent } from './usuarios-trabajadores.component';

describe('UsuariosTrabajadoresComponent', () => {
  let component: UsuariosTrabajadoresComponent;
  let fixture: ComponentFixture<UsuariosTrabajadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosTrabajadoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuariosTrabajadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
