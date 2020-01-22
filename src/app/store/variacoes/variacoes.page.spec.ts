import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VariacoesPage } from './variacoes.page';

describe('VariacoesPage', () => {
  let component: VariacoesPage;
  let fixture: ComponentFixture<VariacoesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariacoesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VariacoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
