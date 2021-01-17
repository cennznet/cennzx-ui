import {UserBalanceNotEnough, UserBalanceNotEnoughForFee} from '../../../error/error';
import {IAssetBalance} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {getAsset} from '../../../util/assets';
import {SendProps, FormSection} from '../send';
import {existErrors, FormErrors, mergeError} from './index';

function checkUserBalance(props: SendProps, errors: FormErrors): void {
    const {
        form: {fromAssetAmount, fromAsset},
        fromAssetBalance,
    } = props;
    //skip when any error exists on fromAssetInput
    if (existErrors(() => true, errors, FormSection.fromAssetInput)) return;
    if (fromAssetAmount && fromAssetBalance && fromAssetAmount.gt(fromAssetBalance)) {
        mergeError(
            FormSection.fromAssetInput,
            new UserBalanceNotEnough(getAsset(fromAsset), fromAssetAmount, fromAssetBalance),
            errors
        );
    }
}

function checkUserBalanceForFee(props: SendProps, errors: FormErrors): string {
    const {
        form: {fromAssetAmount, fromAsset, feeAssetId, signingAccount},
        txFee,
        coreAsset,
        userAssetBalance,
    } = props;
    if (!fromAssetAmount || !fromAsset || !txFee) return;
    const feeAmount = coreAsset.eqn(feeAssetId) ? txFee.feeInCpay : txFee.feeInFeeAsset;
    let balRequired = feeAmount;

    if (fromAsset === feeAssetId && balRequired) {
        balRequired = new Amount(balRequired.add(fromAssetAmount));
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
