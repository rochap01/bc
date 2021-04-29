export interface RecursoDependente {
  id?: string;
  nomeRecursoDependente?: string;
  ordem?: number;
  grauDependencia?: number,
  recurso_dependente?: string;
  recurso_pai?: string;
  excluido?: boolean;
  idEpisodio?: string;
  descricao?: string;
  disciplina_id?: string;
}
