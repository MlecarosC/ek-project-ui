import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent { 
  menuItems = [
    { label: 'Inicio', route: '/inicio' },
    { label: 'Candidatos', route: '/candidatos' },
    { label: 'Nosotros', route: '/nosotros' }
  ];
}
