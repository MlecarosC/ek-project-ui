import { Component } from '@angular/core';

@Component({
  selector: 'app-nosotros',
  imports: [],
  templateUrl: './nosotros.component.html',
})
export class NosotrosComponent {
  photoUrl = "/images/me.jpg"
  photoAlt = "Martin Lecaros"

  // Prevenir click derecho en la imagen
  onImageRightClick(event: MouseEvent): boolean {
    event.preventDefault();
    return false;
  }
}