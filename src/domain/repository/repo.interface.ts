import type { ResultSet } from "@libsql/client";

export default interface IRepository<T> {
    getAll(): Promise<ResultSet>;
    create(item: T): Promise<ResultSet>;
}