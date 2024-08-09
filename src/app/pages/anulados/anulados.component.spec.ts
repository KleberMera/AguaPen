import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnuladosComponent } from './anulados.component';

describe('AnuladosComponent', () => {
  let component: AnuladosComponent;
  let fixture: ComponentFixture<AnuladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnuladosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnuladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
