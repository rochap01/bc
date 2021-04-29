export interface AvaliacaoRecurso {
  id?: string;
  nome?: string;
  ordem?: number;
  tempo?: number;
  tempoTipo?: string;
  recurso_pai?: string;
  excluido?: boolean;
  tipoConteudo?: string;
  conteudo?: any;
  descricao?: string;
  disciplina_id?: string;
  conceitos?: string[];
}
