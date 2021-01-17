import {Observable, of, Subject} from 'rxjs/index';
import {AppState} from '../../../reducers';
import {Amount} from '../../../../util/Amount';
import {SWAP_INPUT} from '../../../../util/extrinsicUtil';
import {TestScheduler} from 'rxjs/testing';
import {prepareBalanceParamsForFeeAssetEpic} from '../../exchange/updatePayAssetBalance.epic';
import {
    swapAsset,
    updateFeeAsset,
    updateSelectedAccount,
    updateSelectedFromAsset,
} from '../../../actions/ui/exchange.action';
import {IEpicDependency} from '../../../../typings';
import types from '../../../actions';
import {StateObservable} from 'redux-observable';
import {prepareBalanceParamsEpic} from '../../exchange/balance.epic';

describe('Request asset balance working', () => {
    const feeAsset = 16001;
    const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
    const triggers = [updateSelectedAccount(newAccount), updateSelectedFromAsset(feeAsset), swapAsset()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    cennzx: {},
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        exchange: {
                            form: {
                                fromAsset: 16000,
                                toAsset: 16001,
                                feeAssetId: 16001,
                                fromAssetAmount: new Amount(2),
                                toAssetAmount: new Amount(1),
                                signingAccount: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                                extrinsic: SWAP_INPUT,
                            },
                        },
                    },
                });

                const output$ = prepareBalanceParamsEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.ASSET_BALANCE_REQUEST,
                        payload: {assetId: 16000, signingAccount: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'},
                    },
                });
            });
        });
    });
});
