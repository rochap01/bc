import {Component} from '@angular/core';
import {AuthenticationService} from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCoordenador = false;

  constructor(public authenticationService: AuthenticationService) {
    if (this.authenticationService.getEmail === 'coordenador@blococonceitual.com') {
      this.isCoordenador = true;
    }
  }

  sair() {
    this.authenticationService.SignOut();
  }
}
