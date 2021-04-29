import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorPlanejamentoComponent } from './professor-planejamento.component';

describe('ProfessorPlanejamentoComponent', () => {
  let component: ProfessorPlanejamentoComponent;
  let fixture: ComponentFixture<ProfessorPlanejamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessorPlanejamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessorPlanejamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
