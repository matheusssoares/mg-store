import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadastreSePage } from './cadastre-se.page';

describe('CadastreSePage', () => {
  let component: CadastreSePage;
  let fixture: ComponentFixture<CadastreSePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastreSePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastreSePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
