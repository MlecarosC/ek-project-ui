import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioComponent } from './inicio.component';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  template: '<div>Candidatos</div>',
})
class CandidatosComponent {}

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [
        provideRouter([
          { path: 'candidatos', component: CandidatosComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('DOM', () => {
    it('should render hero section', () => {
      const heroSection = fixture.nativeElement.querySelector('.hero');
      expect(heroSection).toBeTruthy();
    });

    it('should render main heading', () => {
      const heading = fixture.nativeElement.querySelector('h1');
      expect(heading).toBeTruthy();
      expect(heading.textContent).toContain('Encuentra el Talento que Necesitas');
    });

    it('should render description paragraph', () => {
      const paragraph = fixture.nativeElement.querySelector('p');
      expect(paragraph).toBeTruthy();
      expect(paragraph.textContent).toContain('Plataforma completa de gestión de candidatos');
    });

    it('should render button with correct text', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
      expect(button.textContent).toContain('Comenzar');
    });

    it('should have btn-primary class on button', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.classList.contains('btn')).toBe(true);
      expect(button.classList.contains('btn-primary')).toBe(true);
    });

    it('should navigate to candidatos on button click', async () => {
      const button = fixture.nativeElement.querySelector('button');
      
      // Trigger navigation
      button.click();
      await fixture.whenStable();
      
      // Check if navigation occurred
      expect(location.path()).toBe('/candidatos');
    });

    it('should have all DaisyUI button classes', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.className).toContain('btn');
      expect(button.className).toContain('btn-primary');
    });
  });
});
