type DataIn = {
    id: number;
    number?: number;
    lang: string;
    name: string;
};

type DataOut = {
    id: number;
    content: Record<string, string>;
};

export function MapData(data: DataIn[]): DataOut[] {
    const map = new Map<string, DataOut>();

    for (const row of data) {
        const id = Number(row.id);
        const num = row.number ?? 0; 
        const key = `${id}-${num}`;
        const lang = String(row.lang);
        const name = String(row.name);

        if (!map.has(key)) {
            map.set(key, { id, content: {} });
        }

        map.get(key)!.content[lang] = name;
    }

    const sorted = Array.from(map.entries()).sort(([a], [b]) => {
        const numA = Number(a.split('-')[1]);
        const numB = Number(b.split('-')[1]);
        return numA - numB;
    });

    return sorted.map(([_, value]) => value);
}
