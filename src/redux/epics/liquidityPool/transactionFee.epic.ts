import BN from 'bn.js';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {catchError, filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency} from '../../../typings';
import {Amount, AmountUnit} from '../../../util/Amount';
import {observableEstimatedFee} from '../../../util/feeUtil';
import types from '../../actions';
import {setPoolError, updateTransactionFee, updateTxFeeParameter} from '../../actions/ui/liquidityPool.action';
import {AppState} from '../../reducers';
import {LiquidityPoolState} from '../../reducers/ui/liquidityPool.reducer';

export const calculateTxFeeEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.LiquidityPool.TRANSACTION_FEE_PARAMS_UPDATE))]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {txFeeParams, txFee, extrinsic} = store.ui.liquidityPool;
                const tx = api.tx.cennzx[extrinsic](...txFeeParams.extrinsicParams);
                return observableEstimatedFee(tx, txFeeParams.investor, txFeeParams.feeAsset, api).pipe(
                    switchMap(([cpayFee, feeAssetFee]) => {
                        const feeInCpay = new Amount(cpayFee.toString(), AmountUnit.UN);
                        const feeInFeeAsset = feeAssetFee ? new Amount(feeAssetFee.toString(), AmountUnit.UN) : null;
                        const fee = {feeInCpay: feeInCpay, feeInFeeAsset: feeInFeeAsset};
                        if (
                            !txFee ||
                            !fee.feeInCpay.eq(txFee.feeInCpay) ||
                            (fee.feeInFeeAsset === null && txFee.feeInFeeAsset !== null) ||
                            (fee.feeInFeeAsset !== null && txFee.feeInFeeAsset === null) ||
                            (fee.feeInFeeAsset && txFee.feeInFeeAsset && !fee.feeInFeeAsset.eq(txFee.feeInFeeAsset))
                        ) {
                            return of(updateTransactionFee(fee));
                        }
                        return EMPTY;
                    }),
                    catchError((err: any) => of(setPoolError(err)))
                );
            }
        )
    );

export const prepareTxFeeParamsForAddLiquidityEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    action$
        .pipe(
            ofType(
                types.ui.LiquidityPool.DEPOSIT_CORE_AMOUNT_UPDATE,
                types.ui.LiquidityPool.DEPOSIT_ASSET_AMOUNT_UPDATE
            )
        )
        .pipe(
            withLatestFrom(store$),
            filter(
                ([, store]) =>
                    !!store.ui.liquidityPool.addLiquidity.form.assetAmount &&
                    !!store.ui.liquidityPool.addLiquidity.form.coreAmount
            ),
            map(([, store]) => {
                const {assetAmount, coreAmount, asset, investor, feeAssetId} = store.ui.liquidityPool.addLiquidity.form;
                const minLiquidity = 1;
                const paramList = [asset, minLiquidity, assetAmount, coreAmount];
                const txParams = {extrinsicParams: paramList, feeAsset: feeAssetId, investor: investor};
                return updateTxFeeParameter(txParams);
            })
        );

export const prepareTxFeeParamsForRemoveLiquidityEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    action$.pipe(ofType(types.ui.LiquidityPool.WITHDRAW_LIQUIDITY_UPDATE)).pipe(
        withLatestFrom(store$),
        filter(([, store]) => !!store.ui.liquidityPool.removeLiquidity.form.liquidity),
        map(([, store]) => {
            const {asset, liquidity, feeAssetId, investor} = store.ui.liquidityPool.removeLiquidity.form;
            const minAssetWithdrawn = 1;
            const minCoreWithdrawn = 1;
            const paramList = [asset, liquidity, minAssetWithdrawn, minCoreWithdrawn];
            const txParams = {extrinsicParams: paramList, feeAsset: feeAssetId, investor: investor};
            return updateTxFeeParameter(txParams);
        })
    );

export default combineEpics(prepareTxFeeParamsForAddLiquidityEpic, prepareTxFeeParamsForRemoveLiquidityEpic);
