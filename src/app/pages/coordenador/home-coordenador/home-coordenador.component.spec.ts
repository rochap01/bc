import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCoordenadorComponent } from './home-coordenador.component';

describe('HomeCoordenadorComponent', () => {
  let component: HomeCoordenadorComponent;
  let fixture: ComponentFixture<HomeCoordenadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCoordenadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCoordenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
