import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {filter, map, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency} from '../../../typings';
import types from '../../actions';
import {requestAssetBalance} from '../../actions/ui/exchange.action';
import {AppState} from '../../reducers';

export const prepareBalanceParamsForToAssetEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(
            ofType(
                types.ui.Exchange.SELECTED_FROM_ASSET_UPDATE,
                types.ui.Exchange.SELECTED_ACCOUNT_UPDATE,
                types.ui.Exchange.ASSET_SWAP
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(([, store]) => store.ui.exchange.form.fromAsset && !!store.ui.exchange.form.signingAccount),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {fromAsset, signingAccount} = store.ui.exchange.form;
                return of(requestAssetBalance(fromAsset, signingAccount));
            }
        )
    );

export const prepareBalanceParamsForBuyAssetEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(
            ofType(
                types.ui.Exchange.SELECTED_TO_ASSET_UPDATE,
                types.ui.Exchange.SELECTED_ACCOUNT_UPDATE,
                types.ui.Exchange.ASSET_SWAP
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(([, store]) => store.ui.exchange.form.toAsset && !!store.ui.exchange.form.signingAccount),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {toAsset, signingAccount} = store.ui.exchange.form;
                return of(requestAssetBalance(toAsset, signingAccount));
            }
        )
    );

export default combineEpics(prepareBalanceParamsForToAssetEpic, prepareBalanceParamsForBuyAssetEpic);
