export interface TransactionManager {
    wrapInTransaction(transactions: (tx: any) => Promise<void>): Promise<void>;
}
