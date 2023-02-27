import { Projection } from "../event-bus";
import { CUSTOMER_DEPOSITED_TOKEN_EVENT } from "../events/customer-deposited-token";

export class WhenCustomerDepositToken implements Projection {
    async handleEvent<T>(event: T): Promise<void> {
        console.log(event);
    }
    subscribeTo(): string {
        return CUSTOMER_DEPOSITED_TOKEN_EVENT;
    }
}
