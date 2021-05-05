import {FieldNotReadyForLiquidity, ToAssetAmountRequired, ToAssetNotSelected} from '../../../error/error';
import {FormSection, LiquidityProps} from '../liquidity';
import {existErrors, FormErrors, mergeError} from './index';

function checkCoreAssetAmount(props: LiquidityProps, errors: FormErrors): void {
    if (existErrors(['PoolBalanceNotEnough', 'UserBalanceNotEnough', 'UserPoolBalanceNotEnough'], errors)) {
        return;
    }
    const {
        form: {assetAmount, assetId},
        assetInfo,
    } = props;
    if (!assetAmount && assetInfo.length && assetId) {
        mergeError(FormSection.assetAmount, new ToAssetAmountRequired(assetInfo[assetId].symbol), errors);
    }
}

export default [checkCoreAssetAmount];
