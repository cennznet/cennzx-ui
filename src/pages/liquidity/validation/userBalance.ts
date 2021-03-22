import {UserBalanceNotEnough, UserBalanceNotEnoughForFee} from '../../../error/error';
import {IAssetBalance} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {getAsset} from '../../../util/assets';
import {FormSection, LiquidityProps} from '../liquidity';
import {existErrors, FormErrors, mergeError} from './index';

function checkUserBalance(props: LiquidityProps, errors: FormErrors): void {
    const {
        form: {assetAmount, assetId},
        accountAssetBalance,
    } = props;
    // skip when any error exists on assetInput
    if (existErrors(() => true, errors, FormSection.assetInput)) return;
    if (assetAmount && accountAssetBalance && assetAmount.gt(accountAssetBalance)) {
        mergeError(
            FormSection.assetInput,
            new UserBalanceNotEnough(getAsset(assetId), assetAmount, accountAssetBalance),
            errors
        );
    }
}

function checkUserBalanceForFee(props: LiquidityProps, errors: FormErrors): string {
    const {
        form: {assetAmount, assetId, feeAssetId, signingAccount},
        txFee,
        coreAssetId,
        userAssetBalance,
    } = props;
    if (!assetAmount || !assetId || !txFee) return;
    const feeAmount = coreAssetId === feeAssetId ? txFee.feeInCpay : txFee.feeInFeeAsset;
    let balRequired = feeAmount;

    if (assetId === feeAssetId && balRequired) {
        balRequired = new Amount(balRequired.add(assetAmount));
    }
    const assetBalance = userAssetBalance.find(
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
