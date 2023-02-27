import { EventSourcedEvent } from "../event-bus";

type CustomerDepositedToken = {
    address: string,
    tokenId: number,
    time: number,
};

export const CUSTOMER_DEPOSITED_TOKEN_EVENT = "CustomerDepositedToken";

export class CustomerDepositedTokenEvent implements EventSourcedEvent<CustomerDepositedToken> {
    name: string;
    recordedAt: Date;
    payload: CustomerDepositedToken;

    constructor({ address, tokenId, time }) {
        this.name = "CustomerDepositedToken";
        this.recordedAt = new Date();
        this.payload = {
            address, tokenId, time,
        }
    }

    getName(): string {
        return CUSTOMER_DEPOSITED_TOKEN_EVENT;
    }

}
