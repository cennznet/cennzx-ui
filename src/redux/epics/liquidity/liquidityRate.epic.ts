import {ApiRx} from '@cennznet/api';
import BN from 'bn.js';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, from, Observable, of} from 'rxjs';
import {catchError, filter, map, mergeMap, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency, LiquidityFormData} from '../../../typings';
import {Amount, AmountUnit} from '../../../util/Amount';
import {ADD_LIQUIDITY, REMOVE_LIQUIDITY} from '../../../util/extrinsicUtil';
import types from '../../actions';
import {updateExConnected} from '../../actions/extension.action';
import {
    requestAssetLiquidityPrice,
    requestCoreLiquidityPrice,
    setLiquidityError,
    updateAsset1Amount,
    updateAsset2Amount,
    updateLiquidityForWithdrawal,
} from '../../actions/ui/liquidity.action';
import {AppState} from '../../reducers';

export const getCoreLiquidityPriceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.CORE_LIQUIDITY_PRICE_REQUEST))]).pipe(
        withLatestFrom(store$),
        switchMap(([[api], store]) => {
            const {assetId, assetAmount} = store.ui.liquidity.form as LiquidityFormData;
            const exchangeReserve = store.ui.liquidity.exchangePool.find(exPool => exPool.assetId === assetId);
            const totalLiquidity = store.ui.liquidity.totalLiquidity;
            const liquidityAction = store.ui.liquidity.form.extrinsic;
            // If its the first time to add liquidity, no need to calculate the liquidity value, can use any combination
            if (!totalLiquidity || totalLiquidity.isZero()) {
                return EMPTY;
            }
            const coreAssetReserve = exchangeReserve ? exchangeReserve.coreAssetBalance : new Amount(0);
            const tradeAssetReserve = exchangeReserve ? exchangeReserve.assetBalance : new Amount(0);
            if (liquidityAction === ADD_LIQUIDITY) {
                let coreAmount: Amount | BN = assetAmount;
                if (!coreAssetReserve.isZero() || !tradeAssetReserve.isZero()) {
                    if (coreAssetReserve.toString() === tradeAssetReserve.toString()) {
                        // rate is 1:1 so core amount should be 1 less than asset amount
                        coreAmount = assetAmount
                            .mul(coreAssetReserve)
                            .div(tradeAssetReserve)
                            .isubn(1);
                    } else {
                        coreAmount = assetAmount.mul(coreAssetReserve).div(tradeAssetReserve);
                    }
                }
                return of(updateAsset2Amount(new Amount(coreAmount)));
            } else if (liquidityAction === REMOVE_LIQUIDITY) {
                let liquidityAmount;
                if (tradeAssetReserve.toString() === coreAssetReserve.toString()) {
                    liquidityAmount = assetAmount.mul(totalLiquidity).div(tradeAssetReserve);
                } else {
                    liquidityAmount = assetAmount
                        .mul(totalLiquidity)
                        .div(tradeAssetReserve)
                        .addn(1);
                }
                const coreAmount = liquidityAmount.mul(coreAssetReserve).div(totalLiquidity);
                const retObservable: Action<any>[] = [];
                retObservable.push(updateAsset2Amount(new Amount(coreAmount)));
                retObservable.push(updateLiquidityForWithdrawal(new Amount(liquidityAmount)));
                return from(retObservable);
            }
        })
    );

export const getAssetLiquidityPriceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.ASSET_LIQUIDITY_PRICE_REQUEST))]).pipe(
        withLatestFrom(store$),
        switchMap(([[api], store]) => {
            const {assetId, coreAmount} = store.ui.liquidity.form as LiquidityFormData;
            const exchangeReserve = store.ui.liquidity.exchangePool.find(exPool => exPool.assetId === assetId);
            const totalLiquidity = store.ui.liquidity.totalLiquidity;
            // If its the first time to add liquidity, no need to calculate the liquidity price, can use any combination
            if (!totalLiquidity || totalLiquidity.isZero()) {
                return EMPTY;
            }
            const liquidityAction = store.ui.liquidity.form.extrinsic;
            const coreAssetReserve = exchangeReserve ? exchangeReserve.coreAssetBalance : new Amount(0);
            const tradeAssetReserve = exchangeReserve ? exchangeReserve.assetBalance : new Amount(0);
            if (liquidityAction === ADD_LIQUIDITY) {
                let assetAmount: Amount | BN = coreAmount;
                if (!coreAssetReserve.isZero() || !tradeAssetReserve.isZero()) {
                    assetAmount = coreAmount
                        .mul(tradeAssetReserve)
                        .div(coreAssetReserve)
                        .addn(1);
                }
                return of(updateAsset1Amount(new Amount(assetAmount)));
            } else if (liquidityAction === REMOVE_LIQUIDITY) {
                let liquidityAmount;
                if (tradeAssetReserve.toString() === coreAssetReserve.toString()) {
                    liquidityAmount = coreAmount.mul(totalLiquidity).div(coreAssetReserve);
                } else {
                    liquidityAmount = coreAmount
                        .mul(totalLiquidity)
                        .div(coreAssetReserve)
                        .addn(1);
                }
                const assetAmount = liquidityAmount.mul(tradeAssetReserve).div(totalLiquidity);
                const retObservable: Action<any>[] = [];
                retObservable.push(updateAsset1Amount(new Amount(assetAmount)));
                retObservable.push(updateLiquidityForWithdrawal(new Amount(liquidityAmount)));
                return from(retObservable);
            }
        })
    );

export const requestAssetLiquidityPriceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.ASSET2_AMOUNT_SET))]).pipe(
        withLatestFrom(store$),
        filter(
            ([, store]) =>
                store.ui.liquidity.form.assetId &&
                store.ui.liquidity.form.coreAssetId &&
                !!store.ui.liquidity.form.coreAmount
        ),
        switchMap(
            ([, store]): Observable<Action<any>> => {
                return of(requestAssetLiquidityPrice());
            }
        )
    );

export const requestCoreLiquidityPriceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(ofType(types.ui.Liquidity.ASSET1_AMOUNT_SET, types.ui.Liquidity.SELECTED_ASSET1_UPDATE)),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([, store]) =>
                store.ui.liquidity.form.assetId &&
                store.ui.liquidity.form.coreAssetId &&
                !!store.ui.liquidity.form.assetAmount
        ),
        switchMap(
            ([, store]): Observable<Action<any>> => {
                return of(requestCoreLiquidityPrice());
            }
        )
    );

export default combineEpics(
    getCoreLiquidityPriceEpic,
    getAssetLiquidityPriceEpic,
    requestAssetLiquidityPriceEpic,
    requestCoreLiquidityPriceEpic
);
