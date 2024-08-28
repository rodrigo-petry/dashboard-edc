export interface PagingData {
  page: number;
  pageSize: number;
  field: string;
  sortDirection: number;
  resultCount: number;
  pageCount: number;
  isFirstPage: true;
  isLastPage: true;
}

export interface PagedResult<T> {
  pagingData: PagingData;
  results: T[];
}

export interface DataDePeriodo {
  inicio: string;
  fim: string;
}
export interface FaixaDeMedicao {
  id: string;
  nome: string;
  ligado:boolean;
  status:string;
  watts_mensal:number;
  watts_semanal: number;
  semanal_periodo: DataDePeriodo;
  mensal_periodo: DataDePeriodo;
  meta_mensal: number;
  meta_semanal: number;
}