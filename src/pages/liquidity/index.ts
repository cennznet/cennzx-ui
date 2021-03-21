import {stat} from 'fs';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {BaseError, EmptyPool} from '../../error/error';

import {
    resetTrade,
    swapAsset,
    updateTransactionBuffer,
    addLiquidity,
    removeLiquidityError,
    updateExtrinsic,
    updateSelectedAccount,
    setLiquidityAction,
    updateSelectedAdd1Asset,
    setAdd1AssetAmount,
    setAdd2AssetAmount,
    requestTransactionFee,
} from '../../redux/actions/ui/liquidity.action';
import {openDialog} from '../../redux/actions/ui/txDialog.action';
import {AppState} from '../../redux/reducers';
import {LiquidityFormData, IAccounts, IExtrinsic, IFee} from '../../typings';
import {Amount} from '../../util/Amount';
import {prepareExchangeExtrinsicParamsWithBuffer, ADD_LIQUIDITY, REMOVE_LIQUIDITY} from '../../util/extrinsicUtil';
import {Liquidity, LiquidityAction, LiquidityProps} from './liquidity';
import {
    getAssets,
    getAccountAssetBalance,
    getAccountCoreBalance,
    getAssetReserve,
    getCoreReserve,
    getExchangeRateMsg,
    getFee,
    getTxFeeMessage,
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
    coreAssetId: state.global.coreAssetId,
    feeRate: state.global.feeRate,
    assetReserve: getAssetReserve(state),
    accountAssetBalance: getAccountAssetBalance(state),
    accountCoreBalance: getAccountCoreBalance(state),
    coreReserve: getCoreReserve(state),
    accounts: state.extension.accounts.map((account: IAccounts) => ({
        label: `${account.name}: ${account.address}`,
        value: account.address,
    })),
    assets: getAssets(),
    fee: getFee(state),
    exchangeRateMsg: getExchangeRateMsg(state),
    txFeeMsg: getTxFeeMessage(state),
    // isDialogOpen: state.ui.txDialog.stage ? true : false,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    handleAssetAmountChange: (amount: Amount) => {
        dispatch(setAdd1AssetAmount(amount));
        dispatch(requestTransactionFee());
    },
    handleCoreAmountChange: (amount: Amount) => {
        dispatch(setAdd2AssetAmount(amount));
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
    handleAddLiquidityChange: (asset: number, {assetId, coreAssetId}: LiquidityFormData, error: BaseError[]) => {
        if (asset === assetId) {
            dispatch(addLiquidity());
        } else {
            const errorToRemove = errorInstanceForPreviousEmptyPool(error, assetId);
            if (errorToRemove) {
                dispatch(removeLiquidityError(errorToRemove));
            }
        }
    },
    handleAssetIdChange: (newAssetId: number, {assetId, coreAmount}: LiquidityFormData, error: BaseError[]) => {
            const errorToRemove = errorInstanceForPreviousEmptyPool(error, newAssetId);
            if (errorToRemove) {
                dispatch(removeLiquidityError(errorToRemove));
            }
            dispatch(updateSelectedAdd1Asset(newAssetId));
    },
    handleExtrinsicChange: (Extrinsic: string) => {
        dispatch(updateExtrinsic(Extrinsic));
    },
    handleReset: () => {
        dispatch(resetTrade());
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
