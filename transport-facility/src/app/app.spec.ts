import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';

describe('App Component', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  const mockRoutes: Routes = []; // Empty routes just for testing

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [App],
      providers: [provideRouter(mockRoutes)]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the App component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title()).toBe('transport-facility');
  });
});
