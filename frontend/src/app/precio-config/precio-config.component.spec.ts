import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecioConfigComponent } from './precio-config.component';

describe('PrecioConfigComponent', () => {
  let component: PrecioConfigComponent;
  let fixture: ComponentFixture<PrecioConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrecioConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrecioConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
