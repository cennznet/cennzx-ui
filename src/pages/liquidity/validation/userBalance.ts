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
        return new UserBalanceNotEnough(assetInfo[assetId]);
    }
    return null;
}

function getErrorForPoolBalance(
    assetAmount: Amount,
    userShareInPool: Amount,
    assetInfo: AssetDetails[],
    assetId: number
) {
    if (assetAmount && userShareInPool && assetAmount.gt(userShareInPool)) {
        return new UserPoolBalanceNotEnough(assetInfo[assetId], assetAmount, userShareInPool);
    } else if (userShareInPool && userShareInPool.isZero()) {
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
        const assetBalanceError = getErrorForUserBalance(
            assetAmount as Amount,
            accountAssetBalance,
            assetInfo,
            assetId as number
        );
        if (assetBalanceError) {
            mergeError(FormSection.assetAmount, assetBalanceError, errors);
        }
        const coreBalanceError = getErrorForUserBalance(
            coreAmount as Amount,
            accountCoreBalance,
            assetInfo,
            coreAssetId as number
        );
        if (coreBalanceError) {
            mergeError(FormSection.coreAmount, coreBalanceError, errors);
        }
    }
    if (extrinsic === REMOVE_LIQUIDITY) {
        const assetBalanceInPool = userShareInPool ? userShareInPool.assetBalance : undefined;
        const poolBalanceErrorForAsset = getErrorForPoolBalance(
            assetAmount as Amount,
            assetBalanceInPool as Amount,
            assetInfo,
            assetId as number
        );
        if (poolBalanceErrorForAsset) {
            mergeError(FormSection.assetAmount, poolBalanceErrorForAsset, errors);
        }
        const coreBalanceInPool = userShareInPool ? userShareInPool.coreAssetBalance : undefined;
        const poolBalanceErrorForCore = getErrorForPoolBalance(
            coreAmount as Amount,
            coreBalanceInPool as Amount,
            assetInfo,
            coreAssetId as number
        );
        if (poolBalanceErrorForCore) {
            mergeError(FormSection.coreAmount, poolBalanceErrorForCore, errors);
        }
    }
}

function checkUserBalanceForFee(props: LiquidityProps, errors: FormErrors): string | undefined {
    const {
        form: {assetAmount, assetId, feeAssetId, coreAmount, signingAccount, extrinsic},
        txFee,
        coreAssetId,
        userAssetBalance,
        assetInfo,
    } = props;
    if (!assetAmount || !assetId || !txFee) return;
    const feeAmount = coreAssetId === feeAssetId ? txFee.feeInCpay : txFee.feeInFeeAsset;
    let balRequired = feeAmount;

    // Add core amount to the fee only for add liquidity operation
    if (extrinsic && extrinsic === ADD_LIQUIDITY && coreAmount && balRequired) {
        balRequired = new Amount(balRequired.add(coreAmount));
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
