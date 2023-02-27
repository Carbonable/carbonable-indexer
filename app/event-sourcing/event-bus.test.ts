import { EventBus } from "./event-bus";
import { CustomerDepositedTokenEvent } from "./events/customer-deposited-token";
import { WhenCustomerDepositToken } from "./subscribers/customer-deposited-token";
import { WhenCustomerClaimedYield } from "./subscribers/customer-claimed-yield";
import { TransactionManager } from "./transaction-manager";

const whenCustomerDepositTokenMock = jest.spyOn(WhenCustomerDepositToken.prototype, 'handleEvent');
const whenCustomerClaimedTokenMock = jest.spyOn(WhenCustomerClaimedYield.prototype, 'handleEvent');

describe("EventBus", () => {
    let eventBus: EventBus;

    beforeEach(() => {
        eventBus = new EventBus({ transactionManager: new InMemoryTransactionManager() });
    });

    test("It can dispatch events", () => {
        eventBus.recordThat(new CustomerDepositedTokenEvent({ address: '0xtestAddress', tokenId: 255, time: 1673957596000 }));

        expect(eventBus.getRecordedEvents().length).toBe(1);
    });

    test("It can subscribe listeners to events", () => {
        eventBus.subscribe(new WhenCustomerDepositToken());

        expect(Object.keys(eventBus.getSubscribers()).length).toBe(1);
    });

    test("It can call subscribers functions", () => {
        let customerDepositedTokenMock = new WhenCustomerDepositToken();
        eventBus.subscribe(customerDepositedTokenMock);
        expect(Object.keys(eventBus.getSubscribers()).length).toBe(1);

        eventBus.recordThat(new CustomerDepositedTokenEvent({ address: '0xtestAddress', tokenId: 255, time: 1673957596000 }));
        eventBus.dispatch();

        expect(whenCustomerDepositTokenMock).toHaveBeenCalled();
    });

    test("It only call subscribers to recorededEvents", () => {
        eventBus.subscribe(new WhenCustomerDepositToken());
        eventBus.subscribe(new WhenCustomerClaimedYield());

        eventBus.recordThat(new CustomerDepositedTokenEvent({ address: '0xtestAddress', tokenId: 255, time: 1673957596000 }));
        eventBus.dispatch();

        expect(whenCustomerDepositTokenMock).toHaveBeenCalled();
        expect(whenCustomerClaimedTokenMock).not.toHaveBeenCalled();
    });
});

class InMemoryTransactionManager implements TransactionManager {
    async wrapInTransaction(transactions: (tx: any) => Promise<void>): Promise<void> {
        try {
            await transactions(jest.fn);
        } catch (err) {
        }
    }
}
