import {ApiRx} from '@cennznet/api';
import {PriceResponse} from '@cennznet/types';
import BN from 'bn.js';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs';
import {catchError, filter, map, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {ExchangeFormData, IEpicDependency} from '../../../typings';
import {Amount, AmountUnit} from '../../../util/Amount';
import types from '../../actions';
import {requestExchangeRate, setExchangeError, updateExchangeRate} from '../../actions/ui/exchange.action';
import {AppState} from '../../reducers';
import {ExchangeState} from '../../reducers/ui/exchange.reducer';

export const getExchangeRateEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<any> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Exchange.EXCHANGE_RATE_REQUEST))]).pipe(
        withLatestFrom(store$),
        switchMap(([obj, store]) => {
            const api: ApiRx = obj[0];
            const {exchangeRate} = store.ui.exchange as ExchangeState;
            const {assetInfo} = store.global;
            const {fromAsset, toAsset} = store.ui.exchange.form as ExchangeFormData;
            const asset = assetInfo ? assetInfo[fromAsset] : undefined;
            const toAssetDecimal = asset ? asset.decimalPlaces : 0;
            const amount = new Amount(1, AmountUnit.DISPLAY, toAssetDecimal);
            return (api.rpc as any).cennzx.sellPrice(fromAsset, amount, toAsset).pipe(
                filter(
                    (exchangeRateFromAPI: PriceResponse) =>
                        !exchangeRate || !new Amount(exchangeRateFromAPI.price.toString()).eq(exchangeRate)
                ),
                map((exchangeRateFromAPI: PriceResponse) => {
                    const exRate = new Amount(exchangeRateFromAPI.price.toString(), AmountUnit.UN);
                    return updateExchangeRate(exRate);
                }),
                takeUntil(action$.pipe(ofType(types.ui.Exchange.TRADE_RESET))),
                catchError((err: any) => {
                    if (err.message === 'Pool balance is low') {
                        return EMPTY;
                    }
                    return of(setExchangeError(err));
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
                types.ui.Exchange.FROM_ASSET_AMOUNT_SET,
                types.ui.Exchange.SELECTED_FROM_ASSET_UPDATE,
                types.ui.Exchange.SELECTED_TO_ASSET_UPDATE,
                types.ui.Exchange.ASSET_SWAP
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([, store]) =>
                //@ts-ignore
                store.ui.exchange.form.fromAsset &&
                store.ui.exchange.form.toAsset &&
                !!store.ui.exchange.form.fromAssetAmount
        ),
        switchMap(
            ([, store]): Observable<Action<any>> => {
                return of(requestExchangeRate());
            }
        )
    );

export default combineEpics(getExchangeRateEpic, requestExchangeRateEpic);
