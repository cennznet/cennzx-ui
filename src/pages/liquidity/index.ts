import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {BaseError, EmptyPool} from '../../error/error';

import {
    setAdd1Amount,
    setAdd2Amount,
    resetTrade,
    setFromAssetAmount,
    swapAsset,
    updateFeeAsset,
    updateTransactionBuffer,
    addLiquidity,
    setToAssetAmount,
    removeLiquidityError,
    updateExtrinsic,
    updateSelectedAccount,
    setLiquidityAction,
    updateSelectedAdd1Asset,
    updateSelectedAdd2Asset,
    setAdd1AssetAmount,
    setAdd2AssetAmount,
    requestTransactionFee,
} from '../../redux/actions/ui/liquidity.action';
import {openDialog} from '../../redux/actions/ui/txDialog.action';
import {AppState} from '../../redux/reducers';
import {LiquidityFormData, IAccounts, IExtrinsic, IFee} from '../../typings';
import {Amount} from '../../util/Amount';
import {prepareExchangeExtrinsicParamsWithBuffer, ADD_LIQUIDITY, REMOVE_LIQUIDITY} from '../../util/extrinsicUtil';
import {Liquidity, LiquidityProps} from './liquidity';
import {
    getAssets,
    getExchangeRateMsg,
    getFee,
    getAdd1AssetUserBalance,
    getAdd1Reserve,
    getCoreAssetBalance,
    getTxFeeMessage,
    getCoreAssetUserBalance,
} from './selectors';

const errorInstanceForPreviousEmptyPool = (error: BaseError[], assetId) => {
    let errInstance = null;
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
    coreAsset: state.global.coreAsset,
    feeRate: state.global.feeRate,
    add1AssetBalance: getAdd1AssetUserBalance(state),
    accounts: state.extension.accounts.map((account: IAccounts) => ({
        label: `${account.name}: ${account.address}`,
        value: account.address,
    })),
    // outputReserve: getOutputReserve(state),
    add1Reserve: getAdd1Reserve(state),
    coreAssetBalance: getCoreAssetBalance(state),
    assets: getAssets(),
    fee: getFee(state),
    exchangeRateMsg: getExchangeRateMsg(state),
    txFeeMsg: getTxFeeMessage(state),
    coreAssetUserBalance: getCoreAssetUserBalance(state),
    // isDialogOpen: state.ui.txDialog.stage ? true : false,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    handleAdd1AmountChange: (amount: Amount) => {
        dispatch(setAdd1AssetAmount(amount));
        dispatch(requestTransactionFee());
    },
    handleAdd2AmountChange: (amount: Amount) => {
        dispatch(setAdd2AssetAmount(amount));
        dispatch(requestTransactionFee());
    },
    handleSelectedAccountChange: (account: string) => {
        dispatch(updateSelectedAccount(account));
    },

    handleLiquidityType: (type: string) => {
        dispatch(setLiquidityAction(type));
        dispatch(updateExtrinsic(type === 'add' ? ADD_LIQUIDITY : REMOVE_LIQUIDITY));
    },

    handleBuyAssetAmountChange: (amount: Amount) => {
        dispatch(setToAssetAmount(amount));
    },

    handleFeeBufferChange: (buffer: number) => {
        dispatch(updateTransactionBuffer(buffer));
    },
    handleWithAssetAmountChange: (amount: Amount) => {
        dispatch(setFromAssetAmount(amount));
    },
    handleAddLiquidityChange: (assetId: number, {fromAsset, toAsset}: LiquidityFormData, error: BaseError[]) => {
        if (fromAsset === assetId) {
            dispatch(addLiquidity());
        }
        // else {
        //     const errorToRemove = errorInstanceForPreviousEmptyPool(error, toAsset);
        //     if (errorToRemove) {
        //         dispatch(removeLiquidityError(errorToRemove));
        //     }
        //     dispatch(updateSelectedToAsset(assetId));
        // }
    },
    handleAdd1IdChange: (assetId: number, {add1Asset, toAsset}: LiquidityFormData, error: BaseError[]) => {
        if (add1Asset === assetId) {
            dispatch(swapAsset());
        } else {
            const errorToRemove = errorInstanceForPreviousEmptyPool(error, toAsset);
            if (errorToRemove) {
                dispatch(removeLiquidityError(errorToRemove));
            }
            dispatch(updateSelectedAdd1Asset(assetId));
        }
    },
    handleAdd2IdChange: (assetId: number) => {
        dispatch(updateSelectedAdd2Asset(assetId));
    },
    handleBuyAssetIdChange: (assetId: number, {fromAsset, toAsset}: LiquidityFormData, error: BaseError[]) => {
        if (fromAsset === assetId) {
            dispatch(swapAsset());
        } else {
            const errorToRemove = errorInstanceForPreviousEmptyPool(error, toAsset);
            if (errorToRemove) {
                dispatch(removeLiquidityError(errorToRemove));
            }
            dispatch(updateSelectedToAsset(assetId));
        }
    },
    handleExtrinsicChange: (Extrinsic: string) => {
        dispatch(updateExtrinsic(Extrinsic));
    },
    handleFeeAssetChange: (assetId: number) => {
        dispatch(updateFeeAsset(assetId));
    },
    handleSwap: () => {
        dispatch(swapAsset());
    },
    handleReset: () => {
        dispatch(resetTrade());
    },
    openTxDialog: (
        {
            extrinsic,
            signingAccount,
            feeAssetId,
            add1Amount,
            add2Amount,
            add1Asset,
            add2Asset,
            buffer,
            type,
        }: LiquidityFormData,
        txFee: IFee
    ) => {
        const paramList = prepareExchangeExtrinsicParamsWithBuffer(extrinsic, {
            extrinsic,
            fromAsset: add2Asset,
            toAsset: add1Asset,
            toAssetAmount: add1Amount,
            fromAssetAmount: add2Amount,
            signingAccount,
            feeAssetId,
            add1Amount,
            add2Amount,
            add1Asset,
            add2Asset,
            buffer,
            type,
        });
        const extrinsicForDialog: IExtrinsic = {
            method: extrinsic || ADD_LIQUIDITY,
            params: paramList,
            price: extrinsic === ADD_LIQUIDITY ? add1Amount : add2Amount,
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
