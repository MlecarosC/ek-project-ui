import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NosotrosComponent } from './nosotros.component';

describe('NosotrosComponent', () => {
  let component: NosotrosComponent;
  let fixture: ComponentFixture<NosotrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NosotrosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NosotrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component properties', () => {
    it('should have photoUrl property', () => {
      expect(component.photoUrl).toBe('/images/me.jpg');
    });

    it('should have photoAlt property', () => {
      expect(component.photoAlt).toBe('Martin Lecaros');
    });
  });

  describe('onImageRightClick', () => {
    it('should prevent default on right click', () => {
      const event = new MouseEvent('contextmenu');
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      const result = component.onImageRightClick(event);

      expect(result).toBe(false);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('DOM', () => {
    it('should render hero section', () => {
      const heroSection = fixture.nativeElement.querySelector('.hero');
      expect(heroSection).toBeTruthy();
    });

    it('should render profile image', () => {
      const img = fixture.nativeElement.querySelector('img');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('/images/me.jpg');
      expect(img.getAttribute('alt')).toBe('Martin Lecaros');
    });

    it('should render main heading', () => {
      const heading = fixture.nativeElement.querySelector('h1');
      expect(heading).toBeTruthy();
      expect(heading.textContent).toContain('Sobre el Proyecto');
    });

    it('should render developer name', () => {
      const developerName = fixture.nativeElement.querySelector('.text-primary');
      expect(developerName).toBeTruthy();
      expect(developerName.textContent).toContain('Martin Lecaros');
    });

    it('should render program information', () => {
      const programInfo = fixture.nativeElement.textContent;
      expect(programInfo).toContain('Eureka 2025');
      expect(programInfo).toContain('Desarrollador Full Stack');
    });

    it('should render technology badges', () => {
      const badges = fixture.nativeElement.querySelectorAll('.badge');
      expect(badges.length).toBeGreaterThan(0);

      const badgeTexts = Array.from(badges).map((badge: any) => badge.textContent.trim());
      expect(badgeTexts).toContain('Angular 20');
      expect(badgeTexts).toContain('Spring Boot 3.5');
      expect(badgeTexts).toContain('Docker');
    });

    it('should have frontend badges', () => {
      const content = fixture.nativeElement.textContent;
      expect(content).toContain('Frontend:');
      expect(content).toContain('Tailwind CSS');
      expect(content).toContain('DaisyUI');
    });

    it('should have backend badges', () => {
      const content = fixture.nativeElement.textContent;
      expect(content).toContain('Backend:');
      expect(content).toContain('MySQL');
      expect(content).toContain('Testcontainers');
    });

    it('should have architecture badges', () => {
      const content = fixture.nativeElement.textContent;
      expect(content).toContain('Arquitectura:');
      expect(content).toContain('Microservicios');
      expect(content).toContain('Eureka Server');
      expect(content).toContain('API Gateway');
    });
  });
});
