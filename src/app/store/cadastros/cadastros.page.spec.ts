import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadastrosPage } from './cadastros.page';

describe('CadastrosPage', () => {
  let component: CadastrosPage;
  let fixture: ComponentFixture<CadastrosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastrosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
