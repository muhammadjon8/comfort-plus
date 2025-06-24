type Pagination = {
  page: number;
  totalPages: number;
  pageSize: number;
};
export type PaginationMetadata = {
  total?: number;
  pagination?: Pagination;
};
