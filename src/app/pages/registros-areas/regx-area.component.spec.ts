import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegxAreaComponent } from './regx-area.component';

describe('RegxAreaComponent', () => {
  let component: RegxAreaComponent;
  let fixture: ComponentFixture<RegxAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegxAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegxAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
