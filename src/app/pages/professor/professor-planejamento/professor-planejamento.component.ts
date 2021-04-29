import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Planejamento} from '../../../model/planejamento';
import {Disciplina} from '../../../model/disciplina';
import {AuthenticationService} from '../../../services/authentication.service';
import {AlertService} from '../../../services/alert.service';
import {Episodio} from '../../../model/episodio';
import {EpisodioDependente} from '../../../model/episodioDependente';
import {Recurso} from '../../../model/recurso';
import {RecursoDependente} from '../../../model/recursoDependente';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MyCustomUploadAdapterPlugin from '../../../util/ckeditorAdapterImage';
import {Avaliacao} from '../../../model/avaliacao';
import {AvaliacaoRecurso} from '../../../model/avaliacaoRecurso';


@Component({
  selector: 'app-professor-planejamento',
  templateUrl: './professor-planejamento.component.html',
  styleUrls: ['./professor-planejamento.component.css']
})
export class ProfessorPlanejamentoComponent implements OnInit {
  idDisciplina: string;
  dadosPlanejamento: any;
  dadosDisciplina: any;
  private itemDoc: AngularFirestoreDocument<Planejamento>;
  private itemDocDisciplina: AngularFirestoreDocument<Disciplina>;
  adicionandoEpisodio = false;
  dadosEpisodios: any;
  loadingEpisodios = false;

  novoEpisodio = {
    nome: '',
    ordem: 0,
    pontoChegada: false,
    descricao: ''
  };

  episodioSelecionado = -1;
  idEpisodioSelecionado = '';
  novaDependenciaAberta = false;
  novoRecursoAberto = false;
  novaAvaliacaoAberta = false;

  novaDependenciaSelecionado = '';
  novoDependenciaGrau = 1;
  novoDependenciaDescricao = '';
  loadingDependencias = false;
  dadosDependencias: any;

  novoRecursoNome = '';
  novoRecursoTempo = 0;
  novoRecursoDescricao = '';
  novoRecursoTempoTipo = '';
  dadosRecursos: any;
  loadingRecursos = false;

  idRecursoDefinindoConteudo = '';
  definindoConteudoAberto = false;
  definindoConteudoTipo: string;
  definindoConteudoConteudo: any;

  novoDependenciaGrauRecurso = 1;
  novoDependenciaDescricaoRecurso = '';
  loadingDependenciasRecurso = false;
  dadosDependenciasRecurso: any;
  novaDependenciaSelecionadoRecurso = '';
  idRecursoSelecionadoDependencia = '';
  novaDependenciaAbertaRecurso = false;
  novaAvaliacaoRecursoConceitos = [];

  public Editor = ClassicEditor;
  config = {
    extraPlugins: [MyCustomUploadAdapterPlugin],
  };

  novaAvaliacaoNome = '';
  novaAvaliacaoTempo = 0;
  novaAvaliacaoDescricao = '';
  novaAvaliacaoTempoTipo = '';
  dadosAvaliacao: any;
  loadingAvaliacoes = false;
  idRecursoAberto = '';

  loadingAvaliacoesRecurso = false;
  dadosAvaliacoesRecurso: any;
  novaAvaliacaoRecursoNome = '';
  novaAvaliacaoRecursoTempo = 0;
  novaAvaliacaoRecursoDescricao = '';
  novaAvaliacaoRecursoTempoTipo = '';
  idRecursoSelecionadoNovaAvaliacao = '';
  novaAvaliacaoRecursoAberta = false;

  abaInternaEpisodio = 0;

  constructor(private route: ActivatedRoute,
              private firestore: AngularFirestore,
              private alertService: AlertService,
              public authenticationService: AuthenticationService,
              private afs: AngularFirestore) {
    this.route.paramMap.subscribe(params => {
      this.idDisciplina = params.get('id');
    });
  }

  ngOnInit() {
    this.itemDocDisciplina = this.afs.doc<Planejamento>('prof_disciplinas/' + this.idDisciplina);
    this.itemDocDisciplina.valueChanges().subscribe(data => {
      this.dadosDisciplina = data;
    });
    this.carregarPlanejamento();
  }


  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  carregarPlanejamento() {
    const caminho = 'prof_planejamento/' + this.idDisciplina;
    this.itemDoc = this.afs.doc<Planejamento>(caminho);
    this.itemDoc.valueChanges().subscribe(data => {
      if (!data) {

        const planejamento: Planejamento = {
          disciplina_id: this.idDisciplina,
          user_id: this.authenticationService.getUID
        };

        this.firestore.collection('prof_planejamento').doc(this.idDisciplina).set(planejamento).then(
          res => {
          }
        ).catch(erro => {
          console.log(erro);
        });

      } else {
        this.dadosPlanejamento = data;
      }
      this.getEpisodios();
    });
  }

  abrirAdicionarEpisodio() {
    this.novoEpisodio = {
      nome: '',
      ordem: 0,
      pontoChegada: false,
      descricao: ''
    };
    this.adicionandoEpisodio = true;
  }

  fecharAdicionarEpisodio() {
    this.adicionandoEpisodio = false;
  }

  salvarEpisodio() {
    if (this.novoEpisodio.nome === '') {
      this.alertService.showErro('Preencha o nome da Unidade para continuar!');
      return;
    }
    let uiltimaOrdem = 0;
    if (this.dadosEpisodios && this.dadosEpisodios.length > 0) {
      uiltimaOrdem = this.dadosEpisodios[this.dadosEpisodios.length - 1].payload.doc.data().ordem + 1;
    }
    this.novoEpisodio.ordem = uiltimaOrdem;

    const episodio: Episodio = {
      nome: this.novoEpisodio.nome,
      ordem: this.novoEpisodio.ordem,
      descricao: this.novoEpisodio.descricao,
      pontoChegada: this.novoEpisodio.pontoChegada,
      plan_id: this.idDisciplina,
      disciplina_id: this.idDisciplina
    };

    this.firestore.collection('prof_plan_epsodios').add(episodio).then(res => {
      this.alertService.showSuccess('Epsódio inserida com sucesso!');
      this.fecharAdicionarEpisodio();
      this.abrirEpisodio(this.dadosEpisodios.length - 1, this.dadosEpisodios[this.dadosEpisodios.length - 1].payload.doc.id);
    }).catch(erro => {
      this.alertService.showErro('Ocorreu um problema ao salvar a unidade: ' + erro);
    });
  }

  getEpisodios = () =>
    this.getEpisodiosObserver()
      .subscribe(res => {
        this.loadingEpisodios = false;
        this.dadosEpisodios = res;
        if (this.dadosEpisodios.length > 0) {
          this.loadingDependencias = true;
          this.getDependencias();
          this.loadingRecursos = true;
          this.getRecursos();
          this.loadingDependenciasRecurso = true;
          this.getDependenciasRecurso();
          this.loadingAvaliacoesRecurso = true;
          this.getAvaliacoesRecurso();
          this.loadingAvaliacoes = true;
          this.getAvaliacoes();
          this.abrirEpisodio(0, this.dadosEpisodios[0].payload.doc.id);
        }
      });

  getEpisodiosObserver() {
    return this.firestore.collection('prof_plan_epsodios',
      ref => ref.where('plan_id', '==', this.idDisciplina)
        .where('disciplina_id', '==', this.idDisciplina)
        .orderBy('ordem')
    ).snapshotChanges();
  }

  abrirEpisodio(i, id) {
    if (i === this.episodioSelecionado) {
      return;
    }
    this.ativarAbaInterna(1);
    this.novoRecursoAberto = false;
    this.novaAvaliacaoAberta = false;
    this.novaDependenciaAberta = false;
    this.definindoConteudoAberto = false;
    this.episodioSelecionado = i;
    this.idEpisodioSelecionado = id;

  }

  abrirNovoDependencia() {
    this.novaDependenciaSelecionado = '';
    this.novoDependenciaGrau = 0;
    this.novoDependenciaDescricao = '';
    this.novaDependenciaAberta = true;
  }

  fecharNovoDependencia() {
    this.novaDependenciaAberta = false;
  }

  abrirNovoRecurso() {
    this.novoRecursoNome = '';
    this.novoRecursoTempo = 0;
    this.novoRecursoDescricao = '';
    this.novoRecursoTempoTipo = 'horas';
    this.novoRecursoAberto = true;
  }

  fecharNovoRecurso() {
    this.novoRecursoAberto = false;
  }

  abrirNovoAvaliacao() {
    this.novaAvaliacaoNome = '';
    this.novaAvaliacaoTempo = 0;
    this.novaAvaliacaoDescricao = '';
    this.novaAvaliacaoTempoTipo = '';
    this.novaAvaliacaoAberta = true;
  }

  fecharNovoAvaliacao() {
    this.novaAvaliacaoAberta = false;
  }

  salvarNovaDependencia() {
    if (this.novoDependenciaGrau <= 0 || this.novaDependenciaSelecionado === '') {
      this.alertService.showErro('Preencha os campos obrigatórios para salvar.');
      return;
    }
    if (this.novaDependenciaSelecionado === this.idEpisodioSelecionado) {
      this.alertService.showErro('Selecione uma unidade diferente para salvar!');
      return;
    }
    if (this.jaExisteNaLista(this.novaDependenciaSelecionado)) {
      this.alertService.showErro('Esta unidade já existe na lista de dependências');
      return;
    }

    let ordemDependencia = 0;
    if (this.dadosDependencias && this.dadosDependencias.length > 0) {
      ordemDependencia = this.dadosDependencias[this.dadosDependencias.length - 1].payload.doc.data().ordem + 1;
    }

    const episodioDependente: EpisodioDependente = {
      nomeEpisodioDependente: this.retornarNomeDeId(this.novaDependenciaSelecionado),
      ordem: ordemDependencia,
      episodio_dependente: this.novaDependenciaSelecionado,
      grauDependencia: Number(this.novoDependenciaGrau),
      episodio_pai: this.idEpisodioSelecionado,
      excluido: false,
      descricao: this.novoDependenciaDescricao,
      disciplina_id: this.idDisciplina
    };

    this.firestore.collection('prof_plan_epsodio_dependencias')
      .add(episodioDependente).then(res => {
      this.alertService.showSuccess('Dependência inserida com sucesso!');
      this.fecharNovoDependencia();
    }).catch(erro => {
      this.alertService.showErro('Ocorreu um problema ao salvar a unidade: ' + erro);
    });
  }

  retornarNomeDeId(pId) {
    let saida = '';
    this.dadosEpisodios.forEach(item => {
      if (item.payload.doc.id === pId) {
        saida = item.payload.doc.data().nome;
      }
    });
    return saida;
  }

  getDependencias = () =>
    this.getDependenciasObserver()
      .subscribe(res => {
        this.loadingDependencias = false;
        this.dadosDependencias = res;
      });

  getDependenciasObserver() {
    return this.firestore.collection('prof_plan_epsodio_dependencias',
      ref => ref.where('excluido', '==', false)
        .where('disciplina_id', '==', this.idDisciplina)
        .orderBy('episodio_pai')
        .orderBy('grauDependencia', 'desc')
        .orderBy('ordem', 'asc')
    ).snapshotChanges();
  }

  jaExisteNaLista(pId) {
    let saida = false;
    this.dadosDependencias.forEach(item => {
      if (item.payload.doc.data().episodio_dependente === pId) {
        saida = true;
      }
    });
    return saida;
  }

  apagarDependencia(pId) {
    if (confirm('Tem certeza?')) {
      this.firestore.collection('prof_plan_epsodio_dependencias').doc(pId).delete().then(res => {
        this.alertService.showSuccess('Registro excluido com sucesso');
      }).catch(erro => {
        this.alertService.showErro('Ocorreu um problema ao salvar a uniade: ' + erro);
      });
    }
  }

  apagarUnidade(pId) {
    if (confirm('Tem certeza?')) {
      this.firestore.collection('prof_plan_epsodios').doc(pId).delete().then(res => {
        this.alertService.showSuccess('Registro excluido com sucesso');
      }).catch(erro => {
        this.alertService.showErro('Ocorreu um problema ao salvar a uniade: ' + erro);
      });
    }
  }

  apagarAula(pId) {
    if (confirm('Tem certeza?')) {
      this.firestore.collection('prof_plan_epsodio_recursos').doc(pId).delete().then(res => {
        this.alertService.showSuccess('Registro excluido com sucesso');
      }).catch(erro => {
        this.alertService.showErro('Ocorreu um problema ao salvar a uniade: ' + erro);
      });
    }
  }

  salvarNovoRecurso() {
    if (this.novoRecursoNome === '' || this.novoRecursoTempo <= 0) {
      this.alertService.showErro('Preencha todos os campos para salvar!');
      return;
    }

    let ordemRecurso = 0;
    if (this.dadosRecursos && this.dadosRecursos.length > 0) {
      ordemRecurso = this.dadosRecursos[this.dadosRecursos.length - 1].payload.doc.data().ordem + 1;
    }

    const episodioRecurso: Recurso = {
      nome: this.novoRecursoNome,
      ordem: ordemRecurso,
      tempo: this.novoRecursoTempo,
      descricao: this.novoRecursoDescricao,
      tempoTipo: this.novoRecursoTempoTipo,
      episodio_pai: this.idEpisodioSelecionado,
      excluido: false,
      tipoConteudo: '',
      conteudo: '',
      disciplina_id: this.idDisciplina
    };

    this.firestore.collection('prof_plan_epsodio_recursos')
      .add(episodioRecurso).then(res => {
      this.alertService.showSuccess('Recurso inserida com sucesso!');
      this.fecharNovoRecurso();
    }).catch(erro => {
      this.alertService.showErro('Ocorreu um problema ao salvar a rcurso: ' + erro);
    });
  }

  getRecursos = () =>
    this.getRecursosObserver()
      .subscribe(res => {
        this.loadingRecursos = false;
        this.dadosRecursos = res;
      });

  getRecursosObserver() {
    return this.firestore.collection('prof_plan_epsodio_recursos',
      ref => ref.where('excluido', '==', false)
        .where('disciplina_id', '==', this.idDisciplina)
        .orderBy('ordem')
    ).snapshotChanges();
  }


  apagarRecurso(pId) {
    if (confirm('Tem certeza?')) {
      this.firestore.collection('prof_plan_epsodio_recursos').doc(pId).delete().then(res => {
        this.alertService.showSuccess('Registro excluido com sucesso');
      }).catch(erro => {
        this.alertService.showErro('Ocorreu um problema ao salvar a unidade: ' + erro);
      });
    }
  }

  abrirDefinirConteudoRecurso(pId, tipo, conteudo) {
    this.idRecursoDefinindoConteudo = pId;
    this.definindoConteudoTipo = tipo;
    this.definindoConteudoConteudo = conteudo;
    this.definindoConteudoAberto = true;
  }

  fecharDefinirConteudoRecurso(pId) {
    this.idRecursoDefinindoConteudo = '';
    this.definindoConteudoAberto = false;
  }

  definirTipoRecurso(tipo) {
    this.firestore.collection('prof_plan_epsodio_recursos').doc(this.idRecursoDefinindoConteudo).set(
      {tipoConteudo: tipo}, {merge: true}
    ).then(res => {
      this.definindoConteudoTipo = tipo;
      this.alertService.showSuccess('Tipo definido com sucesso');
    }).catch(erro => {
      this.alertService.showErro('Ocorreu um problema ao salvar o tipo: ' + erro);
    });
  }

  adicionarConceitoParaRecurso(pIdRecurso, conceitosExistentes) {
    const value = prompt('Digite o nome do Recurso');
    if (value && value !== '') {
      if (!conceitosExistentes || conceitosExistentes.length <= 0) {
        conceitosExistentes = [];
      }
      conceitosExistentes.push(value);
      this.firestore.collection('prof_plan_epsodio_recursos').doc(pIdRecurso).set(
        {conceitos: conceitosExistentes}, {merge: true}
      ).then(res => {
        this.alertService.showSuccess('Conceito Adicionando com sucesso');
      }).catch(erro => {
        this.alertService.showErro('Ocorreu um problema ao salvar o tipo: ' + erro);
      });
    }
  }

  apagarConceitoRecurso(index, pIdRecurso, conceitosExistentes) {
    if (confirm('Tem certeza?')) {
      conceitosExistentes.splice(index, 1);
      this.firestore.collection('prof_plan_epsodio_recursos').doc(pIdRecurso).set(
        {conceitos: conceitosExistentes}, {merge: true}
      ).then(res => {
        this.alertService.showSuccess('Conceito removido com sucesso');
      }).catch(erro => {
        this.alertService.showErro('Ocorreu um problema ao salvar o tipo: ' + erro);
      });
    }
  }


  salvarNovaDependenciaRecurso() {
    if (this.novoDependenciaGrauRecurso <= 0 || this.novaDependenciaSelecionadoRecurso === '') {
      this.alertService.showErro('Preencha os campos obrigatórios para salvar.');
      return;
    }
    if (this.novaDependenciaSelecionadoRecurso === this.idRecursoSelecionadoDependencia) {
      this.alertService.showErro('Selecione uma unidade diferente para salvar!');
      return;
    }
    if (this.jaExisteNaListaRecurso(this.novaDependenciaSelecionadoRecurso)) {
      this.alertService.showErro('Este recurso já existe na lista de dependências');
      return;
    }

    let ordemDependencia = 0;
    if (this.dadosDependenciasRecurso && this.dadosDependenciasRecurso.length > 0) {
      ordemDependencia = this.dadosDependenciasRecurso[this.dadosDependenciasRecurso.length - 1].payload.doc.data().ordem + 1;
    }

    const episodioDependente: RecursoDependente = {
      nomeRecursoDependente: this.retornarNomeDeIdRecurso(this.novaDependenciaSelecionadoRecurso),
      ordem: ordemDependencia,
      recurso_dependente: this.novaDependenciaSelecionadoRecurso,
      grauDependencia: Number(this.novoDependenciaGrauRecurso),
      recurso_pai: this.idRecursoSelecionadoDependencia,
      excluido: false,
      idEpisodio: this.idEpisodioSelecionado,
      descricao: this.novoDependenciaDescricaoRecurso,
      disciplina_id: this.idDisciplina
    };

    this.firestore.collection('prof_plan_epsodio_recursos_dependencias')
      .add(episodioDependente).then(res => {
      this.alertService.showSuccess('Dependência inserida com sucesso!');
      this.fecharNovoDependenciaRecurso();
    }).catch(erro => {
      this.alertService.showErro('Ocorreu um problema ao salvar a unidade: ' + erro);
    });
  }

  retornarNomeDeIdRecurso(pId) {
    let saida = '';
    this.dadosRecursos.forEach(item => {
      if (item.payload.doc.id === pId) {
        saida = item.payload.doc.data().nome;
      }
    });
    return saida;
  }

  getDependenciasRecurso = () =>
    this.getDependenciasRecursoObserver()
      .subscribe(res => {
        this.dadosDependenciasRecurso = res;
        this.loadingDependenciasRecurso = false;
      });

  getDependenciasRecursoObserver() {
    return this.firestore.collection('prof_plan_epsodio_recursos_dependencias',
      ref => ref.where('excluido', '==', false)
        .where('disciplina_id', '==', this.idDisciplina)
        .orderBy('recurso_pai')
        .orderBy('grauDependencia', 'desc')
        .orderBy('ordem', 'asc')
    ).snapshotChanges();
  }


  jaExisteNaListaRecurso(pId) {
    let saida = false;
    if (this.dadosDependenciasRecurso) {
      this.dadosDependenciasRecurso.forEach(item => {
        if (item.payload.doc.data().recurso_dependente === pId) {
          saida = true;
        }
      });
    }
    return saida;
  }

  apagarDependenciaRecurso(pId) {
    if (confirm('Tem certeza?')) {
      this.firestore.collection('prof_plan_epsodio_recursos_dependencias').doc(pId).delete().then(res => {
        this.alertService.showSuccess('Registro excluido com sucesso');
      }).catch(erro => {
        this.alertService.showErro('Ocorreu um problema ao salvar a unidade: ' + erro);
      });
    }
  }

  abrirNovoDependenciaRecurso(pId) {
    this.idRecursoSelecionadoDependencia = pId;
    this.novaDependenciaSelecionadoRecurso = '';
    this.novoDependenciaGrauRecurso = 0;
    this.novoDependenciaDescricaoRecurso = '';
    this.novaDependenciaAbertaRecurso = true;
  }

  fecharNovoDependenciaRecurso() {
    this.novaDependenciaAbertaRecurso = false;
  }

  salvarNovaAvaliacao() {
    if (this.novaAvaliacaoNome === '' || this.novaAvaliacaoTempo <= 0) {
      this.alertService.showErro('Preencha todos os campos para salvar!');
      return;
    }

    let ordemRecurso = 0;
    if (this.dadosAvaliacao && this.dadosAvaliacao.length > 0) {
      ordemRecurso = this.dadosAvaliacao[this.dadosAvaliacao.length - 1].payload.doc.data().ordem + 1;
    }

    const episodioRecurso: Avaliacao = {
      nome: this.novaAvaliacaoNome,
      ordem: ordemRecurso,
      tempo: this.novaAvaliacaoTempo,
      descricao: this.novaAvaliacaoDescricao,
      tempoTipo: this.novaAvaliacaoTempoTipo,
      episodio_pai: this.idEpisodioSelecionado,
      excluido: false,
      tipoConteudo: '',
      conteudo: '',
      disciplina_id: this.idDisciplina
    };

    this.firestore.collection('prof_plan_epsodio_avaliacoes')
      .add(episodioRecurso).then(res => {
      this.alertService.showSuccess('Avaliação inserida com sucesso!');
      this.fecharNovoAvaliacao();
    }).catch(erro => {
      this.alertService.showErro('Ocorreu um problema ao salvar a avaliação: ' + erro);
    });
  }

  getAvaliacoes = () =>
    this.getAvaliacoesObserver()
      .subscribe(res => {
        this.loadingAvaliacoes = false;
        this.dadosAvaliacao = res;
      });

  getAvaliacoesObserver() {
    return this.firestore.collection('prof_plan_epsodio_avaliacoes',
      ref => ref.where('excluido', '==', false)
        .where('disciplina_id', '==', this.idDisciplina)
        .orderBy('ordem')
    ).snapshotChanges();
  }

  apagarAvaliacao(pId) {
    if (confirm('Tem certeza?')) {
      this.firestore.collection('prof_plan_epsodio_avaliacoes').doc(pId).delete().then(res => {
        this.alertService.showSuccess('Registro excluido com sucesso');
      }).catch(erro => {
        this.alertService.showErro('Ocorreu um problema ao salvar a unidade: ' + erro);
      });
    }
  }

  expandirRecurso(pId) {
    if (this.idRecursoAberto === pId) {
      this.idRecursoAberto = '';
      return;
    }
    this.idRecursoAberto = pId;
  }

  getAvaliacoesRecurso = () =>
    this.getAvaliacoesRecursoObserver()
      .subscribe(res => {
        this.dadosAvaliacoesRecurso = res;
        this.loadingAvaliacoesRecurso = false;
      });

  getAvaliacoesRecursoObserver() {
    return this.firestore.collection('prof_plan_epsodio_recursos_avaliacoes',
      ref => ref.where('excluido', '==', false)
        .where('disciplina_id', '==', this.idDisciplina)
        .orderBy('recurso_pai')
        .orderBy('ordem', 'asc')
    ).snapshotChanges();
  }


  salvarNovaAvaliacaoRecurso() {
    if (this.novaAvaliacaoRecursoNome === '' || this.novaAvaliacaoRecursoTempo <= 0) {
      this.alertService.showErro('Preencha todos os campos para salvar!');
      return;
    }

    let ordemRecurso = 0;
    if (this.dadosAvaliacoesRecurso && this.dadosAvaliacoesRecurso.length > 0) {
      ordemRecurso = this.dadosAvaliacoesRecurso[this.dadosAvaliacoesRecurso.length - 1].payload.doc.data().ordem + 1;
    }

    const episodioRecurso: AvaliacaoRecurso = {
      nome: this.novaAvaliacaoRecursoNome,
      ordem: ordemRecurso,
      tempo: this.novaAvaliacaoRecursoTempo,
      descricao: this.novaAvaliacaoRecursoDescricao,
      tempoTipo: this.novaAvaliacaoRecursoTempoTipo,
      recurso_pai: this.idRecursoSelecionadoNovaAvaliacao,
      excluido: false,
      tipoConteudo: '',
      conteudo: '',
      disciplina_id: this.idDisciplina,
      conceitos: this.novaAvaliacaoRecursoConceitos
    };

    this.firestore.collection('prof_plan_epsodio_recursos_avaliacoes')
      .add(episodioRecurso).then(res => {
      this.alertService.showSuccess('Avaliação inserida com sucesso!');
      this.fecharNovoAvaliacaoRecurso();
    }).catch(erro => {
      this.alertService.showErro('Ocorreu um problema ao salvar a avaliação: ' + erro);
    });
  }

  abrirNovoAvaliacaoRecurso(pId) {
    this.idRecursoSelecionadoNovaAvaliacao = pId;
    this.novaAvaliacaoRecursoNome = '';
    this.novaAvaliacaoRecursoTempo = 0;
    this.novaAvaliacaoRecursoDescricao = '';
    this.novaAvaliacaoRecursoTempoTipo = 'horas';
    this.novaAvaliacaoRecursoConceitos = [];
    this.novaAvaliacaoRecursoAberta = true;
  }

  fecharNovoAvaliacaoRecurso() {
    this.novaAvaliacaoRecursoAberta = false;
  }

  apagarAvaliacaoRecurso(pId) {
    if (confirm('Tem certeza?')) {
      this.firestore.collection('prof_plan_epsodio_recursos_avaliacoes').doc(pId).delete().then(res => {
        this.alertService.showSuccess('Registro excluido com sucesso');
      }).catch(erro => {
        this.alertService.showErro('Ocorreu um problema ao salvar a unidade: ' + erro);
      });
    }
  }

  ativarAbaInterna(aba) {
    this.abaInternaEpisodio = aba;
  }

  abrirEditarUnidade() {

  }
}
