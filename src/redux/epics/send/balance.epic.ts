import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {filter, map, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency} from '../../../typings';
import types from '../../actions';
import {requestAssetBalance} from '../../actions/ui/send.action';
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
                types.ui.Send.SELECTED_FROM_ASSET_UPDATE,
                types.ui.Send.SELECTED_ACCOUNT_UPDATE,
                types.ui.Send.ASSET_SWAP
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(([, store]) => store.ui.send.form.fromAsset && !!store.ui.send.form.signingAccount),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {fromAsset, signingAccount} = store.ui.send.form;
                return of(requestAssetBalance(fromAsset, signingAccount));
            }
        )
    );

export default combineEpics(prepareBalanceParamsEpic);
