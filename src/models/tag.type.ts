export type TRTag = {
    id: number;
};

export type TSTag = {
    id: number;
    texts: Record<string, string>
}

export type TRTagText = {
    tag: number;
    lang: string;
    content: string;
};