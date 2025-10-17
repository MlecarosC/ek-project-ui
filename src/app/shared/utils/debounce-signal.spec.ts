import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { debounceSignal } from './debounce-signal';

describe('debounceSignal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    TestBed.runInInjectionContext(() => {
      const source = signal('initial');
      const debounced = debounceSignal(source, 300);

      expect(debounced()).toBe('initial');
    });
  });

  it('should debounce signal updates', () => {
    TestBed.runInInjectionContext(() => {
      const source = signal('initial');
      const debounced = debounceSignal(source, 300);

      // Cambiar valor
      source.set('changed');

      // Valor aún no debe cambiar
      expect(debounced()).toBe('initial');

      // Avanzar tiempo
      jest.advanceTimersByTime(300);

      // Ahora sí debe cambiar
      expect(debounced()).toBe('changed');
    });
  });

  it('should cancel previous timeout on rapid changes', () => {
    TestBed.runInInjectionContext(() => {
      const source = signal(0);
      const debounced = debounceSignal(source, 300);

      source.set(1);
      jest.advanceTimersByTime(100);

      source.set(2);
      jest.advanceTimersByTime(100);

      source.set(3);
      jest.advanceTimersByTime(100);

      expect(debounced()).toBe(0);

      jest.advanceTimersByTime(200);

      expect(debounced()).toBe(3);
    });
  });

  it('should use custom delay', () => {
    TestBed.runInInjectionContext(() => {
      const source = signal('a');
      const debounced = debounceSignal(source, 500);

      source.set('b');

      jest.advanceTimersByTime(300);
      expect(debounced()).toBe('a');

      jest.advanceTimersByTime(200);
      expect(debounced()).toBe('b');
    });
  });

  it('should handle multiple consecutive updates', () => {
    TestBed.runInInjectionContext(() => {
      const source = signal(1);
      const debounced = debounceSignal(source, 250);

      source.set(2);
      source.set(3);
      source.set(4);

      expect(debounced()).toBe(1);

      jest.advanceTimersByTime(250);

      expect(debounced()).toBe(4);
    });
  });

  it('should work with different data types', () => {
    TestBed.runInInjectionContext(() => {
      const objectSource = signal({ name: 'Alice' });
      const debouncedObject = debounceSignal(objectSource, 100);

      expect(debouncedObject()).toEqual({ name: 'Alice' });

      objectSource.set({ name: 'Bob' });
      jest.advanceTimersByTime(100);

      expect(debouncedObject()).toEqual({ name: 'Bob' });
    });
  });

  it('should return readonly signal', () => {
    TestBed.runInInjectionContext(() => {
      const source = signal('test');
      const debounced = debounceSignal(source, 100);

      expect((debounced as any).set).toBeUndefined();
    });
  });
});
