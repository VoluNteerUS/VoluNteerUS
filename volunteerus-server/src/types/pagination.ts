export class PaginationResult<T> {
    result: T[];
    totalItems: number;
    totalPages: number;

    constructor(result: T[], totalItems: number, totalPages: number) {
        this.result = result;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
    }
}