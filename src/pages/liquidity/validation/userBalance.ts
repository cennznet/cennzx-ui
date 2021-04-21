import {UserBalanceNotEnough, UserBalanceNotEnoughForFee, UserPoolBalanceNotEnough} from '../../../error/error';
import {AssetDetails} from '../../../redux/reducers/global.reducer';
import {IAssetBalance, IUserShareInPool} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {ADD_LIQUIDITY, REMOVE_LIQUIDITY} from '../../../util/extrinsicUtil';
import {FormSection, LiquidityProps} from '../liquidity';
import {existErrors, FormErrors, mergeError} from './index';

function getErrorForUserBalance(
    assetAmount: Amount,
    accountAssetBalance: Amount,
    assetInfo: AssetDetails[],
    assetId: number
) {
    if (assetAmount && accountAssetBalance && assetAmount.gt(accountAssetBalance)) {
        return new UserBalanceNotEnough(assetInfo[assetId], assetAmount);
    } else if (accountAssetBalance && accountAssetBalance.isZero()) {
        return new UserBalanceNotEnough(assetInfo[assetId], null);
    }
    return null;
}

function getErrorForPoolBalance(
    assetAmount: Amount,
    userShareInPool: IUserShareInPool,
    assetInfo: AssetDetails[],
    assetId: number
) {
    if (assetAmount && userShareInPool && assetAmount.gt(userShareInPool.assetBalance)) {
        return new UserPoolBalanceNotEnough(assetInfo[assetId], assetAmount, userShareInPool.assetBalance);
    } else if (userShareInPool && userShareInPool.assetBalance.isZero()) {
        return new UserPoolBalanceNotEnough(assetInfo[assetId]);
    }
    return null;
}

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
        const assetBalanceError = getErrorForUserBalance(assetAmount, accountAssetBalance, assetInfo, assetId);
        if (assetBalanceError) {
            mergeError(FormSection.assetAmount, assetBalanceError, errors);
        }
        const coreBalanceError = getErrorForUserBalance(coreAmount, accountCoreBalance, assetInfo, coreAssetId);
        if (coreBalanceError) {
            mergeError(FormSection.coreAmount, coreBalanceError, errors);
        }
    }
    if (extrinsic === REMOVE_LIQUIDITY) {
        const poolBalanceErrorForAsset = getErrorForPoolBalance(assetAmount, userShareInPool, assetInfo, assetId);
        if (poolBalanceErrorForAsset) {
            mergeError(FormSection.assetAmount, poolBalanceErrorForAsset, errors);
        }
        const poolBalanceErrorForCore = getErrorForPoolBalance(coreAmount, userShareInPool, assetInfo, coreAssetId);
        if (poolBalanceErrorForCore) {
            mergeError(FormSection.coreAmount, poolBalanceErrorForCore, errors);
        }
    }
}

function checkUserBalanceForFee(props: LiquidityProps, errors: FormErrors): string {
    const {
        form: {assetAmount, assetId, feeAssetId, coreAmount, signingAccount},
        txFee,
        coreAssetId,
        userAssetBalance,
        assetInfo,
    } = props;
    if (!assetAmount || !assetId || !txFee) return;
    const feeAmount = coreAssetId === feeAssetId ? txFee.feeInCpay : txFee.feeInFeeAsset;
    let balRequired = feeAmount;

    if (coreAmount && balRequired) {
        balRequired = new Amount(balRequired.add(coreAmount));
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
