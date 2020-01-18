import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GeralPage } from './geral.page';

describe('GeralPage', () => {
  let component: GeralPage;
  let fixture: ComponentFixture<GeralPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeralPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GeralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
