import prisma from '../models/database/client';
import { TransactionManager } from "./transaction-manager";

export class PrismaTransactionManager implements TransactionManager {
    async wrapInTransaction(transactions: (tx: any) => Promise<void>): Promise<void> {
        try {
            await prisma.$transaction(async (tx) => {
                await transactions(tx);
            });
        } catch (err) {
            console.error(err);
        }
    }
}
