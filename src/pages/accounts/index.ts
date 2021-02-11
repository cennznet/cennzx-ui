import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {BaseError, EmptyPool} from '../../error/error';
import {
    removeSendError,
    resetTrade,
    setFromAssetAmount,
    setToAssetAmount,
    swapAsset,
    swapPayTransactionAsset,
    updateExtrinsic,
    updateFeeAsset,
    updateSelectedAccount,
    updateSelectedFromAsset,
    updateSelectedToAsset,
    updateTransactionBuffer,
    updateRecipientAddress,
} from '../../redux/actions/ui/send.action';
import {openDialog} from '../../redux/actions/ui/txDialog.action';
import {AppState} from '../../redux/reducers';
import {SendFormData, IAccounts, IExtrinsic, IFee, IOption, Asset} from '../../typings';
import {Amount} from '../../util/Amount';
import {prepareExchangeExtrinsicParamsWithBuffer, SWAP_INPUT, SWAP_OUTPUT} from '../../util/extrinsicUtil';
// import {Send, SendProps} from './send';
// import {getAssets, getExchangeRateMsg, getFromAssetUserBalance, getOutputReserve, getTxFeeMessage} from './selectors';
import BN from 'bn.js';
import {SendState} from '../../redux/reducers/ui/send.reducer';
import {Account} from './Account';

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

export type AccountProps = {
    // accounts: IOption[];
    // /**
    //  * user's balance of fromAsset
    //  * TODO: merge this with userAssetBalance
    //  */
    // // fromAssetBalance: Amount;
    // assets: Asset[];
    // // TODO: merge this with exchangePool
    // // outputReserve: Amount;
    // // exchangeRateMsg: string;
    // // txFeeMsg: string;
    // coreAsset: BN;
    // feeRate: FeeRate;
    genesisHash: any;
};

const mapStateToProps = (state: AppState): AccountProps => ({
    //...state.ui.send,
    genesisHash: state.global.genesisHash,
    // feeRate: state.global.feeRate,
    // fromAssetBalance: getFromAssetUserBalance(state),
    // accounts: state.extension.accounts.map((account: IAccounts) => ({
    //     label: `${account.name}: ${account.address}`,
    //     value: account.address,
    // })),
    // outputReserve: getOutputReserve(state),
    // assets: getAssets(),
    // exchangeRateMsg: getExchangeRateMsg(state),
    // txFeeMsg: getTxFeeMessage(state),
    // isDialogOpen: state.ui.txDialog.stage ? true : false,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    handleRecipientAddressChange: (address: string) => {
        dispatch(updateRecipientAddress(address));
    },
    handleFeeBufferChange: (buffer: number) => {
        dispatch(updateTransactionBuffer(buffer));
    },
    handleSelectedAccountChange: (account: string) => {
        dispatch(updateSelectedAccount(account));
    },
    handleBuyAssetAmountChange: (amount: Amount) => {
        dispatch(setToAssetAmount(amount));
        dispatch(updateExtrinsic(SWAP_OUTPUT));
    },
    handleWithAssetAmountChange: (amount: Amount) => {
        dispatch(setFromAssetAmount(amount));
        dispatch(updateExtrinsic(SWAP_INPUT));
    },
    handlePayTransactionFeeAssetIdChange: (assetId: number, {fromAsset, toAsset}: SendFormData, error: BaseError[]) => {
        if (fromAsset === assetId) {
            dispatch(swapPayTransactionAsset());
        }
        // else {
        //     const errorToRemove = errorInstanceForPreviousEmptyPool(error, toAsset);
        //     if (errorToRemove) {
        //         dispatch(removeExchangeError(errorToRemove));
        //     }
        //     dispatch(updateSelectedToAsset(assetId));
        // }
    },
    handleBuyAssetIdChange: (assetId: number, {fromAsset, toAsset}: SendFormData, error: BaseError[]) => {
        if (fromAsset === assetId) {
            dispatch(swapAsset());
        } else {
            const errorToRemove = errorInstanceForPreviousEmptyPool(error, toAsset);
            if (errorToRemove) {
                dispatch(removeSendError(errorToRemove));
            }
            dispatch(updateSelectedToAsset(assetId));
        }
    },
    handleWithAssetIdChange: (assetId: number, {fromAsset, toAsset}: SendFormData, error: BaseError[]) => {
        if (toAsset === assetId) {
            dispatch(swapAsset());
        } else {
            const errorToRemove = errorInstanceForPreviousEmptyPool(error, fromAsset);
            if (errorToRemove) {
                dispatch(removeSendError(errorToRemove));
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
            recipientAddress,
            extrinsic,
            fromAsset,
            toAsset,
            toAssetAmount,
            fromAssetAmount,
            signingAccount,
            feeAssetId,
            buffer,
        }: SendFormData,
        txFee: IFee
    ) => {
        const paramList = prepareExchangeExtrinsicParamsWithBuffer(extrinsic, {
            recipientAddress,
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
                title: 'send',
                signingAccount,
                extrinsic: extrinsicForDialog,
                feeInFeeAsset: txFee,
                feeAssetId,
                recipientAddress,
            })
        );
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Account);
