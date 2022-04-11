import { BigNumber } from "ethers";
import { addressToPaymentToken } from "../utils/token_conversion";
import { T_OpenSeaSale } from "./graphQL_entities_def";

export type CryptoRepartition = {
    toArtist: BigNumber,
    toAdditional: BigNumber | 0
};

export type PaymentTokenVolume = {
    total: BigNumber,
    // V1 and V2 volumes
    [osVersion: string]: BigNumber
}

export class ProjectReport {
    #projectId: number;
    #name: string;
    #artistAddress: string;
    #additionalPayeeAddress: string | null;
    #additionalPayeePercentage: number | null;

    #totalSales: number;

    // Token to volumes for the project
    #paymentTokenVolumes: Map<string, PaymentTokenVolume>;

    // Token to amount split between main artist and additional payee
    #cryptoDue: Map<string, CryptoRepartition>;

    constructor(
        projectId: number,
        name: string,
        artistAddress: string,
        additionalPayeeAddress: string | null,
        additionalPayeePercentage: number | null,
    ) {

        this.#projectId = projectId;
        this.#name = name;
        this.#artistAddress = artistAddress;
        this.#additionalPayeeAddress = additionalPayeeAddress;
        this.#additionalPayeePercentage = additionalPayeePercentage;

        this.#totalSales = 0;
        this.#paymentTokenVolumes = new Map<string, PaymentTokenVolume>();
        this.#cryptoDue = new Map();
    }

    addSale(openSeaSale: T_OpenSeaSale, nbTokensSold: number) {
        this.#totalSales += 1;

        // The price is divided between the number of tokens in the sale
        // TODO!: The subgraph only register AB tokens in for Bundle. If the bundle contains other NFTs
        //!       the price will not be split correctly (i.e only split in 2 whereas there are 5
        //!       NFTs sold in the bundle)
        //!       But this edges case is extremely rare
        //!       (This is noted as an assumption in readme)
        const priceAttributedToProject = BigNumber.from(openSeaSale.price).div(nbTokensSold);
        const paymentToken = openSeaSale.paymentToken;

        // Convert the payment token to human readable name 
        const cryptoName = addressToPaymentToken(paymentToken);

        let volume = this.#paymentTokenVolumes.get(cryptoName);
        if (volume === undefined) {
            volume = {
                total: BigNumber.from(0),
                "V1": BigNumber.from(0),
                "V2": BigNumber.from(0),
            };
        }

        volume.total = volume.total.add(priceAttributedToProject);
        volume[openSeaSale.saleVersion] = volume[openSeaSale.saleVersion].add(priceAttributedToProject);

        this.#paymentTokenVolumes.set(cryptoName, volume);
    }

    public get projectId(): number {
        return this.#projectId;
    }

    public get name(): string {
        return this.#name;
    }

    public get artistAddress(): string {
        return this.#artistAddress;
    }

    public get additionalPayeeAddress(): string | null {
        return this.#additionalPayeeAddress;
    }

    public get totalSales(): number {
        return this.#totalSales;
    }

    public get paymentTokenVolumes(): Map<string, PaymentTokenVolume> {
        return this.#paymentTokenVolumes;
    }

    public get cryptoDue(): Map<string, CryptoRepartition> {
        return this.#cryptoDue;
    }

    public computeCryptoDue(): void {
        const percent = 5; // 5% is due

        for (const crypto of this.#paymentTokenVolumes.keys()) {
            const volume = this.#paymentTokenVolumes.get(crypto)!;
            const globalDue = volume.total.mul(percent).div(100);

            const toAdditionalPayee = this.#additionalPayeePercentage !== null ? globalDue.mul(this.#additionalPayeePercentage).div(100) : 0;
            const dueToArtist = globalDue.sub(toAdditionalPayee);

            this.#cryptoDue.set(crypto, {
                toArtist: dueToArtist,
                toAdditional: toAdditionalPayee
            });
        }
    }
}