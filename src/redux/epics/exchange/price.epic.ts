import {PriceResponse} from '@cennznet/types';
import BN from 'bn.js';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs';
import {catchError, filter, map, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {ExchangeFormData, IEpicDependency} from '../../../typings';
import {Amount, AmountUnit} from '../../../util/Amount';
import types from '../../actions';
import {
    setExchangeError,
    SetFromAssetAmountAction,
    SetToAssetAmountAction,
    updateFromAssetAmount,
    UpdateSelectedFromAssetAction,
    UpdateSelectedToAssetAction,
    updateToAssetAmount,
} from '../../actions/ui/exchange.action';
import {AppState} from '../../reducers';

// tslint:disable:no-magic-numbers
// FIXME
export const getInputPriceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(
            ofType<SetFromAssetAmountAction | UpdateSelectedToAssetAction>(
                types.ui.Exchange.FROM_ASSET_AMOUNT_SET,
                types.ui.Exchange.SELECTED_TO_ASSET_UPDATE,
                types.ui.Exchange.ASSET_SWAP
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([, store]) =>
                store.ui.exchange.form.fromAsset &&
                store.ui.exchange.form.toAsset &&
                !!store.ui.exchange.form.fromAssetAmount
        ),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {fromAssetAmount, fromAsset, toAsset, toAssetAmount} = store.ui.exchange.form as ExchangeFormData;
                const {error} = store.ui.exchange;
                return api.rpc.cennzx.sellPrice(fromAsset, fromAssetAmount, toAsset).pipe(
                    filter(
                        (priceRes: PriceResponse) =>
                            !toAssetAmount || !new Amount(priceRes.price.toString()).eq(toAssetAmount)
                    ),
                    map((priceRes: PriceResponse) => {
                        const amount = new Amount(priceRes.price.toString(), AmountUnit.UN);
                        return updateToAssetAmount(amount);
                    }),
                    takeUntil(action$.pipe(ofType(types.ui.Exchange.TRADE_RESET))),
                    catchError((err: any) => {
                        if (err.message === 'Pool balance is low') {
                            return EMPTY;
                        }
                        if (err.message === '2: Cannot exchange by requested amount.: ') {
                            err.message = 'Sell price cannot be calculated, issue with the requested amount';
                        }
                        const ifErrorAlreadyReported = error.find(er => er.message === err.message);
                        if (ifErrorAlreadyReported) {
                            return EMPTY;
                        }
                        return of(setExchangeError(err));
                    })
                );
            }
        )
    );

export const getOutputPriceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(
            ofType<SetToAssetAmountAction | UpdateSelectedFromAssetAction>(
                types.ui.Exchange.TO_ASSET_AMOUNT_SET,
                types.ui.Exchange.SELECTED_FROM_ASSET_UPDATE,
                types.ui.Exchange.ASSET_SWAP
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([, store]) =>
                store.ui.exchange.form.fromAsset &&
                store.ui.exchange.form.toAsset &&
                !!store.ui.exchange.form.toAssetAmount
        ),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {fromAssetAmount, fromAsset, toAsset, toAssetAmount} = store.ui.exchange.form as ExchangeFormData;
                const {error} = store.ui.exchange;
                return api.rpc.cennzx.buyPrice(toAsset, toAssetAmount, fromAsset).pipe(
                    filter(
                        (priceRes: PriceResponse) =>
                            !fromAssetAmount || !new Amount(priceRes.price.toString()).eq(fromAssetAmount)
                    ),
                    map((priceRes: PriceResponse) => {
                        const amount = new Amount(priceRes.price.toString(), AmountUnit.UN);
                        return updateFromAssetAmount(amount);
                    }),
                    takeUntil(action$.pipe(ofType(types.ui.Exchange.TRADE_RESET))),
                    catchError((err: any) => {
                        if (err.message === 'Pool balance is low') {
                            return EMPTY;
                        }
                        if (err.message === '2: Cannot exchange for requested amount.: ') {
                            err.message = 'Buy price cannot be calculated, issue with the requested amount';
                        }
                        const ifErrorAlreadyReported = error.find(er => er.message === err.message);
                        if (ifErrorAlreadyReported) {
                            return EMPTY;
                        }
                        return of(setExchangeError(err));
                    })
                );
            }
        )
    );

export default combineEpics(getInputPriceEpic, getOutputPriceEpic);
