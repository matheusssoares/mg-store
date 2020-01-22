import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CargosPage } from './cargos.page';

describe('CargosPage', () => {
  let component: CargosPage;
  let fixture: ComponentFixture<CargosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CargosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
