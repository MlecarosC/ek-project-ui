import { signal, effect, Signal } from '@angular/core';


export function debounceSignal<T>(
  sourceSignal: Signal<T>,
  delay: number = 250
): Signal<T> {
  const debouncedSignal = signal(sourceSignal());
  let timeoutId: number | undefined;

  effect(() => {
    const value = sourceSignal();
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = window.setTimeout(() => {
      debouncedSignal.set(value);
    }, delay);
  });

  return debouncedSignal.asReadonly();
}
