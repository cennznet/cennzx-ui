import {UserBalanceNotEnough, UserBalanceNotEnoughForFee} from '../../../error/error';
import {IAssetBalance} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {getAsset} from '../../../util/assets';
import {LiquidityProps, FormSection} from '../liquidity';
import {existErrors, FormErrors, mergeError} from './index';

function checkUserBalance(props: LiquidityProps, errors: FormErrors): void {
    const {
        form: {assetAmount, asset},
        assetUserBalance,
    } = props;
    //skip when any error exists on assetInput
    if (existErrors(() => true, errors, FormSection.assetInput)) return;
    if (assetAmount && assetUserBalance && assetAmount.gt(assetUserBalance)) {
        mergeError(
            FormSection.assetInput,
            new UserBalanceNotEnough(getAsset(asset), assetAmount, assetUserBalance),
            errors
        );
    }
}

function checkUserBalanceForFee(props: LiquidityProps, errors: FormErrors): string {
    const {
        form: {assetAmount, asset, feeAssetId, signingAccount},
        txFee,
        coreAsset,
        assetUserBalance,
    } = props;
    if (!assetAmount || !asset || !txFee) return;
    const feeAmount = coreAsset.eqn(feeAssetId) ? txFee.feeInCpay : txFee.feeInFeeAsset;
    let balRequired = feeAmount;

    if (asset === feeAssetId && balRequired) {
        balRequired = new Amount(balRequired.add(assetAmount));
    }
    const assetBalance = assetUserBalance.find(
        (assetBal: IAssetBalance) => assetBal.assetId === feeAssetId && assetBal.account === signingAccount
    );

    if (assetBalance) {
        if (!balRequired || assetBalance.balance.lt(balRequired)) {
            mergeError(
                FormSection.form,
                new UserBalanceNotEnoughForFee(getAsset(feeAssetId), feeAmount, assetBalance.balance),
                errors
            );
        }
    }
}

export default [checkUserBalance, checkUserBalanceForFee];
