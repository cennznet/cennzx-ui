import {FieldNotReady, FromAssetAmountRequired, FromAssetNotSelected} from '../../../error/error';
import {LiquidityProps, FormSection} from '../liquidity';
import {existErrors, FormErrors, mergeError} from './index';

function checkFromAssetAmount(props: LiquidityProps, errors: FormErrors): void {
    const {
        form: {add1Amount, add2Amount},
    } = props;
    if (existErrors(['PoolBalanceNotEnough', 'FromAssetNotSelected'], errors)) {
        return;
    }

    if (!add2Amount) {
        if (add1Amount) {
            mergeError(FormSection.add1Amount, new FieldNotReady(FormSection.add2Amount), errors);
        } else {
            mergeError(FormSection.add1Amount, new FromAssetAmountRequired(), errors);
        }
    }
}

function checkFromAssetDropdown(props: LiquidityProps, errors: FormErrors): void {
    const {
        form: {add2Amount},
    } = props;
    if (!add2Amount) {
        mergeError(FormSection.add2Amount, new FromAssetNotSelected(), errors);
    }
}

/**
 * priorities: checkFromAssetDropdown > checkFromAssetAmount
 */
export default [checkFromAssetDropdown, checkFromAssetAmount];
