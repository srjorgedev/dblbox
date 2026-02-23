
export function now() {
    return Math.floor(Date.now() / 1000);
}

export function diffFromNow(timestamp: number): number {
    return now() - timestamp;
}

export function diffDetailed(timestamp: number) {
    const diff = now() - timestamp;

    const abs = Math.abs(diff);

    return {
        seconds: abs,
        minutes: Math.floor(abs / 60),
        hours: Math.floor(abs / 3600),
        days: Math.floor(abs / 86400),
        isFuture: diff < 0
    };
}