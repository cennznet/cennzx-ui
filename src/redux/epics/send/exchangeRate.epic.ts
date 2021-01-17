import {ApiRx} from '@cennznet/api';
import BN from 'bn.js';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs';
import {catchError, filter, map, mergeMap, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {SendFormData, IEpicDependency} from '../../../typings';
import {Amount, AmountUnit} from '../../../util/Amount';
import types from '../../actions';
import {
    requestExchangeRate,
    setExchangeError,
    SetExchangeErrorAction,
    updateExchangeRate,
    UpdateExchangeRateAction,
} from '../../actions/ui/send.action';
import {AppState} from '../../reducers';
import {SendState} from '../../reducers/ui/send.reducer';

export const getExchangeRateEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<UpdateExchangeRateAction | SetExchangeErrorAction> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Send.SEND_RATE_REQUEST))]).pipe(
        withLatestFrom(store$),
        switchMap(([obj, store]) => {
            const api: ApiRx = obj[0];
            const {exchangeRate} = store.ui.send as SendState;
            const {fromAsset, toAsset, fromAssetAmount} = store.ui.send.form as SendFormData;
            return api.rpc.cennzx.sellPrice(toAsset, fromAssetAmount, fromAsset).pipe(
                filter(
                    (exchangeRateFromAPI: BN) =>
                        !exchangeRate || !new Amount(exchangeRateFromAPI.toString()).eq(exchangeRate)
                ),
                map((exchangeRateFromAPI: BN) => {
                    const exRate = new Amount(exchangeRateFromAPI.toString(), AmountUnit.UN);
                    return updateExchangeRate(exRate);
                }),
                takeUntil(action$.pipe(ofType(types.ui.Send.TRADE_RESET))),
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
                types.ui.Send.FROM_ASSET_AMOUNT_SET,
                types.ui.Send.SELECTED_FROM_ASSET_UPDATE,
                types.ui.Send.SELECTED_TO_ASSET_UPDATE,
                types.ui.Send.ASSET_SWAP
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([, store]) =>
                store.ui.send.form.fromAsset && store.ui.send.form.toAsset && !!store.ui.send.form.fromAssetAmount
        ),
        switchMap(
            ([, store]): Observable<Action<any>> => {
                return of(requestExchangeRate());
            }
        )
    );

export default combineEpics(getExchangeRateEpic, requestExchangeRateEpic);
