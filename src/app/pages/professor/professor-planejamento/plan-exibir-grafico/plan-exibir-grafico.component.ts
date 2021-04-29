import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Category, CustomBlock, NgxBlocklyComponent, NgxBlocklyConfig, NgxToolboxBuilderService} from 'ngx-blockly';
import {EpisodioBlock} from '../../../../blocks/episodio';
import {RecursoRecolhidoBlock} from '../../../../blocks/recursoRecolhido';
import {DependenciaBlock} from '../../../../blocks/dependencia';
import {AvaliacaoRecolhidoBlock} from '../../../../blocks/avaliacaoRecolhido';
import * as jsPDF from 'jspdf';
import {AlertService} from '../../../../services/alert.service';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-plan-exibir-grafico',
  templateUrl: './plan-exibir-grafico.component.html',
  styleUrls: ['./plan-exibir-grafico.component.css']
})
export class PlanExibirGraficoComponent implements OnInit {

  @Input() dadosEpisodios;
  @Input() dadosRecursos;
  @Input() dadosDependenicasEpisodios;
  @Input() dadosDependenicasRecursos;
  @Input() dadosAvaliacoes;
  @Input() dadosAvaliacoesRecurso;
  @Input() dadosDisciplina;
  @Input() idDisciplina;
  modoAtivo = 1;
  dadosExibir = [];
  loading = false;
  dadosExibirRecursos = [];
  public customBlocks: CustomBlock[] = [];
  public customBlocksRecursos: CustomBlock[] = [];
  public customBlocksDependencias: CustomBlock[] = [];
  public customBlocksAvaliacoes: CustomBlock[] = [];
  public geralCustomBlocks: CustomBlock[] = [];
  carregandoBlocos = false;
  jaGerouBlocos = false;

  @ViewChild(NgxBlocklyComponent, {static: false}) workspace;
  carregouItems = false;
  public config: NgxBlocklyConfig = {
    toolbox: `
        <xml id="toolbox" style="display: none">
        </xml>
    `,
    scrollbars: true,
    readOnly: false,
    trashcan: false,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 0.6,
      maxScale: 10,
      minScale: 1,
      scaleSpeed: 1,
    }
  };

  editandoDescricao = false;
  editandoEmenta = false;
  editandoObjetivos = false;

  constructor(private ngxToolboxBuilder: NgxToolboxBuilderService,
              private firestore: AngularFirestore,
              private alertService: AlertService) {
    ngxToolboxBuilder.nodes = [
      new Category(this.customBlocks, '#486692', 'Episódios', null),
      new Category(this.customBlocksRecursos, '#923c31', 'Recursos', null),
      new Category(this.customBlocksDependencias, '#8c7146', 'Dependências', null),
      new Category(this.customBlocksAvaliacoes, '#488c7d', 'Avaliacoes', null),
    ];
  }

  ngOnInit() {
    this.carregouItems = false;
  }

  abrirAba(modo) {
    this.modoAtivo = modo;
    if (modo === 0) {
      this.gerarBlocks();
    }
  }

  retornarEpisodiosComDependentes() {
    const saida = [];
    let sequencia = 0;
    this.dadosEpisodios.forEach(item => {
      const idEpisodio = item.payload.doc.id;
      const eDependentes = [];
      sequencia = sequencia + 1000;
      if (this.dadosDependenicasEpisodios) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.dadosDependenicasEpisodios.length; i++) {
          const itemDependente = this.dadosDependenicasEpisodios[i];
          if (itemDependente.payload.doc.data().episodio_pai === idEpisodio) {
            eDependentes.push({
              dependente: itemDependente.payload.doc.data().episodio_dependente,
              grauDependencia: itemDependente.payload.doc.data().grauDependencia,
              nomeEpisodioDependente: itemDependente.payload.doc.data().nomeEpisodioDependente,
              ordem: itemDependente.payload.doc.data().ordem
            });
          }
        }
      }

      saida.push({
        id: item.payload.doc.id,
        nome: item.payload.doc.data().nome,
        pontoChegada: item.payload.doc.data().pontoChegada,
        jaVericadoDependencia: false,
        ordem: sequencia,
        dependentes: eDependentes
      });
    });
    return saida;
  }

  retornarRecursosComDependentes() {
    const saida = [];
    let sequencia = 0;
    this.dadosRecursos.forEach(item => {
      const idRecurso = item.payload.doc.id;
      const eDependentes = [];
      sequencia = sequencia + 1000;
      if (this.dadosDependenicasRecursos) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.dadosDependenicasRecursos.length; i++) {
          const itemDependente = this.dadosDependenicasRecursos[i];
          if (itemDependente.payload.doc.data().recurso_pai === idRecurso) {
            eDependentes.push({
              dependente: itemDependente.payload.doc.data().recurso_dependente,
              grauDependencia: itemDependente.payload.doc.data().grauDependencia,
              ordem: itemDependente.payload.doc.data().ordem
            });
          }
        }
      }

      saida.push({
        id: item.payload.doc.id,
        nome: item.payload.doc.data().nome,
        episodio_pai: item.payload.doc.data().episodio_pai,
        conceitos: item.payload.doc.data().conceitos,
        jaVericadoDependencia: false,
        ordem: sequencia,
        tempo: item.payload.doc.data().tempo,
        tempoTipo: item.payload.doc.data().tempoTipo,
        dependentes: eDependentes
      });
    });
    return saida;
  }

  setarOrdemMenorQue(idEpisodio, ordem) {
    this.dadosExibir.forEach(item => {
      if (item.id === idEpisodio) {
        item.ordem = ordem;
      }
    });
  }

  setarOrdemMenorQueRecurso(idRecurso, ordem) {
    this.dadosExibirRecursos.forEach(item => {
      if (item.id === idRecurso) {
        item.ordem = ordem;
      }
    });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnChanges() {
    this.carregouItems = false;
    this.dadosExibir = [];
    if (this.dadosEpisodios) {
      this.dadosExibir = this.retornarEpisodiosComDependentes();

      // COLOCAR NÚMEROS DE ORDENAÇÃO
      this.dadosExibir.forEach(item => {
        const ordemItem = item.ordem;
        if (item.dependentes && item.dependentes.length > 0) {
          // COLOCAR NÚMERO PARA CADA ORDEM
          let ultimaOrdem = ordemItem;
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < item.dependentes.length; i++) {
            const itemDependente = item.dependentes[i];
            ultimaOrdem = ultimaOrdem - 1;
            this.setarOrdemMenorQue(itemDependente.dependente, ultimaOrdem);
          }
        }
        // SETAR RECURSOS PARA EPISODIOS
        if (this.dadosRecursos && this.dadosRecursos.length > 0) {
          this.dadosExibirRecursos = this.retornarRecursosComDependentes();
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.dadosExibirRecursos.length; i++) {
            const itemRecurso = this.dadosExibirRecursos[i];

            const ordemItemRecurso = itemRecurso.ordem;
            if (itemRecurso.dependentes && itemRecurso.dependentes.length > 0) {
              // COLOCAR NÚMERO PARA CADA ORDEM
              let ultimaOrdemRecurso = ordemItemRecurso;
              // tslint:disable-next-line:prefer-for-of
              for (let irecurso = 0; irecurso < itemRecurso.dependentes.length; irecurso++) {
                const itemDependenteRecurso = itemRecurso.dependentes[irecurso];
                ultimaOrdemRecurso = ultimaOrdemRecurso - 1;
                this.setarOrdemMenorQueRecurso(itemDependenteRecurso.dependente, ultimaOrdemRecurso);
              }
            }

            if (itemRecurso.episodio_pai === item.id) {
              if (!item.recursos) {
                item.recursos = [];
              }
              const arrayAvaliacoes = [];
              if (this.dadosAvaliacoesRecurso && this.dadosAvaliacoesRecurso.length > 0) {
                // tslint:disable-next-line:prefer-for-of
                for (let j = 0; j < this.dadosAvaliacoesRecurso.length; j++) {
                  const itemAvaliacao = this.dadosAvaliacoesRecurso[j];
                  if (itemAvaliacao.payload.doc.data().recurso_pai === itemRecurso.id) {
                    arrayAvaliacoes.push({
                      id: itemAvaliacao.payload.doc.id,
                      nome: itemAvaliacao.payload.doc.data().nome,
                      conceitos: itemAvaliacao.payload.doc.data().conceitos ? itemAvaliacao.payload.doc.data().conceitos : [],
                      ordem: itemAvaliacao.payload.doc.data().ordem,
                      tempo: itemAvaliacao.payload.doc.data().tempo,
                      tempoTipo: itemAvaliacao.payload.doc.data().tempoTipo
                    });
                  }
                }
              }

              item.recursos.push({
                id: itemRecurso.id,
                nome: itemRecurso.nome,
                conceitos: itemRecurso.conceitos ? itemRecurso.conceitos : [],
                ordem: itemRecurso.ordem,
                tempo: itemRecurso.tempo,
                tempoTipo: itemRecurso.tempoTipo,
                avaliacoes: arrayAvaliacoes
              });
            }
          }
        }

        // SETAR AVALIAÇÕES PARA EPISODIOS
        if (this.dadosAvaliacoes && this.dadosAvaliacoes.length > 0) {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.dadosAvaliacoes.length; i++) {
            const itemAvaliacao = this.dadosAvaliacoes[i];
            if (itemAvaliacao.payload.doc.data().episodio_pai === item.id) {
              if (!item.avaliacoes) {
                item.avaliacoes = [];
              }
              item.avaliacoes.push({
                id: itemAvaliacao.payload.doc.id,
                nome: itemAvaliacao.payload.doc.data().nome,
                conceitos: itemAvaliacao.payload.doc.data().conceitos ? itemAvaliacao.payload.doc.data().conceitos : [],
                ordem: itemAvaliacao.payload.doc.data().ordem,
                tempo: itemAvaliacao.payload.doc.data().tempo,
                tempoTipo: itemAvaliacao.payload.doc.data().tempoTipo
              });
            }
          }
        }
      });

      // REORDENAR ARRAY DE ACORDO COM ORDEM DEFINIDA
      // tslint:disable-next-line:only-arrow-functions
      this.dadosExibir.sort((a, b) => a.ordem - b.ordem);
      this.dadosExibir.forEach(item => {
        if (item.recursos) {
          item.recursos.sort((a, b) => a.ordem - b.ordem);
        }
      });

      this.gerarBlocks();
    }
  }

  gerarBlocks() {
    this.customBlocks = [];
    this.customBlocksRecursos = [];
    this.geralCustomBlocks = [];
    this.customBlocksDependencias = [];
    this.customBlocksAvaliacoes = [];
    this.dadosExibir.forEach((item, i) => {
      this.customBlocks.push(new EpisodioBlock('episodio' + item.id, null, null, i, item.nome, item.id));
      this.geralCustomBlocks.push(new EpisodioBlock('episodio' + item.id, null, null, i, item.nome, item.id));
      if (item.recursos) {
        for (let iRecurso = 0; iRecurso < item.recursos.length; iRecurso++) {
          const itemRecurso = item.recursos[iRecurso];
          this.geralCustomBlocks.push(new RecursoRecolhidoBlock('recurso' + itemRecurso.id, null, null,
            iRecurso, itemRecurso.nome, itemRecurso.id));
          this.customBlocksRecursos.push(new RecursoRecolhidoBlock('recurso' + itemRecurso.id, null, null,
            iRecurso, itemRecurso.nome, itemRecurso.id));
        }
      }
      if (item.dependentes) {
        for (let iDependente = 0; iDependente < item.dependentes.length; iDependente++) {
          const itemAvaliacao = item.dependentes[iDependente];
          this.geralCustomBlocks.push(new DependenciaBlock('dependencia' + itemAvaliacao.dependente, null, null,
            iDependente, itemAvaliacao.nomeEpisodioDependente, itemAvaliacao.dependente));
          this.customBlocksDependencias.push(new DependenciaBlock('dependencia' + itemAvaliacao.dependente, null, null,
            iDependente, itemAvaliacao.nomeEpisodioDependente, itemAvaliacao.dependente));
        }
      }
      if (item.avaliacoes) {
        for (let iAvaliacao = 0; iAvaliacao < item.avaliacoes.length; iAvaliacao++) {
          const itemAvaliacao = item.avaliacoes[iAvaliacao];
          this.geralCustomBlocks.push(new AvaliacaoRecolhidoBlock('avaliacao' + itemAvaliacao.id, null, null,
            iAvaliacao, itemAvaliacao.nome, itemAvaliacao.id));
          this.customBlocksRecursos.push(new AvaliacaoRecolhidoBlock('avaliacao' + itemAvaliacao.id, null, null,
            iAvaliacao, itemAvaliacao.nome, itemAvaliacao.id));
        }
      }
    });
    this.carregandoBlocos = true;

    this.delay(3000).then(any => {
      this.config.toolbox = this.ngxToolboxBuilder.build();
      this.carregouItems = true;
      let xml = `
      <xml xmlns="https://developers.google.com/blockly/xml">
    `;
      let posicaoY = 40;
      let posicaoX = 60;
      this.dadosExibir.forEach((item, i) => {
        xml = xml + `
            <block type="episodio${item.id}" id="${item.id}" x="${posicaoX}" y="${posicaoY}">
            <statement name="ep_recurso_area">
            xxxrecursosxxx
            </statement>
            <statement name="ep_dependencia_area">
            xxxdependenciasxxx
            </statement>
            <statement name="ep_avaliacao_area">
            xxxavaliacoesxxx
            </statement>
            </block>
        `;
        posicaoX = posicaoX + 480;
        if ((i + 1) % 2 === 0) {
          posicaoX = 60;
          posicaoY = posicaoY + 300;
        }
        // fazer recursos
        let stringRecursos = '';
        if (item.recursos) {
          item.recursos.forEach((itemRecursos, iRecurso) => {
            if (iRecurso === 0) {
              stringRecursos = stringRecursos + `
                <block type="recurso${itemRecursos.id}" id="${itemRecursos.id}">
                    <field name="tempo_numero">1</field>
                    <field name="tempo">dia</field>
                    <next>
                    xxxProximoRecursoxxx
                    </next>
                    </block>
                `;
            } else {
              stringRecursos = stringRecursos.replace('xxxProximoRecursoxxx', `
                <block type="recurso${itemRecursos.id}" id="${itemRecursos.id}">
                    <field name="tempo_numero">1</field>
                    <field name="tempo">dia</field>
                    <next>
                    xxxProximoRecursoxxx
                    </next>
                    </block>
                `);
            }
          });
        }
        // fazer dependentes
        let stringDependentes = '';
        if (item.dependentes) {
          item.dependentes.forEach((itemDependnete, iDependnete) => {
            if (iDependnete === 0) {
              stringDependentes = stringDependentes + `
                <block type="dependencia${itemDependnete.dependente}" id="${itemDependnete.dependente}">
                    <field name="tipo">2</field>
                    <next>
                    xxxProximoDependentexxx
                    </next>
                    </block>
                `;
            } else {
              stringDependentes = stringDependentes.replace('xxxProximoDependentexxx', `
                <block type="dependencia${itemDependnete.dependente}" id="${itemDependnete.dependente}">
                   <field name="tipo">2</field>
                    <next>
                    xxxProximoDependentexxx
                    </next>
                    </block>
                `);
            }
          });
        }
        // fazer avaliacoes
        let stringAvaliacoes = '';
        if (item.avaliacoes) {
          item.avaliacoes.forEach((itemAvaliacao, iAvaliacao) => {
            if (iAvaliacao === 0) {
              stringAvaliacoes = stringAvaliacoes + `
                <block type="avaliacao${itemAvaliacao.id}" id="${itemAvaliacao.id}">
                    <field name="tempo_numero">1</field>
                    <field name="tempo">dia</field>
                    <next>
                    xxxProximoAvaliacaoxxx
                    </next>
                    </block>
                `;
            } else {
              stringAvaliacoes = stringAvaliacoes.replace('xxxProximoAvaliacaoxxx', `
                <block type="avaliacao${itemAvaliacao.id}" id="${itemAvaliacao.id}">
                    <field name="tempo_numero">1</field>
                    <field name="tempo">dia</field>
                    <next>
                    xxxProximoAvaliacaoxxx
                    </next>
                    </block>
                `);
            }
          });
        }
        xml = xml.replace('xxxrecursosxxx', stringRecursos);
        xml = xml.replace('xxxdependenciasxxx', stringDependentes);
        xml = xml.replace('xxxavaliacoesxxx', stringAvaliacoes);
      });
      xml = xml + '</xml>';

      this.workspace.fromXml(xml);
      this.carregandoBlocos = false;
      this.jaGerouBlocos = true;
    });
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log('.'));
  }

  printXml() {
    console.log(this.workspace.toXml());
    console.log(this.geralCustomBlocks);
  }

  onChange(changeEvent: any) {
    // console.log(changeEvent);
  }

  gerarDocPlano() {
    let documento = new jsPDF('p', 'pt', 'letter');
    /*  documento.setFontStyle('bold');
      documento.setFontSize(20);
      documento.text('PLANO DE ENSINO', 65, 15);
      documento.setFontSize(12);
      documento.setFontStyle('normal');
      documento.setTextColor(0, 0, 0);
      documento.text(this.dadosDisciplina.ementa.toString(), 42, 25);
      documento.text(this.dadosDisciplina.objetivos.toString(), 42, 33);*/
    if (!this.dadosDisciplina.objetivos) {
      this.dadosDisciplina.objetivos = '-';
    }
    if (!this.dadosDisciplina.ementa) {
      this.dadosDisciplina.ementa = '-';
    }
    let conteudo = `
     <div align="middle" style="margin-left: 20px">
         <h1 >Plano de Ensino</h1>
         <div style="background: #767478">
         <b>EMENTA:</b>
         </div>
        <br>
            ${this.dadosDisciplina.ementa}
         <hr>
         <br>
          <b>OBJETIVOS: </b>
          <hr>
          <p style="width: 200px">
            ${this.dadosDisciplina.objetivos}
            </p>
         <hr>
         <br>
         <b>
         CONTEÚDO PROGRAMÁTICO
         </b>
         <hr>
         -conteudo-
     </div>
    `;
    let lista = '';
    let sequencia = 1;
    this.dadosExibir.forEach(item => {
      lista = lista + `
        <b>${sequencia}: ${item.nome} </b><br>
        <div>
           -conteudo${item.id}-
        </div>
      `;
      sequencia = sequencia + 1;
    });
    conteudo = conteudo.replace('-conteudo-', lista);
    lista = '';
    // tslint:disable-next-line:prefer-for-of
    for (let idados = 0; idados < this.dadosExibir.length; idados++) {
      const item = this.dadosExibir[idados];
      lista = '';
      if (item.recursos) {
        // tslint:disable-next-line:prefer-for-of
        for (let iRecurso = 0; iRecurso < item.recursos.length; iRecurso++) {
          const itemRecurso = item.recursos[iRecurso];
          // tslint:disable-next-line:max-line-length
          const conceitos = itemRecurso.conceitos && itemRecurso.conceitos.length > 0 ? ' (Conceitos: ' + itemRecurso.conceitos + ')' : '';
          lista = lista + `
         ${itemRecurso.nome} ${conceitos}
         <hr>
         -avaliacoes${itemRecurso.id}-
         <hr>
      `;
        }
        lista = lista + '-avaliacoesEpisodio' + item.id + '-';
        conteudo = conteudo.replace('-conteudo' + item.id + '-', lista + '');
      } else {
        conteudo = conteudo.replace('-conteudo' + item.id + '-', '-avaliacoesEpisodio' + item.id + '-');
      }

      lista = '';
      if (item.avaliacoes) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < item.avaliacoes.length; i++) {
          const itemAvaliacao = item.avaliacoes[i];
          lista = lista + `
         ${itemAvaliacao.nome}
         <hr>
      `;
        }
        conteudo = conteudo.replace('-avaliacoesEpisodio' + item.id + '-', lista + '');
      } else {
        conteudo = conteudo.replace('-avaliacoesEpisodio' + item.id + '-', '');
      }
    }

    // tslint:disable-next-line:prefer-for-of
    for (let idados = 0; idados < this.dadosExibir.length; idados++) {
      const item = this.dadosExibir[idados];
      lista = '';
      if (item.recursos) {
        // tslint:disable-next-line:prefer-for-of
        for (let iRecurso = 0; iRecurso < item.recursos.length; iRecurso++) {
          const itemRecurso = item.recursos[iRecurso];
          if (itemRecurso.avaliacoes) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < itemRecurso.avaliacoes.length; i++) {
              const itemAvaliacao = itemRecurso.avaliacoes[i];
              lista = lista + `
         ${itemAvaliacao.nome}
         <hr>
      `;
            }
            conteudo = conteudo.replace('-avaliacoes' + itemRecurso.id + '-', lista + '');
          } else {
            conteudo = conteudo.replace('-avaliacoes' + itemRecurso.id + '-', '');
          }
        }
      }
    }
    const margins = {
      top: 10,
      bottom: 60,
      left: 40,
      width: 522
    };

    documento.fromHTML(conteudo, margins.left // x coord
      , margins.top // y coord
      , {
        'width': margins.width // max width of content on PDF
      });
    documento.save('plano_ensino.pdf');
  }

  abrirEditarDescricao() {
    this.editandoDescricao = true;
  }

  fecharEditarDescricao() {
    this.editandoDescricao = false;
  }

  salvarEditarDescricao() {
    this.fecharEditarDescricao();
    this.firestore.collection('prof_disciplinas').doc(this.idDisciplina).set(
      {descricao: this.dadosDisciplina.descricao}, {merge: true}
    ).then(res => {
      this.alertService.showSuccess('Salvo com sucesso!');
    }).catch(erro => {
      this.alertService.showErro('Ocorreu um problema ao salvar o tipo: ' + erro);
    });
  }

  abrirEditarEmenta() {
    this.editandoEmenta = true;
  }

  fecharEditarEmenta() {
    this.editandoEmenta = false;
  }

  salvarEditarEmenta() {
    this.fecharEditarEmenta();
    this.firestore.collection('prof_disciplinas').doc(this.idDisciplina).set(
      {ementa: this.dadosDisciplina.ementa}, {merge: true}
    ).then(res => {
      this.alertService.showSuccess('Salvo com sucesso!');
    }).catch(erro => {
      this.alertService.showErro('Ocorreu um problema ao salvar o tipo: ' + erro);
    });
  }

  abrirEditarObjetivos() {
    this.editandoObjetivos = true;
  }

  fecharEditarObjetivos() {
    this.editandoObjetivos = false;
  }

  salvarEditarObjetivos() {
    this.fecharEditarObjetivos();
    this.firestore.collection('prof_disciplinas').doc(this.idDisciplina).set(
      {objetivos: this.dadosDisciplina.objetivos}, {merge: true}
    ).then(res => {
      this.alertService.showSuccess('Salvo com sucesso!');
    }).catch(erro => {
      this.alertService.showErro('Ocorreu um problema ao salvar o tipo: ' + erro);
    });
  }
}
