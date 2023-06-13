export class PaginationResult<T> {
    currentPage: number;
    result: T[];
    totalItems: number;
    totalPages: number;

    constructor(result: T[], currentPage: number, totalItems: number, totalPages: number) {
        this.result = result;
        this.currentPage = currentPage;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
    }
}