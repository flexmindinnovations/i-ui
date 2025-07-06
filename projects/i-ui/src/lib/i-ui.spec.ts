import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IUi } from './i-ui';

describe('IUi', () => {
  let component: IUi;
  let fixture: ComponentFixture<IUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
