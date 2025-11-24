export class PagedResultDto<T> {
  items: T[] = [];
  totalCount: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;

  constructor(init?: Partial<PagedResultDto<T>>) {
    Object.assign(this, init);
  }
}