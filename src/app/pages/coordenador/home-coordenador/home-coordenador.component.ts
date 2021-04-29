import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-home-coordenador',
  templateUrl: './home-coordenador.component.html',
  styleUrls: ['./home-coordenador.component.css']
})
export class HomeCoordenadorComponent implements OnInit {
  loading = false;
  loadingDisciplina = false;
  dadosProfessores: any;
  iSelecionado = -1;
  uidProfSelecionado = '';
  dadosDisciplinas: any;

  constructor(public authService: AuthenticationService,
              private firestore: AngularFirestore,
              public router: Router) {

    if (this.authService.getEmail !== 'coordenador@blococonceitual.com') {
      this.router.navigate(['home']);
    }
  }

  ngOnInit() {
    this.loading = true;
    this.getProfessores();
  }

  getProfessores = () =>
    this.getProfessoresObserver()
      .subscribe(res => {
        this.loading = false;
        this.dadosProfessores = res;
      });

  getProfessoresObserver() {
    return this.firestore.collection('users',
      ref => ref.where('emailVerified', '==', false)).snapshotChanges();
  }

  verDetalhes(uid, i) {
    if (this.iSelecionado === i) {
      this.iSelecionado = -1;
      this.uidProfSelecionado = '';
      return;
    }
    this.iSelecionado = i;
    this.uidProfSelecionado = uid;
    this.carregarDisciplinasProf();
  }

  carregarDisciplinasProf() {
    this.loadingDisciplina = true;
    this.getDisciplinas();
  }


  getDisciplinas = () =>
    this.getDisciplinasObserver()
      .subscribe(res => {
        this.dadosDisciplinas = res;
        this.loadingDisciplina = false;
      });

  getDisciplinasObserver() {
    return this.firestore.collection('prof_disciplinas',
      ref => ref.where('user_id', '==', this.uidProfSelecionado)).snapshotChanges();
  }

}
