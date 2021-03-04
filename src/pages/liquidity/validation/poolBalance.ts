import {PoolBalanceNotEnough} from '../../../error/error';
import {getAsset} from '../../../util/assets';
import {LiquidityProps, FormSection} from '../liquidity';
import {FormErrors, mergeError} from './index';

function checkPoolBalance(props: LiquidityProps, errors: FormErrors): void {
    const {
        form: {assetAmount, assetId},
        coreReserve,
    } = props;
    if (assetAmount && coreReserve && assetAmount.gt(coreReserve)) {
        mergeError(
            FormSection.assetInput,
            new PoolBalanceNotEnough(getAsset(assetId), assetAmount, coreReserve),
            errors
        );
    }
}

export default [checkPoolBalance];
