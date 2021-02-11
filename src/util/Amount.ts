import {AnyNumber} from '@cennznet/types/polkadot.types';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';

export enum AmountUnit {
    UN = 'un',
    DISPLAY = 'dp',
}

const DECIMAL: number = 4;

export class Amount extends BN {
    /** Rounds away from zero. */
    static ROUND_UP: number = 0;

    /** Rounds towards zero. */
    static ROUND_DOWN: number = 1;

    constructor(value: AnyNumber, unit: AmountUnit = AmountUnit.UN) {
        if (unit === AmountUnit.UN) {
            super(value.toString ? value.toString() : value);
            // super(isBn(value) ? value.toString() : value);
        } else {
            // TODO: check if value has decimals > 18 and throw
            try {
                const val = new BigNumber(value.toString());
                super(val.multipliedBy(Math.pow(10, DECIMAL)).toString(10));
            } catch (e) {
                console.log(e);
                console.log(`Value::${value}`);
                super(1);
            }
        }
    }

    toAmount(): BigNumber {
        const balBN = new BigNumber(this.toString());
        return balBN.div(Math.pow(10, DECIMAL));
    }

    asString(decimalPlaces?: number, rounding: number = Amount.ROUND_DOWN): string {
        if (decimalPlaces === undefined) {
            //return this.toAmount().toString(10);
            return this.toAmount().toFixed(DECIMAL, rounding as any);
        } else {
            return this.toAmount().toFixed(decimalPlaces, rounding as any);
        }
    }
}
