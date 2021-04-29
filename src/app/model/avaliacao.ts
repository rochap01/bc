export interface Avaliacao {
  id?: string;
  nome?: string;
  ordem?: number;
  tempo?: number;
  tempoTipo?: string;
  episodio_pai?: string;
  excluido?: boolean;
  tipoConteudo?: string;
  conteudo?: any;
  descricao?: string;
  disciplina_id?: string;
}
