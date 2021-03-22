import {
    FieldNotReady,
    FieldNotReadyForLiquidity,
    FromAssetAmountRequired,
    FromAssetNotSelected,
} from '../../../error/error';
import {FormSection, LiquidityProps} from '../liquidity';
import {existErrors, FormErrors, mergeError} from './index';

function checkFromAssetAmount(props: LiquidityProps, errors: FormErrors): void {
    const {
        form: {assetAmount, coreAmount},
    } = props;
    if (existErrors(['PoolBalanceNotEnough', 'FromAssetNotSelected'], errors)) {
        return;
    }

    if (!coreAmount) {
        if (assetAmount) {
            mergeError(FormSection.assetAmount, new FieldNotReadyForLiquidity(FormSection.coreAmount), errors);
        } else {
            mergeError(FormSection.assetAmount, new FromAssetAmountRequired(), errors);
        }
    }
}

function checkFromAssetDropdown(props: LiquidityProps, errors: FormErrors): void {
    const {
        form: {coreAmount},
    } = props;
    if (!coreAmount) {
        mergeError(FormSection.coreAmount, new FromAssetNotSelected(), errors);
    }
}

/**
 * priorities: checkFromAssetDropdown > checkFromAssetAmount
 */
export default [checkFromAssetDropdown, checkFromAssetAmount];
