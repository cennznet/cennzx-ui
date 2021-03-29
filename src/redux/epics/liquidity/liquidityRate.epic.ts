import {ApiRx} from '@cennznet/api';
import BN from 'bn.js';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs';
import {catchError, filter, map, mergeMap, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency, LiquidityFormData} from '../../../typings';
import {Amount, AmountUnit} from '../../../util/Amount';
import types from '../../actions';
import {
    requestLiquidityPrice,
    requestLiquidityValue,
    updateAddAsset1Amount,
    updateAddAsset2Amount,
} from '../../actions/ui/liquidity.action';
import {AppState} from '../../reducers';

export const getLiquidityValueEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.EXCHANGE_LIQUIDITY_VALUE))]).pipe(
        withLatestFrom(store$),
        switchMap(([, store]) => {
            const {assetId, assetAmount} = store.ui.liquidity.form as LiquidityFormData;
            const exchangeReserve = store.ui.liquidity.exchangePool.find(exPool => exPool.assetId === assetId);
            const totalLiquidity = store.ui.liquidity.totalLiquidity;
            // If its the first time to add liquidity, no need to calculate the liquidity value, can use any combination
            if (!totalLiquidity || totalLiquidity.isZero()) {
                return EMPTY;
            }
            const coreAssetReserve = exchangeReserve ? exchangeReserve.coreAssetBalance : new Amount(0);
            const tradeAssetReserve = exchangeReserve ? exchangeReserve.assetBalance : new Amount(0);
            let liquidityValue: Amount | BN = assetAmount;
            if (!coreAssetReserve.isZero() || !tradeAssetReserve.isZero()) {
                const partialCalculation = new Amount(assetAmount).mul(coreAssetReserve.div(tradeAssetReserve));
                if (partialCalculation.gtn(1)) {
                    liquidityValue = partialCalculation.isubn(1);
                }
            }
            return of(updateAddAsset2Amount(new Amount(liquidityValue)));
        })
    );

export const getLiquidityPriceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.EXCHANGE_LIQUIDITY_PRICE))]).pipe(
        withLatestFrom(store$),
        switchMap(([, store]) => {
            const {assetId, coreAmount} = store.ui.liquidity.form as LiquidityFormData;
            const exchangeReserve = store.ui.liquidity.exchangePool.find(exPool => exPool.assetId === assetId);
            const totalLiquidity = store.ui.liquidity.totalLiquidity;
            // If its the first time to add liquidity, no need to calculate the liquidity price, can use any combination
            if (!totalLiquidity || totalLiquidity.isZero()) {
                return EMPTY;
            }
            const coreAssetReserve = exchangeReserve ? exchangeReserve.coreAssetBalance : new Amount(0);
            const tradeAssetReserve = exchangeReserve ? exchangeReserve.assetBalance : new Amount(0);
            let liquidityPrice: Amount | BN = coreAmount;
            if (!coreAssetReserve.isZero() || !tradeAssetReserve.isZero()) {
                liquidityPrice = new Amount(coreAmount).mul(tradeAssetReserve.div(coreAssetReserve)).addn(1);
            }
            return of(updateAddAsset1Amount(new Amount(liquidityPrice)));
        })
    );

export const requestLiquidityPriceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.ADD_ASSET2_AMOUNT_SET))]).pipe(
        withLatestFrom(store$),
        filter(
            ([, store]) =>
                store.ui.liquidity.form.assetId &&
                store.ui.liquidity.form.coreAssetId &&
                !!store.ui.liquidity.form.coreAmount
        ),
        switchMap(
            ([, store]): Observable<Action<any>> => {
                return of(requestLiquidityPrice());
            }
        )
    );

export const requestLiquidityValueEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(ofType(types.ui.Liquidity.ADD_ASSET1_AMOUNT_SET, types.ui.Liquidity.SELECTED_ADD_ASSET1_UPDATE)),
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
                return of(requestLiquidityValue());
            }
        )
    );

export default combineEpics(
    getLiquidityValueEpic,
    getLiquidityPriceEpic,
    requestLiquidityValueEpic,
    requestLiquidityPriceEpic
);
