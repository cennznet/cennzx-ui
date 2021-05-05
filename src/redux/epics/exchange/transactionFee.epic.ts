import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {filter, switchMap, withLatestFrom} from 'rxjs/operators';
import {ExchangeFormData, IEpicDependency} from '../../../typings';
import {prepareExchangeExtrinsicParamsWithBuffer} from '../../../util/extrinsicUtil';
import types from '../../actions';
import {requestTransactionFee, updateTxFeeParameter} from '../../actions/ui/exchange.action';
import {AppState} from '../../reducers';

export const prepareTransactionFeeEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Exchange.TRANSACTION_FEE_REQUEST))]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {extrinsic} = store.ui.exchange.form as ExchangeFormData;

                const paramList = prepareExchangeExtrinsicParamsWithBuffer(extrinsic, store.ui.exchange.form);
                return of(updateTxFeeParameter(paramList));
            }
        )
    );

export const requestTransactionFeeEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(
            ofType(
                types.ui.Exchange.FROM_ASSET_AMOUNT_UPDATE,
                types.ui.Exchange.TO_ASSET_AMOUNT_UPDATE,
                types.ui.Exchange.ASSET_SWAP,
                types.ui.Exchange.SELECTED_FROM_ASSET_UPDATE,
                types.ui.Exchange.SELECTED_TO_ASSET_UPDATE,
                types.ui.Exchange.EXTRINSIC_UPDATE,
                types.ui.Exchange.SELECTED_ACCOUNT_UPDATE,
                types.ui.Exchange.FEE_ASSET_UPDATE
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([[, action], store]) =>
                store.ui.exchange.form.fromAsset &&
                store.ui.exchange.form.toAsset &&
                !!store.ui.exchange.form.fromAssetAmount &&
                !!store.ui.exchange.form.toAssetAmount &&
                !!store.ui.exchange.form.signingAccount &&
                !(store.ui.exchange.form.fromAssetAmount.isZero() && store.ui.exchange.form.toAssetAmount.isZero()) &&
                !!store.ui.exchange.form.extrinsic
        ),
        switchMap(([, store]) => {
            return of(requestTransactionFee());
        })
    );

export default combineEpics(prepareTransactionFeeEpic, requestTransactionFeeEpic);
