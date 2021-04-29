import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {AlertService} from '../../../services/alert.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Disciplina} from '../../../model/disciplina';

@Component({
  selector: 'app-professor-home',
  templateUrl: './professor-home.component.html',
  styleUrls: ['./professor-home.component.css']
})
export class ProfessorHomeComponent implements OnInit {
  temNome = false;
  nomeCompleto: string;
  loading = false;
  dadosDisciplinas: any;
  adicionandoDisciplina = false;
  novoDisciplinaNome = '';
  novoDisciplinaDescricao = '';
  novoDisciplinaObjetivos = '';
  novoDisciplinaEmenta = '';
  novoDisciplinaCH = 40;

  constructor(private authenticationService: AuthenticationService,
              public afAuth: AngularFireAuth,
              private firestore: AngularFirestore,
              private alertService: AlertService) {
    this.nomeCompleto = '';
    if (authenticationService.getDisplayNmae && authenticationService.getDisplayNmae !== '') {
      this.temNome = true;
    }
  }

  ngOnInit() {
    this.loading = true;
    this.getDisciplinas();
  }

  getDisciplinas = () =>
    this.getDisciplinasObserver()
      .subscribe(res => {
        this.loading = false;
        this.dadosDisciplinas = res;
      });

  getDisciplinasObserver() {
    return this.firestore.collection('prof_disciplinas',
      ref => ref.where('user_id', '==', this.authenticationService.getUID)).snapshotChanges();
  }

  salvarNome() {
    if (!this.nomeCompleto || this.nomeCompleto === '') {
      this.alertService.showErro('Preencha o Nome  para salvar');
      return;
    }
    this.afAuth.auth.currentUser.updateProfile({
      displayName: this.nomeCompleto
    }).then(() => {
      this.authenticationService.userData.displayName = this.nomeCompleto;
      this.authenticationService.SignOut();
      this.alertService.showSuccess('Nome Atualizado com Sucesso. Entre novamente para atualizar.');
    }).catch(err => this.authenticationService.SignOut());
  }

  abrirAdicionarDisciplina() {
    this.novoDisciplinaNome = '';
    this.novoDisciplinaDescricao = '';
    this.novoDisciplinaObjetivos = '';
    this.novoDisciplinaEmenta = '';
    this.novoDisciplinaCH = 40;
    this.adicionandoDisciplina = true;
  }

  fecharAdicionarDisciplina() {
    this.adicionandoDisciplina = false;
  }

  salvarNovaDisciplina() {
    if (this.novoDisciplinaNome === '') {
      this.alertService.showErro('Digite o nome da Disciplina para Salvar');
      return;
    }

    const disciplina: Disciplina = {
      nome: this.novoDisciplinaNome,
      descricao: this.novoDisciplinaDescricao,
      ementa: this.novoDisciplinaEmenta,
      ch: this.novoDisciplinaCH,
      objetivos: this.novoDisciplinaObjetivos,
      user_id: this.authenticationService.getUID
    };

    this.firestore.collection('prof_disciplinas').add(disciplina).then(res => {
      this.alertService.showSuccess('Disciplina inserida com sucesso!');
      this.fecharAdicionarDisciplina();
    }).catch(erro => {
      this.alertService.showErro('Ocorreu um problema ao salvar a disciplina: ' + erro);
    });


  }

}
