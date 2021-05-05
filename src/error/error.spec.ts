//import {Error} from 'tslint/lib/error';
import {Amount} from '../util/Amount';
import {BaseError, InsufficientBalanceForOperation, InsufficientFeeForOperation} from './error';

describe('Error Class', () => {
    it('instantiate InsufficientFee for operation error', () => {
        const feeAsset = 'CENNZ';
        const error = new InsufficientBalanceForOperation(new Amount(10), new Amount(12), feeAsset);
        expect(error instanceof InsufficientBalanceForOperation).toBeTruthy();
        expect(error instanceof BaseError).toBeTruthy();
        expect(error instanceof Error).toBeTruthy();
    });
});
