import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { CandidatosComponent } from './pages/candidatos/candidatos.component';

export const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent },
    { path: 'candidatos', component: CandidatosComponent },
    // { path: 'nosotros', component: NosotrosComponent },
    { path: '**', redirectTo: '/inicio' }
];
