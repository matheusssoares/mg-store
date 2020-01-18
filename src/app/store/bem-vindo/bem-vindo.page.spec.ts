import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BemVindoPage } from './bem-vindo.page';

describe('BemVindoPage', () => {
  let component: BemVindoPage;
  let fixture: ComponentFixture<BemVindoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BemVindoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BemVindoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
