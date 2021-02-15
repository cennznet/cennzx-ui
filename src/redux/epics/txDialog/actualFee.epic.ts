import BN from 'bn.js';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, switchMap, takeUntil} from 'rxjs/operators';
import {IEpicDependency} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {observableActualFee} from '../../../util/feeUtil';
import types from '../../actions';
import {RequestActualFeeAction, setDailogError, updateActualFee} from '../../actions/ui/txDialog.action';
import {AppState} from '../../reducers';

export const getActualFee = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType<RequestActualFeeAction>(types.ui.TxDialog.TX_ACTUAL_FEE_REQUEST))]).pipe(
        switchMap(
            ([api, action]): Observable<Action<any>> => {
                const {blockHash, extrinsicIndex} = action.payload;
                return observableActualFee(blockHash, extrinsicIndex, api).pipe(
                    switchMap((fee: BN) => {
                        const gasInAmount = new Amount(fee.toString());
                        return of(updateActualFee(gasInAmount));
                    }),
                    takeUntil(action$.pipe(ofType(types.ui.Exchange.TRADE_RESET))),
                    catchError((err: any) => {
                        console.log(err);
                        return of(setDailogError(err));
                    })
                );
            }
        )
    );

export default combineEpics(getActualFee);
