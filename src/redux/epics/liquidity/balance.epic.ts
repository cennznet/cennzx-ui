import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {filter, map, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency} from '../../../typings';
import types from '../../actions';
import {requestAssetBalance} from '../../actions/ui/liquidity.action';
import {AppState} from '../../reducers';

export const prepareBalanceParamsEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(
            ofType(
                types.ui.Liquidity.SELECTED_ADD1_ASSET_UPDATE,
                types.ui.Liquidity.SELECTED_ACCOUNT_UPDATE,
                types.ui.Liquidity.ASSET_SWAP
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(([, store]) => store.ui.liquidity.form.assetId && !!store.ui.liquidity.form.signingAccount),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {assetId, signingAccount} = store.ui.liquidity.form;
                return of(requestAssetBalance(assetId, signingAccount));
            }
        )
    );

export default combineEpics(prepareBalanceParamsEpic);
