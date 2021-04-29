export interface EpisodioDependente {
  id?: string;
  nomeEpisodioDependente?: string;
  ordem?: number;
  grauDependencia?: number,
  episodio_dependente?: string;
  episodio_pai?: string;
  excluido?: boolean;
  descricao?: string;
  disciplina_id?: string;
}
