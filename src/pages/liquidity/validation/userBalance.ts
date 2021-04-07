import {UserBalanceNotEnough, UserBalanceNotEnoughForFee, UserPoolBalanceNotEnough} from '../../../error/error';
import {IAssetBalance} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {ADD_LIQUIDITY, REMOVE_LIQUIDITY} from '../../../util/extrinsicUtil';
import {FormSection, LiquidityProps} from '../liquidity';
import {existErrors, FormErrors, mergeError} from './index';

function checkUserBalance(props: LiquidityProps, errors: FormErrors): void {
    const {
        form: {assetAmount, coreAmount, assetId, coreAssetId, extrinsic},
        accountAssetBalance,
        accountCoreBalance,
        userShareInPool,
        assetInfo,
    } = props;
    // skip when any error exists on assetInput
    if (existErrors(() => true, errors, FormSection.assetInput)) return;
    if (extrinsic === ADD_LIQUIDITY) {
        if (assetAmount && accountAssetBalance && assetAmount.gt(accountAssetBalance)) {
            mergeError(
                FormSection.assetInput,
                new UserBalanceNotEnough(assetInfo[assetId], assetAmount, accountAssetBalance),
                errors
            );
        }
        if (coreAmount && accountCoreBalance && coreAmount.gt(accountCoreBalance)) {
            mergeError(
                FormSection.coreInput,
                new UserBalanceNotEnough(assetInfo[coreAssetId], coreAmount, accountCoreBalance),
                errors
            );
        }
    }
    if (
        extrinsic === REMOVE_LIQUIDITY &&
        assetAmount &&
        userShareInPool &&
        assetAmount.gt(userShareInPool.assetBalance)
    ) {
        mergeError(
            FormSection.assetInput,
            new UserPoolBalanceNotEnough(assetInfo[assetId], assetAmount, userShareInPool.assetBalance),
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
        assetInfo,
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
                new UserBalanceNotEnoughForFee(assetInfo[feeAssetId], feeAmount, assetBalance.balance),
                errors
            );
        }
    }
}

export default [checkUserBalance, checkUserBalanceForFee];
