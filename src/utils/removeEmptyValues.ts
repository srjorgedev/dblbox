// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeEmptyValues<T extends Record<string, any>>(obj: T): Partial<T> {
    const result: Partial<T> = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];

            if (value !== null && value !== "") {
                result[key as keyof T] = value;
            }
        }
    }

    return result;
}