import {AmountParams} from '../typings';
import {Amount, AmountUnit} from '../util/Amount';

const MAX_DECIMALS = 18;

const removeTrailingZero = (valueIn: string, removeDecimal: boolean) => {
    let value = valueIn;
    if (value.indexOf('.') === -1) {
        return value;
    }
    while (value.charAt(value.length - 1) === '0') {
        value = value.substring(0, value.length - 1);
        // remove all zeros
    }
    if (removeDecimal) {
        // remove dot at end if there is one
        if (value.charAt(value.length - 1) === '.') {
            value = value.substring(0, value.length - 1);
        }
    }
    return value;
};

const getAmountParams = (amount: Amount, assetId: number, amountChange: boolean): AmountParams => ({
    amount,
    assetId,
    amountChange,
});

const updateAmount = (value: string): Amount => {
    return value !== '' ? new Amount(value.toString(), AmountUnit.DISPLAY) : null;
};

export const setNewAmount = (valueIn: any, oldAmount: Amount, assetId: number) => {
    let value = valueIn;

    // disallow spaces
    if (value.indexOf(' ') !== -1) {
        return;
    }

    // make . become 0. as this is a number and . is not
    if (value === '.') {
        value = '0.';
    }

    const firstDot = value.indexOf('.');
    const lastDot = value.lastIndexOf('.');
    // dont allow more then one  dot
    if (lastDot !== -1 && firstDot !== lastDot) {
        return;
    }

    if (value.toUpperCase() === 'E') {
        return;
    }

    // only allow numbers
    if (isNaN(value)) {
        return;
    }

    // only allow a certain number of decimal places
    if (firstDot !== -1) {
        const decimalPlaces = value.substring(firstDot + 1).length;
        if (decimalPlaces > MAX_DECIMALS) {
            return;
        }
    }
    const newAmount = removeTrailingZero(value, true);
    if (!oldAmount || !oldAmount.eq(new Amount(newAmount, AmountUnit.DISPLAY))) {
        return getAmountParams(updateAmount(newAmount), assetId, true);
    }
};
