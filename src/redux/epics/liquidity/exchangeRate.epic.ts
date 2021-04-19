import {ApiRx} from '@cennznet/api';
import BN from 'bn.js';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs';
import {catchError, filter, map, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {ExchangeFormData, IEpicDependency} from '../../../typings';
import {Amount, AmountUnit} from '../../../util/Amount';
import types from '../../actions';
import {requestExchangeRate, setLiquidityError, updateExchangeRate} from '../../actions/ui/liquidity.action';
import {AppState} from '../../reducers';

export const getExchangeRateEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<any> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.EXCHANGE_RATE_REQUEST))]).pipe(
        withLatestFrom(store$),
        switchMap(([obj, store]) => {
            const api: ApiRx = obj[0];
            const {exchangeRate} = store.ui.liquidity;
            const {assetInfo} = store.global;
            const totalLiquidity = store.ui.liquidity.totalLiquidity;
            if (!totalLiquidity || totalLiquidity.isZero()) {
                return EMPTY;
            }
            const {assetId, coreAssetId} = store.ui.liquidity.form;
            const asset = assetInfo ? assetInfo[assetId] : undefined;
            const assetDecimal = asset ? asset.decimalPlaces : 0;
            const amount = new Amount(1, AmountUnit.DISPLAY, assetDecimal);
            return api.rpc.cennzx.sellPrice(coreAssetId, amount, assetId).pipe(
                filter(
                    (exchangeRateFromAPI: BN) =>
                        !exchangeRate || !new Amount(exchangeRateFromAPI.toString()).eq(exchangeRate)
                ),
                map((exchangeRateFromAPI: BN) => {
                    const exRate = new Amount(exchangeRateFromAPI.toString(), AmountUnit.UN);
                    return updateExchangeRate(exRate);
                }),
                takeUntil(action$.pipe(ofType(types.ui.Liquidity.LIQUIDITY_RESET))),
                catchError((err: any) => {
                    if (err.message === 'Pool balance is low') {
                        return EMPTY;
                    }
                    return of(setLiquidityError(err));
                })
            );
        })
    );

export const requestExchangeRateEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(ofType(types.ui.Liquidity.SELECTED_ASSET1_UPDATE, types.ui.Liquidity.TOTAL_LIQUIDITY_UPDATE)),
    ]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([, store]): Observable<Action<any>> => {
                return of(requestExchangeRate());
            }
        )
    );

export default combineEpics(getExchangeRateEpic, requestExchangeRateEpic);
