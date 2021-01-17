import {ApiRx} from '@cennznet/api';
import BN from 'bn.js';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs';
import {catchError, filter, map, mergeMap, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {LiquidityFormData, IEpicDependency} from '../../../typings';
import {Amount, AmountUnit} from '../../../util/Amount';
import types from '../../actions';
import {
    requestExchangeRate,
    setLiquidityError,
    SetLiquidityErrorAction,
    updateExchangeRate,
    UpdateExchangeRateAction,
    setAdd1Amount,
} from '../../actions/ui/liquidity.action';
import {AppState} from '../../reducers';
import {LiquidityState} from '../../reducers/ui/liquidity.reducer';

export const getExchangeRateEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<UpdateExchangeRateAction | SetLiquidityErrorAction> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.EXCHANGE_RATE_REQUEST))]).pipe(
        withLatestFrom(store$),
        switchMap(([obj, store]) => {
            const api: ApiRx = obj[0];
            const {exchangeRate} = store.ui.liquidity as LiquidityState;
            const {add2Asset, add1Asset, add1Amount, add2Amount} = store.ui.liquidity.form as LiquidityFormData;
            // ### sellPrice(AssetToSell: `AssetId`, Amount: `Balance`, AssetToPayout: `AssetId`): `u64`
            return api.rpc.cennzx.sellPrice(add1Asset, add2Amount, add2Asset).pipe(
                filter(
                    (exchangeRateFromAPI: BN) =>
                        !exchangeRate || !new Amount(exchangeRateFromAPI.toString()).eq(exchangeRate)
                ),
                map((exchangeRateFromAPI: BN) => {
                    const exRate = new Amount(exchangeRateFromAPI.toString(), AmountUnit.UN);
                    return updateExchangeRate(exRate);
                }),
                takeUntil(action$.pipe(ofType(types.ui.Liquidity.TRADE_RESET))),
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
        action$.pipe(
            ofType(
                types.ui.Liquidity.ADD1_ASSET_AMOUNT_SET,
                types.ui.Liquidity.ADD2_ASSET_AMOUNT_SET,
                types.ui.Liquidity.SELECTED_ADD1_ASSET_UPDATE,
                types.ui.Liquidity.SELECTED_ADD2_ASSET_UPDATE,
                types.ui.Liquidity.ASSET_SWAP
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([, store]) =>
                store.ui.liquidity.form.add1Asset &&
                store.ui.liquidity.form.add1Asset &&
                !!store.ui.liquidity.form.add2Amount
        ),
        switchMap(
            ([, store]): Observable<Action<any>> => {
                return of(requestExchangeRate());
            }
        )
    );

export default combineEpics(getExchangeRateEpic, requestExchangeRateEpic);
