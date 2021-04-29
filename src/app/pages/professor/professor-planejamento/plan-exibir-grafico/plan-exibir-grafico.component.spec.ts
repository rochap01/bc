import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanExibirGraficoComponent } from './plan-exibir-grafico.component';

describe('PlanExibirGraficoComponent', () => {
  let component: PlanExibirGraficoComponent;
  let fixture: ComponentFixture<PlanExibirGraficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanExibirGraficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanExibirGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
