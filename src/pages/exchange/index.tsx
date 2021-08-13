import {FeeRate} from '@cennznet/types/interfaces/cennzx';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {BaseError, EmptyPool} from '../../error/error';
import {
    removeExchangeError,
    resetError,
    resetTrade,
    setFromAssetAmount,
    setToAssetAmount,
    swapAsset,
    updateExtrinsic,
    updateFeeAsset,
    updateSelectedAccount,
    updateSelectedFromAsset,
    updateSelectedToAsset,
    updateTransactionBuffer,
} from '../../redux/actions/ui/exchange.action';
import {openDialog} from '../../redux/actions/ui/txDialog.action';
import {AppState} from '../../redux/reducers';
import {ExchangeFormData, IAccounts, IExtrinsic, IFee} from '../../typings';
import {Amount} from '../../util/Amount';
import {prepareExchangeExtrinsicParamsWithBuffer, SWAP_INPUT, SWAP_OUTPUT} from '../../util/extrinsicUtil';
import {Exchange, ExchangeProps} from './exchange';
import {
    getAssets,
    getExchangeRateMsg,
    getFromAssetUserBalance,
    getOutputReserve,
    getToAssetUserBalance,
    getTxFeeMessage,
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

const mapStateToProps = (state: AppState): ExchangeProps => ({
    ...state.ui.exchange,
    assetInfo: state.global.assetInfo,
    coreAssetId: state.global.coreAssetId as number,
    feeRate: state.global.feeRate as FeeRate,
    assets: getAssets(state),
    fromAssetBalance: getFromAssetUserBalance(state) as Amount,
    toAssetBalance: getToAssetUserBalance(state) as Amount,
    accounts: state.extension.accounts.map((account: IAccounts) => ({
        label: `${account.name}`,
        value: account.address,
    })),
    outputReserve: getOutputReserve(state) as Amount,
    exchangeRateMsg: getExchangeRateMsg(state) as string,
    txFeeMsg: getTxFeeMessage(state) as string,
    // isDialogOpen: state.ui.txDialog.stage ? true : false,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    handleFeeBufferChange: (buffer: number) => {
        dispatch(updateTransactionBuffer(buffer));
    },
    handleSelectedAccountChange: (account: string) => {
        dispatch(updateSelectedAccount(account));
    },
    handleBuyAssetAmountChange: (amount: Amount) => {
        dispatch(setToAssetAmount(amount));
        dispatch(updateExtrinsic(SWAP_OUTPUT));
        dispatch(resetError());
    },
    handleWithAssetAmountChange: (amount: Amount) => {
        dispatch(setFromAssetAmount(amount));
        dispatch(updateExtrinsic(SWAP_INPUT));
        dispatch(resetError());
    },
    handleBuyAssetIdChange: (assetId: number, {fromAsset, toAsset}: ExchangeFormData, error: BaseError[]) => {
        if (fromAsset === assetId) {
            dispatch(swapAsset());
        } else {
            const errorToRemove = errorInstanceForPreviousEmptyPool(error, toAsset);
            if (errorToRemove) {
                dispatch(removeExchangeError(errorToRemove));
            }
            dispatch(updateSelectedToAsset(assetId));
        }
    },
    handleWithAssetIdChange: (assetId: number, {fromAsset, toAsset}: ExchangeFormData, error: BaseError[]) => {
        if (toAsset === assetId) {
            dispatch(swapAsset());
        } else {
            const errorToRemove = errorInstanceForPreviousEmptyPool(error, fromAsset);
            if (errorToRemove) {
                dispatch(removeExchangeError(errorToRemove));
            }
            dispatch(updateSelectedFromAsset(assetId));
        }
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
            fromAsset,
            toAsset,
            toAssetAmount,
            fromAssetAmount,
            signingAccount,
            feeAssetId,
            buffer,
        }: ExchangeFormData,
        txFee: IFee
    ) => {
        const paramList = prepareExchangeExtrinsicParamsWithBuffer(extrinsic, {
            fromAsset,
            toAsset,
            toAssetAmount,
            fromAssetAmount,
            signingAccount,
            feeAssetId,
            buffer,
        });
        const extrinsicForDialog: IExtrinsic = {
            method: extrinsic,
            params: paramList,
            price: extrinsic === SWAP_OUTPUT ? fromAssetAmount : toAssetAmount,
        };
        dispatch(
            openDialog({
                title: 'exchange',
                signingAccount,
                extrinsic: extrinsicForDialog,
                feeInFeeAsset: txFee,
                feeAssetId,
            })
        );
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Exchange);
