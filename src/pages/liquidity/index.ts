import {FeeRate} from '@cennznet/types/interfaces/cennzx';
import {stat} from 'fs';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {BaseError, EmptyPool} from '../../error/error';

import {
    removeLiquidityError,
    requestTransactionFee,
    resetLiquidity,
    setAsset1Amount,
    setAsset2Amount,
    setLiquidityAction,
    updateExtrinsic,
    updateSelectedAccount,
    updateSelectedAsset1,
    updateTransactionBuffer,
} from '../../redux/actions/ui/liquidity.action';
import {openDialog} from '../../redux/actions/ui/txDialog.action';
import {AppState} from '../../redux/reducers';
import {IAccounts, IExtrinsic, IFee, IUserShareInPool, LiquidityFormData} from '../../typings';
import {Amount} from '../../util/Amount';
import {ADD_LIQUIDITY, prepareExchangeExtrinsicParamsWithBuffer, REMOVE_LIQUIDITY} from '../../util/extrinsicUtil';
import {Liquidity, LiquidityAction, LiquidityProps} from './liquidity';
import {
    getAccountAssetBalance,
    getAccountCoreBalance,
    getAssetReserve,
    getAssets,
    getCoreReserve,
    getExchangeRateMsg,
    getFee,
    getTxFeeMessage,
    getUserPoolShare,
} from './selectors';

const errorInstanceForPreviousEmptyPool = (error: BaseError[], assetId) => {
    let errInstance: null | EmptyPool = null;
    error.forEach(function(err) {
        if (err instanceof EmptyPool) {
            const emptyPoolForAsset = (err as EmptyPool).asset.id;
            if (emptyPoolForAsset === assetId) {
                errInstance = err;
            }
        }
    });
    return errInstance;
};

const mapStateToProps = (state: AppState): LiquidityProps => ({
    ...state.ui.liquidity,
    coreAssetId: state.global.coreAssetId as number,
    feeRate: state.global.feeRate as FeeRate,
    assetInfo: state.global.assetInfo,
    assets: getAssets(state),
    assetReserve: getAssetReserve(state) as Amount,
    accountAssetBalance: getAccountAssetBalance(state) as Amount,
    accountCoreBalance: getAccountCoreBalance(state) as Amount,
    coreReserve: getCoreReserve(state) as Amount,
    accounts: state.extension.accounts.map((account: IAccounts) => ({
        label: `${account.name}`,
        value: account.address,
    })),
    fee: getFee(state),
    exchangeRateMsg: getExchangeRateMsg(state),
    txFeeMsg: getTxFeeMessage(state) as string,
    userShareInPool: getUserPoolShare(state) as IUserShareInPool,
    // isDialogOpen: state.ui.txDialog.stage ? true : false,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    handleAssetAmountChange: (amount: Amount) => {
        dispatch(setAsset1Amount(amount));
        dispatch(requestTransactionFee());
    },
    handleCoreAmountChange: (amount: Amount) => {
        dispatch(setAsset2Amount(amount));
        dispatch(requestTransactionFee());
    },
    handleSelectedAccountChange: (account: string) => {
        dispatch(updateSelectedAccount(account));
    },
    handleLiquidityAction: (type: string) => {
        dispatch(setLiquidityAction(type));
        dispatch(updateExtrinsic(type === LiquidityAction.ADD ? ADD_LIQUIDITY : REMOVE_LIQUIDITY));
    },

    handleFeeBufferChange: (buffer: number) => {
        dispatch(updateTransactionBuffer(buffer));
    },
    handleAssetIdChange: (newAssetId: number, {assetId, coreAmount}: LiquidityFormData, error: BaseError[]) => {
        const errorToRemove = errorInstanceForPreviousEmptyPool(error, newAssetId);
        if (errorToRemove) {
            dispatch(removeLiquidityError(errorToRemove));
        }
        dispatch(updateSelectedAsset1(newAssetId));
    },
    handleExtrinsicChange: (Extrinsic: string) => {
        Extrinsic === LiquidityAction.ADD
            ? dispatch(updateExtrinsic(ADD_LIQUIDITY))
            : dispatch(updateExtrinsic(REMOVE_LIQUIDITY));
    },
    handleReset: () => {
        dispatch(resetLiquidity());
    },
    openTxDialog: (
        {
            extrinsic,
            signingAccount,
            feeAssetId,
            assetAmount,
            coreAmount,
            assetId,
            coreAssetId,
            buffer,
            type,
        }: LiquidityFormData,
        txFee: IFee
    ) => {
        const paramList = prepareExchangeExtrinsicParamsWithBuffer(extrinsic, {
            assetId,
            coreAssetId,
            coreAmount,
            assetAmount,
        });
        const extrinsicForDialog: IExtrinsic = {
            method: extrinsic || ADD_LIQUIDITY,
            params: paramList,
            price: extrinsic === ADD_LIQUIDITY ? assetAmount : coreAmount,
        };
        dispatch(
            openDialog({
                title: 'liquidity',
                signingAccount,
                extrinsic: extrinsicForDialog,
                feeInFeeAsset: txFee,
                feeAssetId: feeAssetId,
            })
        );
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Liquidity);
