import { BigNumber } from "ethers";
import { BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES } from "../constant";
import { addressToPaymentToken, ETH_ADDR, WETH_ADDR } from "../utils/token_conversion";
import { T_OpenSeaSale } from "./graphQL_entities_def";

export type CryptoRepartition = {
    toArtist: BigNumber,
    toAdditional: BigNumber | 0
};

export class ProjectReport {
    #projectId: number;
    #name: string;
    #artistAddress: string;
    #additionalPayeeAddress: string | null;
    #additionalPayeePercentage: number | null;

    #totalSales: number;

    // Token to total volume for the project
    #paymentTokenVolumes: Map<string, BigNumber>;

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
        this.#paymentTokenVolumes = new Map<string, BigNumber>();
        this.#cryptoDue = new Map();
    }

    addSale(paymentToken: string, price: BigNumber) {
        this.#totalSales += 1;

        // Convert the payment token to human readable name 
        const cryptoName = addressToPaymentToken(paymentToken);

        const volume = this.#paymentTokenVolumes.get(cryptoName);
        const newVolume = volume !== undefined ? volume.add(price) : price;

        this.#paymentTokenVolumes.set(cryptoName, newVolume);
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

    public get paymentTokenVolumes(): Map<string, BigNumber> {
        return this.#paymentTokenVolumes;
    }

    public get cryptoDue(): Map<string, CryptoRepartition> {
        return this.#cryptoDue;
    }

    public computeCryptoDue(): void {
        const percent = 5; // 5% is due

        for (const crypto of this.#paymentTokenVolumes.keys()) {
            const volume = this.#paymentTokenVolumes.get(crypto)!;
            const globalDue = volume.mul(percent).div(100);

            const toAdditionalPayee = this.#additionalPayeePercentage !== null ? globalDue.mul(this.#additionalPayeePercentage).div(100) : 0;
            const dueToArtist = globalDue.sub(toAdditionalPayee);

            this.#cryptoDue.set(crypto, {
                toArtist: dueToArtist,
                toAdditional: toAdditionalPayee
            });
        }
    }
}