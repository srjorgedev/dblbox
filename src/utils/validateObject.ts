export function validateObject(obj: unknown, objectName: string): { valid: boolean; status?: number; error?: { error: string; message: string } } {
    if (!obj || typeof obj !== "object") {
        return {
            valid: false,
            status: 400,
            error: {
                error: "bad_request",
                message: `The "${objectName}" object is missing or invalid`,
            },
        };
    }
    return { valid: true };
}