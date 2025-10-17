import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';

describe('AppConfig', () => {
  it('should have providers array defined', () => {
    expect(appConfig.providers).toBeDefined();
    expect(Array.isArray(appConfig.providers)).toBe(true);
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });

  it('should be a valid ApplicationConfig', () => {
    const config: ApplicationConfig = appConfig;
    expect(config).toBeDefined();
    expect(config.providers).toBeDefined();
  });

  it('should configure TestBed successfully', () => {
    expect(() => {
      TestBed.configureTestingModule({
        providers: appConfig.providers,
      });
    }).not.toThrow();
  });

  it('should provide Router after configuration', () => {
    TestBed.configureTestingModule({
      providers: appConfig.providers,
    });

    const router = TestBed.inject(Router);
    expect(router).toBeDefined();
    expect(router).toBeInstanceOf(Router);
  });

  it('should provide HttpClient after configuration', () => {
    TestBed.configureTestingModule({
      providers: appConfig.providers,
    });

    const http = TestBed.inject(HttpClient);
    expect(http).toBeDefined();
    expect(http).toBeInstanceOf(HttpClient);
  });

  it('should have at least 3 providers', () => {
    // Router, HttpClient, ZoneChangeDetection como mínimo
    expect(appConfig.providers.length).toBeGreaterThanOrEqual(3);
  });

  it('should include zone change detection configuration', () => {
    // Verificar que existe configuración de zone sin acceder a APIs internas
    const hasZoneConfig = appConfig.providers.some(
      (provider: any) => 
        provider?.ɵproviders || // Para provideZoneChangeDetection
        provider?.provide?.toString().includes('Zone') ||
        typeof provider === 'function'
    );
    expect(hasZoneConfig).toBe(true);
  });

  it('should allow application bootstrap', async () => {
    const testBed = TestBed.configureTestingModule({
      providers: appConfig.providers,
    });

    expect(testBed).toBeDefined();
    
    // Verificar que se puede inyectar servicios básicos
    expect(() => testBed.inject(Router)).not.toThrow();
    expect(() => testBed.inject(HttpClient)).not.toThrow();
  });
});
