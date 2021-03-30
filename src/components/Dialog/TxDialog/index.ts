import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {createSelector} from 'reselect';
import {resetTrade} from '../../../redux/actions/ui/exchange.action';
import {
    closeDialog,
    requestSubmitLiquidity,
    requestSubmitSend,
    requestSubmitTransaction,
} from '../../../redux/actions/ui/txDialog.action';
import {AppState} from '../../../redux/reducers';
import {Amount} from '../../../util/Amount';
import {TxDialog} from './TxDialog';

const isTxSuccessSelector = createSelector(
    (state: AppState) => state.ui.txDialog.events,
    events => events.findIndex(event => event.event.method === 'ExtrinsicSuccess') > -1
);

const mapStateToProps = (state: AppState) => ({
    signingAccount: state.ui.txDialog.signingAccount,
    coreAssetId: state.global.coreAssetId,
    title: state.ui.txDialog.title,
    error: state.ui.txDialog.error,
    extrinsic: state.ui.txDialog.extrinsic,
    method: state.ui.txDialog.extrinsic ? state.ui.txDialog.extrinsic.method : undefined,
    estimatedTxFee: state.ui.txDialog.estimatedTxFee,
    stage: state.ui.txDialog.stage,
    events: state.ui.txDialog.events,
    txHash: state.ui.txDialog.txHash,
    actualTxFee: state.ui.txDialog.actualTxFee,
    feeAssetId: state.ui.txDialog.feeAssetId,
    recipientAddress: state.ui.txDialog.recipientAddress,
    exchange: state.ui.exchange.form,
    send: state.ui.send.form,
    fromAssetBalance: state.ui.txDialog.fromAssetBalance,
    liquidity: state.ui.liquidity.form,
    success: isTxSuccessSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    handleClose: () => {
        dispatch(closeDialog());
    },
    handleExchangeSubmit: ({
        extrinsic,
        signingAccount,
        feeAssetId,
        feeInFeeAsset,
        password,
        recipientAddress,
        buffer,
    }) => {
        dispatch(
            requestSubmitTransaction({
                extrinsic,
                signingAccount,
                feeAssetId,
                feeInFeeAsset,
                buffer,
                password,
            })
        );
    },

    handleSendSubmit: ({
        extrinsic,
        signingAccount,
        feeAssetId,
        feeInFeeAsset,
        recipientAddress,
        fromAsset,
        toAsset,
        fromAssetAmount,
        coreAsset,
        fromAssetBalance,
        buffer,
    }) => {
        dispatch(
            requestSubmitSend({
                extrinsic,
                coreAsset,
                signingAccount,
                feeAssetId,
                feeInFeeAsset,
                recipientAddress,
                fromAsset,
                toAsset,
                buffer,
                fromAssetAmount,
                fromAssetBalance,
            })
        );
    },

    handleLiquiditySubmit: ({
        type,
        extrinsic,
        signingAccount,
        assetId,
        assetAmount,
        coreAssetId,
        coreAmount,
        feeAssetId,
        feeInFeeAsset,
        add1Reserve,
        buffer,
    }) => {
        dispatch(
            requestSubmitLiquidity({
                type,
                extrinsic,
                signingAccount,
                assetId,
                assetAmount,
                coreAssetId,
                coreAmount,
                feeAssetId,
                buffer,
                feeInFeeAsset,
                add1Reserve,
            })
        );
    },
    handleComplete: () => {
        dispatch(resetTrade());
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TxDialog);
