import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMovie } from './create-movie';

describe('CreateMovie', () => {
  let component: CreateMovie;
  let fixture: ComponentFixture<CreateMovie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMovie]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMovie);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
