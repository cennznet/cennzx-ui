import {FieldNotReadyForLiquidity, ToAssetAmountRequired, ToAssetNotSelected} from '../../../error/error';
import {FormSection, LiquidityProps} from '../liquidity';
import {existErrors, FormErrors, mergeError} from './index';

function checkCoreAssetAmount(props: LiquidityProps, errors: FormErrors): void {
    if (existErrors(['PoolBalanceNotEnough'], errors)) {
        return;
    }
    const {
        form: {assetAmount, coreAmount},
    } = props;
    if (!assetAmount) {
        if (coreAmount) {
            mergeError(FormSection.assetAmount, new FieldNotReadyForLiquidity(FormSection.coreAmount), errors);
        } else {
            mergeError(FormSection.assetAmount, new ToAssetAmountRequired(), errors);
        }
    }
}

export default [checkCoreAssetAmount];
