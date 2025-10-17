import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';

// Componente dummy para rutas
@Component({
  standalone: true,
  template: '<div>Dummy</div>',
})
class DummyComponent {}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([
          { path: 'inicio', component: DummyComponent },
          { path: 'candidatos', component: DummyComponent },
          { path: 'nosotros', component: DummyComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have logo URL', () => {
    expect(component.logoUrl).toBe('/images/logo.png');
  });

  it('should have 3 menu items', () => {
    expect(component.menuItems).toBeDefined();
    expect(component.menuItems.length).toBe(3);
  });

  it('should have correct menu items', () => {
    expect(component.menuItems).toEqual([
      { label: 'Inicio', route: '/inicio' },
      { label: 'Candidatos', route: '/candidatos' },
      { label: 'Nosotros', route: '/nosotros' },
    ]);
  });

  describe('Mobile Menu', () => {
    it('should initialize with menu closed', () => {
      expect(component.isMobileMenuOpen()).toBe(false);
    });

    it('should toggle mobile menu on', () => {
      component.toggleMobileMenu();
      expect(component.isMobileMenuOpen()).toBe(true);
    });

    it('should toggle mobile menu off', () => {
      component.toggleMobileMenu();
      component.toggleMobileMenu();
      expect(component.isMobileMenuOpen()).toBe(false);
    });

    it('should close mobile menu', () => {
      component.isMobileMenuOpen.set(true);
      component.closeMobileMenu();
      expect(component.isMobileMenuOpen()).toBe(false);
    });
  });

  describe('Image Right Click', () => {
    it('should prevent default on right click', () => {
      const event = new MouseEvent('contextmenu');
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      const result = component.onImageRightClick(event);

      expect(result).toBe(false);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('DOM', () => {
    it('should render logo image', () => {
      const img = fixture.nativeElement.querySelector('img');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('/images/logo.png');
    });

    it('should not show mobile menu initially', () => {
      const mobileMenu = fixture.nativeElement.querySelector('.absolute.right-0.top-full');
      expect(mobileMenu).toBeFalsy();
    });

    it('should show mobile menu when open', () => {
      component.toggleMobileMenu();
      fixture.detectChanges();

      const mobileMenu = fixture.nativeElement.querySelector('.absolute.right-0.top-full');
      expect(mobileMenu).toBeTruthy();
    });
  });
});
