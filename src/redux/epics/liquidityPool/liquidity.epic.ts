import BN from 'bn.js';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, from, Observable, of} from 'rxjs/index';
import {catchError, filter, map, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency} from '../../../typings';
import {Amount, AmountUnit} from '../../../util/Amount';
import {
    ADD_LIQUIDITY,
    liquidityPARAMSOutput,
    prepareExchangeExtrinsicParamsWithBuffer,
    REMOVE_LIQUIDITY,
} from '../../../util/extrinsicUtil';
import types from '../../actions';
import {
    requestPoolBalance,
    requestTotalLiquidity,
    requestUserLiquidity,
    UpdateExtrinsicAction,
    updateTotalLiquidity,
    updateUserLiquidity,
} from '../../actions/ui/liquidityPool.action';
import {AppState} from '../../reducers';

export const prepareLiquidityParmsEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    action$.pipe(ofType<UpdateExtrinsicAction>(types.ui.LiquidityPool.EXTRINSIC_UPDATE)).pipe(
        withLatestFrom(store$),
        switchMap(
            ([, store]): Observable<Action<any>> => {
                const {extrinsic, addLiquidity, removeLiquidity} = (store as AppState).ui.liquidityPool;
                // paramList is arrayList with assetId and investor address
                let params;
                if (extrinsic === ADD_LIQUIDITY) {
                    params = addLiquidity.form;
                } else if (extrinsic === REMOVE_LIQUIDITY) {
                    params = removeLiquidity.form;
                }
                const paramList = params
                    ? (prepareExchangeExtrinsicParamsWithBuffer(extrinsic, params) as liquidityPARAMSOutput)
                    : [];
                if (paramList.length) {
                    return from([
                        requestUserLiquidity(paramList[0], paramList[1]),
                        requestTotalLiquidity(paramList[0] as number),
                        requestPoolBalance(paramList[0] as number),
                    ]);
                }
                return EMPTY;
            }
        )
    );

export const getUserLiquidityEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.LiquidityPool.USER_LIQUIDITY_REQUEST))]).pipe(
        withLatestFrom(store$),
        switchMap(([[api, action], store]) => {
            const {userLiquidity} = store.ui.liquidityPool;
            // api.cennzx.getLiquidityBalance(...action.payload).pipe(
            return api.cennzx.getLiquidityBalance(action.payload.assetId, action.payload.address).pipe(
                filter((liquidity: BN) => !userLiquidity || !new Amount(liquidity.toString()).eq(userLiquidity)),
                map((liquidity: BN) => {
                    const userLiqudityAmt = new Amount(liquidity.toString());
                    return updateUserLiquidity(userLiqudityAmt);
                })
            );
        })
    );

export const getTotalLiquidityEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.LiquidityPool.TOTAL_LIQUIDITY_REQUEST))]).pipe(
        withLatestFrom(store$),
        switchMap(([[api, action], store]) => {
            const {totalLiquidity} = store.ui.liquidityPool;
            return api.cennzx.getTotalLiquidity(action.payload).pipe(
                filter((liquidity: BN) => !totalLiquidity || !liquidity.eq(totalLiquidity)),
                map((liquidity: BN) => {
                    const totalLiqudityAmt = new Amount(liquidity.toString());
                    return updateTotalLiquidity(totalLiqudityAmt);
                })
            );
        })
    );

export default combineEpics(prepareLiquidityParmsEpic, getUserLiquidityEpic, getTotalLiquidityEpic);
