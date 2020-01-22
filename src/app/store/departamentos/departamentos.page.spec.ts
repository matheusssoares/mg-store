import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DepartamentosPage } from './departamentos.page';

describe('DepartamentosPage', () => {
  let component: DepartamentosPage;
  let fixture: ComponentFixture<DepartamentosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartamentosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DepartamentosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
