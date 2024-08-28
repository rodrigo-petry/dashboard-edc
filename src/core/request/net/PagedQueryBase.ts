export interface PagedQueryBase {
  page?: number;
  pageSize?: number;
  field?: string;
  sortDirection?: 0 | 1;
}
