import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    // { path: 'inicio', component: InicioComponent },
    // { path: 'candidatos', component: CandidatosComponent },
    // { path: 'nosotros', component: NosotrosComponent },
    { path: '**', redirectTo: '/inicio' }
];
