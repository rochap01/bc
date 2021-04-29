import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './pages/publico/home/home.component';
import {NaoEncontradoComponent} from './pages/publico/nao-encontrado/nao-encontrado.component';
import {HomeCoordenadorComponent} from './pages/coordenador/home-coordenador/home-coordenador.component';
import {AuthGuard} from './util/auth.guard';
import {LoginComponent} from './pages/auth/login/login.component';
import {SignUpComponent} from './pages/auth/sign-up/sign-up.component';
import {ForgotPasswordComponent} from './pages/auth/forgot-password/forgot-password.component';
import {VerifyEmailComponent} from './pages/auth/verify-email/verify-email.component';
import {SecureInnerPagesGuard} from './util/secure-inner-pages.guard';
import {ProfessorHomeComponent} from './pages/professor/professor-home/professor-home.component';
import {ProfessorPlanejamentoComponent} from './pages/professor/professor-planejamento/professor-planejamento.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'auth/login', component: LoginComponent},
  {path: 'sign-in', component: LoginComponent, canActivate: [SecureInnerPagesGuard]},
  {path: 'register-user', component: SignUpComponent, canActivate: [SecureInnerPagesGuard]},
  {path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [SecureInnerPagesGuard]},
  {path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard]},
  {path: 'coord/home', component: HomeCoordenadorComponent, canActivate: [AuthGuard]},
  {path: 'prof/home', component: ProfessorHomeComponent, canActivate: [AuthGuard]},
  {path: 'prof/plan/:id', component: ProfessorPlanejamentoComponent, canActivate: [AuthGuard]},
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },

  {path: '**', component: NaoEncontradoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
