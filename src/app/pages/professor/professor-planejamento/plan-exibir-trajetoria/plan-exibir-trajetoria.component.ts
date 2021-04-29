import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-plan-exibir-trajetoria',
  templateUrl: './plan-exibir-trajetoria.component.html',
  styleUrls: ['./plan-exibir-trajetoria.component.css']
})
export class PlanExibirTrajetoriaComponent implements OnInit {
  @Input() dadosExibir;
  abaAtiva = 0;
  blocosExibirPorEpisodio = [];
  totalBlocos = 0;
  loading = false;
  modoExibicao = 0;

  constructor() {
  }

  ngOnInit() {
    this.abrirAba(0);
  }

  abrirAba(aba) {
    this.abaAtiva = aba;
    if (aba === 0) {
      this.renderizarBlocosPorEpisodio();
    }
  }

  renderizarBlocosPorEpisodio() {
    this.blocosExibirPorEpisodio = [];
    this.loading = true;
    let nivelTemporario = 0;
    let blocosTemporario = [];
    let anterior = [];
    this.totalBlocos = 0;
    this.dadosExibir[this.dadosExibir.length - 1].pontoChegada = true;
    this.dadosExibir.forEach(item => {
      if (this.modoExibicao !== 2) {
        const tNome = item.nome.length < 20 ? item.nome : item.nome.substr(0, 15) + '...';
        blocosTemporario.push({nome: tNome, tipo: 0, nomeCompleto: item.nome});
      }
      if (item && item.recursos && (this.modoExibicao === 1 || this.modoExibicao === 2)) {
        for (let j = 0; j < item.recursos.length; j++) {
          const tNomeRecurso = item.recursos[j].nome.length < 20 ? item.recursos[j].nome :
            item.recursos[j].nome.substr(0, 15) + '...';
          blocosTemporario.push({nome: tNomeRecurso, tipo: 1, nomeCompleto: item.recursos[j].nome});
        }
      }
      this.totalBlocos = this.totalBlocos + 1;
      if (item.pontoChegada) {
        this.blocosExibirPorEpisodio.push({
          nivel: nivelTemporario,
          anteriorTotal: anterior,
          blocos: blocosTemporario,
          recursos: item.recursos
        });
        anterior = [];
        for (let i = 0; i < blocosTemporario.length - 1; i++) {
          anterior.push(i);
        }
        blocosTemporario = [];
        nivelTemporario = nivelTemporario + 1;
      }
    });
    this.loading = false;
  }

  alterarModoExibicao(modo) {
    this.modoExibicao = modo;
    this.renderizarBlocosPorEpisodio();
  }
}
