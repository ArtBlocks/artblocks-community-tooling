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

export type T_Token = {
  id: string;
  tokenId: number;
  contract: T_Contract;
  project: T_Project;
};

export type T_OpenSeaSaleLookupTable = {
  id: string;
  token: T_Token;
  //openSeaSale: T_OpenSeaSale;
};

export type T_OpenSeaSale = {
  id: string;
  openSeaVersion: "V1" | "V2" | "Vunknown";
  saleType: "Single" | "Bundle";
  blockNumber: number;
  blockTimestamp: string;
  seller: string;
  buyer: string;
  paymentToken: string;
  price: string;
  isPrivate: boolean;
  summaryTokensSold: string;
  openSeaSaleLookupTables: T_OpenSeaSaleLookupTable[];
};

export type T_TokenZero = {
  id: string; // subgraph's Project entity id for this TokenZero
  curationStatus: string;
  tokens: T_Token[];
};