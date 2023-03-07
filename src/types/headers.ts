interface headers {
    endpoint: string
    ip: string;
    event: string;
    resource: string;
    id: string;
    topic: string;
    signature: string;
    source: string;
};
export type Headers = Partial<headers>;