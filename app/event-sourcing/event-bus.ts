import { EventSubscriber } from "typeorm";
import { TransactionManager } from "./transaction-manager";

export interface EventSourcedEvent<T> {
    name: string,
    recordedAt: Date,
    payload: T,

    getName(): string;
};

// Domain event subscriber
export interface EventSubscriber {
    handleEvent<T>(event: T, tx?: any): Promise<void>;
    subscribeTo(): string;
}

// Project data
export interface Projection extends EventSubscriber { }

export class EventBus {
    transactionManager: TransactionManager;

    eventList = [];
    subscribers = {};


    constructor({ transactionManager }: { transactionManager: TransactionManager }) {
        this.transactionManager = transactionManager;
    }

    public recordThat<T>(event: EventSourcedEvent<T>): void {
        this.eventList = [...this.eventList, event];
    }

    public subscribe(eventSubscriber: EventSubscriber): void {
        let eventName = eventSubscriber.subscribeTo();
        if (this.subscribers.hasOwnProperty(eventSubscriber.subscribeTo())) {
            this.subscribers = {
                [eventName]: [...this.subscribers[eventName], eventSubscriber],
            }
            return;
        }

        this.subscribers = { ...this.subscribers, [eventName]: [eventSubscriber] };
    }

    public async dispatch(): Promise<void> {
        // This is a blockchain based event-bus.
        // No need to handle business domain events.
        // The only requirements there is to project data reflecting our business needs.
        this.eventList.forEach(async domainEvent => {
            let subscribers = this.subscribers[domainEvent.getName()];
            this.transactionManager.wrapInTransaction(async (tx: any) => {
                subscribers.forEach(async (subscriber: EventSubscriber) => {
                    try {
                        await subscriber.handleEvent(domainEvent, tx);
                    } catch (err) { }
                });
            });
        });
    }

    public getRecordedEvents() {
        return this.eventList;
    }

    public getSubscribers() {
        return this.subscribers;
    }
}
