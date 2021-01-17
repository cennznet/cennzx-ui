import {FieldNotReady, ToAssetAmountRequired, ToAssetNotSelected} from '../../../error/error';
import {LiquidityProps, FormSection} from '../liquidity';
import {existErrors, FormErrors, mergeError} from './index';

function checkToAssetAmount(props: LiquidityProps, errors: FormErrors): void {
    if (existErrors(['PoolBalanceNotEnough', 'ToAssetNotSelected'], errors)) {
        return;
    }
    const {
        form: {add1Amount, add2Amount},
    } = props;
    if (!add1Amount) {
        if (add2Amount) {
            mergeError(FormSection.add1Amount, new FieldNotReady(FormSection.add2Amount), errors);
        } else {
            mergeError(FormSection.add1Amount, new ToAssetAmountRequired(), errors);
        }
    }
}

function checkToAssetDropdown(props: LiquidityProps, errors: FormErrors): void {
    const {
        form: {add1Amount},
    } = props;
    if (!add1Amount) {
        mergeError(FormSection.add1Amount, new ToAssetNotSelected(), errors);
    }
}

/**
 * priorities: checkToAssetDropdown > checkToAssetAmount
 */
export default [checkToAssetDropdown, checkToAssetAmount];
