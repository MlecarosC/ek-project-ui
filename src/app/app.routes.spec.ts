import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from './app.routes';

describe('AppRoutes', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should have 5 routes configured', () => {
    expect(routes.length).toBe(5);
  });

  it('should redirect empty path to /inicio', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/inicio');
  });

  it('should have /inicio route', () => {
    const inicioRoute = routes.find(r => r.path === 'inicio');
    expect(inicioRoute).toBeDefined();
    expect(inicioRoute?.loadComponent).toBeDefined();
  });

  it('should have /candidatos route', () => {
    const candidatosRoute = routes.find(r => r.path === 'candidatos');
    expect(candidatosRoute).toBeDefined();
    expect(candidatosRoute?.loadComponent).toBeDefined();
  });

  it('should have /nosotros route', () => {
    const nosotrosRoute = routes.find(r => r.path === 'nosotros');
    expect(nosotrosRoute).toBeDefined();
    expect(nosotrosRoute?.loadComponent).toBeDefined();
  });

  it('should redirect wildcard to /inicio', async () => {
    await router.navigate(['/ruta-inexistente']);
    expect(location.path()).toBe('/inicio');
  });

  it('should load InicioComponent lazily', async () => {
    const inicioRoute = routes.find(r => r.path === 'inicio');
    if (inicioRoute?.loadComponent) {
      const component = await inicioRoute.loadComponent();
      expect(component).toBeDefined();
    }
  });

  it('should load CandidatosComponent lazily', async () => {
    const candidatosRoute = routes.find(r => r.path === 'candidatos');
    if (candidatosRoute?.loadComponent) {
      const component = await candidatosRoute.loadComponent();
      expect(component).toBeDefined();
    }
  });

  it('should load NosotrosComponent lazily', async () => {
    const nosotrosRoute = routes.find(r => r.path === 'nosotros');
    if (nosotrosRoute?.loadComponent) {
      const component = await nosotrosRoute.loadComponent();
      expect(component).toBeDefined();
    }
  });
});
