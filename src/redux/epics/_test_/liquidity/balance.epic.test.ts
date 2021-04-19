import {Observable, of, Subject} from 'rxjs/index';
import {AppState} from '../../../reducers';
import {Amount} from '../../../../util/Amount';
import {ADD_LIQUIDITY} from '../../../../util/extrinsicUtil';
import {TestScheduler} from 'rxjs/testing';
import {updateSelectedAccount, updateSelectedAsset1} from '../../../actions/ui/liquidity.action';
import {IEpicDependency} from '../../../../typings';
import types from '../../../actions';
import {StateObservable} from 'redux-observable';
import {prepareRequestUserBalanceEpic} from '../../liquidity/balance.epic';

describe('Request asset balance working', () => {
    const feeAsset = 16001;
    const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
    const triggers = [updateSelectedAccount(newAccount), updateSelectedAsset1(feeAsset)];
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
                        liquidity: {
                            form: {
                                assetId: 16000,
                                feeAssetId: 16001,
                                signingAccount: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                                extrinsic: ADD_LIQUIDITY,
                            },
                        },
                    },
                });

                const output$ = prepareRequestUserBalanceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.USER_ASSET_BALANCE_REQUEST,
                        payload: {assetId: 16000, signingAccount: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'},
                    },
                });
            });
        });
    });
});
