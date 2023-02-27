import { FieldElement, v1alpha2 as starknet } from '@apibara/starknet';

export function getTimeFromFieldElement(time: starknet.IFieldElement): Date {
    return new Date(Number(FieldElement.toBigInt(time)) * 1000);
}
