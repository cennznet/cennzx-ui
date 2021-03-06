import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {filter, switchMap, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency, LiquidityFormData} from '../../../typings';
import {prepareExchangeExtrinsicParamsWithBuffer} from '../../../util/extrinsicUtil';
import types from '../../actions';
import {requestTransactionFee, updateTxFeeParameter} from '../../actions/ui/liquidity.action';
import {AppState} from '../../reducers';

export const prepareTransactionFeeEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.TRANSACTION_FEE_REQUEST))]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {extrinsic} = store.ui.liquidity.form as LiquidityFormData;
                const paramList = prepareExchangeExtrinsicParamsWithBuffer(extrinsic, store.ui.liquidity.form);
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
                types.ui.Liquidity.ASSET1_AMOUNT_UPDATE,
                types.ui.Liquidity.ASSET2_AMOUNT_UPDATE,
                types.ui.Liquidity.EXTRINSIC_UPDATE,
                types.ui.Liquidity.SELECTED_ACCOUNT_UPDATE,
                types.ui.Liquidity.FEE_ASSET_UPDATE
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([[, action], store]) => !!store.ui.liquidity.form.signingAccount && !!store.ui.liquidity.form.extrinsic
        ),
        switchMap(([, store]) => {
            return of(requestTransactionFee());
        })
    );

export default combineEpics(prepareTransactionFeeEpic, requestTransactionFeeEpic);
