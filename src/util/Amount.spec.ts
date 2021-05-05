import {Amount, AmountUnit} from './Amount';

describe('Amount Class', () => {
    it('instantiate Amount', () => {
        const amount = new Amount(10, AmountUnit.UN);
        expect(amount.toAmount).toBeDefined();
    });
});
