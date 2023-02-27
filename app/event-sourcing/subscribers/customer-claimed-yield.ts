import { Projection } from "../event-bus";
import { CUSTOMER_CLAIMED_YIELD_EVENT } from "../events/customer-claimed-yield";

export class WhenCustomerClaimedYield implements Projection {
    async handleEvent<T>(event: T): Promise<void> {
        console.log(event);
    }
    subscribeTo(): string {
        return CUSTOMER_CLAIMED_YIELD_EVENT;
    }
}
