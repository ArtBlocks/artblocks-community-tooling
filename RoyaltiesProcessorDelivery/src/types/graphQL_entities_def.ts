type T_Project = {
    id: string,
    name: string,
    artistAddress: string,
    curationStatus: "curated" | "playground" | "factory",
    additionalPayee: string | null,
    additionalPayeePercentage: number | null,
}

type T_Contract = {
    id: string
}

type T_Token = {
    id: string
    contract: T_Contract
    project: T_Project,
}

type T_OpenSeaSaleLookupTable = {
    id: string,
    token: T_Token,
    openSeaSale: T_OpenSeaSale
}

export type T_OpenSeaSale = {
    id: string;
    saleType: "Single" | "Bundle";
    blockNumber: number;
    blockTimestamp: string;
    summarayTokenSold: string;
    seller: string;
    buyer: string;
    paymentToken: string;
    price: string;
    isPrivate: boolean;
    summaryTokensSold: string;
    openSeaSaleLookupTables: T_OpenSeaSaleLookupTable[];
};