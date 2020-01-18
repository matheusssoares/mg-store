import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RelatoriosPage } from './relatorios.page';

describe('RelatoriosPage', () => {
  let component: RelatoriosPage;
  let fixture: ComponentFixture<RelatoriosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatoriosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RelatoriosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
