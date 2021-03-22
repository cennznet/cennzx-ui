import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {filter, switchMap, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency, SendFormData} from '../../../typings';
import {prepareExchangeExtrinsicParamsWithBuffer} from '../../../util/extrinsicUtil';
import types from '../../actions';
import {requestTransactionFee, updateTxFeeParameter} from '../../actions/ui/send.action';
import {AppState} from '../../reducers';

export const prepareTransactionFeeEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Send.TRANSACTION_FEE_REQUEST))]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {extrinsic} = store.ui.send.form as SendFormData;

                const paramList = prepareExchangeExtrinsicParamsWithBuffer(extrinsic, store.ui.send.form);
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
                types.ui.Send.FROM_ASSET_AMOUNT_UPDATE,
                types.ui.Send.TO_ASSET_AMOUNT_UPDATE,
                types.ui.Send.ASSET_SWAP,
                types.ui.Send.SELECTED_FROM_ASSET_UPDATE,
                types.ui.Send.SELECTED_TO_ASSET_UPDATE,
                types.ui.Send.EXTRINSIC_UPDATE,
                types.ui.Send.SELECTED_ACCOUNT_UPDATE,
                types.ui.Send.FEE_ASSET_UPDATE
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([[, action], store]) =>
                store.ui.send.form.fromAsset &&
                store.ui.send.form.toAsset &&
                !!store.ui.send.form.fromAssetAmount &&
                !!store.ui.send.form.toAssetAmount &&
                !!store.ui.send.form.signingAccount &&
                !(store.ui.send.form.fromAssetAmount.isZero() && store.ui.send.form.toAssetAmount.isZero()) &&
                !!store.ui.send.form.extrinsic
        ),
        switchMap(([, store]) => {
            return of(requestTransactionFee());
        })
    );

export default combineEpics(prepareTransactionFeeEpic, requestTransactionFeeEpic);
