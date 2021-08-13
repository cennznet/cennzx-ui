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
    fromAssetBalance: state.ui.txDialog.fromAssetBalance,
    liquidity: state.ui.liquidity.form,
    assetInfo: state.global.assetInfo,
    success: isTxSuccessSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    handleClose: () => {
        dispatch(closeDialog());
    },
    handleExchangeSubmit: ({extrinsic, signingAccount, feeAssetId, feeInFeeAsset, buffer}) => {
        dispatch(
            requestSubmitTransaction({
                extrinsic,
                signingAccount,
                feeAssetId,
                feeInFeeAsset,
                buffer,
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
        fromAssetBalance,
        buffer,
    }) => {
        dispatch(
            requestSubmitSend({
                extrinsic,
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

    handleLiquiditySubmit: ({extrinsic, signingAccount, feeAssetId, feeInFeeAsset, buffer}) => {
        dispatch(
            requestSubmitLiquidity({
                extrinsic,
                signingAccount,
                feeAssetId,
                buffer,
                feeInFeeAsset,
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
)(TxDialog as any);
