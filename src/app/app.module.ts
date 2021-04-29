import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {HomeComponent} from './pages/publico/home/home.component';
import {NaoEncontradoComponent} from './pages/publico/nao-encontrado/nao-encontrado.component';
import {HomeCoordenadorComponent} from './pages/coordenador/home-coordenador/home-coordenador.component';
import {AuthenticationService} from './services/authentication.service';
import {NOTYF, notyfFactory} from './util/notyf.token';
import { LoginComponent } from './pages/auth/login/login.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { VerifyEmailComponent } from './pages/auth/verify-email/verify-email.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {NgxBlocklyModule} from 'ngx-blockly';
import { ProfessorHomeComponent } from './pages/professor/professor-home/professor-home.component';
import { ProfessorPlanejamentoComponent } from './pages/professor/professor-planejamento/professor-planejamento.component';
import {FormsModule} from '@angular/forms';
import { PlanExibirGraficoComponent } from './pages/professor/professor-planejamento/plan-exibir-grafico/plan-exibir-grafico.component';
import { AninhaComponent } from './pages/temp/aninha/aninha.component';
import { PlanExibirTrajetoriaComponent } from './pages/professor/professor-planejamento/plan-exibir-trajetoria/plan-exibir-trajetoria.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NaoEncontradoComponent,
    HomeCoordenadorComponent,
    LoginComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    VerifyEmailComponent,
    ProfessorHomeComponent,
    ProfessorPlanejamentoComponent,
    PlanExibirGraficoComponent,
    AninhaComponent,
    PlanExibirTrajetoriaComponent
  ],
  imports: [
    BrowserModule,
    NgxBlocklyModule,
    CKEditorModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgbModule,
    NgxBlocklyModule,
    AppRoutingModule
  ],
  providers: [
    AuthenticationService,
    {provide: NOTYF, useFactory: notyfFactory},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
