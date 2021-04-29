import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanExibirTrajetoriaComponent } from './plan-exibir-trajetoria.component';

describe('PlanExibirTrajetoriaComponent', () => {
  let component: PlanExibirTrajetoriaComponent;
  let fixture: ComponentFixture<PlanExibirTrajetoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanExibirTrajetoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanExibirTrajetoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
