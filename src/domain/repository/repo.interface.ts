import type { ResultSet } from "@libsql/client";

export default interface IRepository<T> {
    readAll(): Promise<ResultSet>;
    create?(item: T): Promise<ResultSet>;
}

export interface ILonely {
    create(): Promise<ResultSet>;
}