import {UserBalanceNotEnough, UserBalanceNotEnoughForFee} from '../../../error/error';
import {IAssetBalance} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {ExchangeProps, FormSection} from '../exchange';
import {existErrors, FormErrors, mergeError} from './index';

function checkUserBalance(props: ExchangeProps, errors: FormErrors): void {
    const {
        form: {fromAssetAmount, fromAsset},
        fromAssetBalance,
        assetInfo,
    } = props;
    //skip when any error exists on fromAssetInput
    if (existErrors(() => true, errors, FormSection.fromAssetInput)) return;
    if (fromAssetAmount && fromAssetBalance && fromAssetAmount.gt(fromAssetBalance)) {
        mergeError(
            FormSection.fromAssetInput,
            new UserBalanceNotEnough(assetInfo[fromAsset as number], fromAssetAmount),
            errors
        );
    }
}

function checkUserBalanceForFee(props: ExchangeProps, errors: FormErrors): string | undefined {
    const {
        form: {fromAssetAmount, fromAsset, feeAssetId, signingAccount},
        txFee,
        coreAssetId,
        userAssetBalance,
        assetInfo,
    } = props;
    if (!fromAssetAmount || !fromAsset || !txFee) return;
    const feeAmount = coreAssetId === feeAssetId ? txFee.feeInCpay : txFee.feeInFeeAsset;
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
                new UserBalanceNotEnoughForFee(assetInfo[feeAssetId as number], feeAmount, assetBalance.balance),
                errors
            );
        }
    }
}

export default [checkUserBalance, checkUserBalanceForFee];
