import { EventSourcedEvent } from "../event-bus";

type CustomerClaimedYield = {
    address: string,
    tokenId: number,
    time: number,
};

export const CUSTOMER_CLAIMED_YIELD_EVENT = "CustomerClaimedYieldEvent";

export class CustomerClaimedYieldEvent implements EventSourcedEvent<CustomerClaimedYield> {
    name: string;
    recordedAt: Date;
    payload: CustomerClaimedYield;

    constructor({ address, tokenId, time }) {
        this.name = CUSTOMER_CLAIMED_YIELD_EVENT;
        this.recordedAt = new Date();
        this.payload = {
            address, tokenId, time,
        }
    }

    getName(): string {
        return this.name;
    }
}
