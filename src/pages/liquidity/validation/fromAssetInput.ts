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
        form: {coreAssetId, coreAmount},
        assetInfo,
    } = props;
    if (existErrors(['PoolBalanceNotEnough', 'FromAssetNotSelected'], errors)) {
        return;
    }

    if (!coreAmount && assetInfo.length) {
        mergeError(FormSection.coreAmount, new FromAssetAmountRequired(assetInfo[coreAssetId].symbol), errors);
    }
}

/**
 * priorities: checkFromAssetDropdown > checkFromAssetAmount
 */
export default [checkFromAssetAmount];
