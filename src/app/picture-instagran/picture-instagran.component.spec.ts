import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureInstagranComponent } from './picture-instagran.component';

describe('PictureInstagranComponent', () => {
  let component: PictureInstagranComponent;
  let fixture: ComponentFixture<PictureInstagranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureInstagranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureInstagranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
