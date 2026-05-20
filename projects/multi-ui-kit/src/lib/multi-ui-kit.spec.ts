import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiUiKit } from './multi-ui-kit';

describe('MultiUiKit', () => {
  let component: MultiUiKit;
  let fixture: ComponentFixture<MultiUiKit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiUiKit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiUiKit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
