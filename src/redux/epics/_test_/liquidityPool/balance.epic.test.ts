import {StateObservable} from 'redux-observable';
import {Observable, of, Subject} from 'rxjs';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency, IUserBalance} from '../../../../typings';
import {Amount} from '../../../../util/Amount';
import types from '../../../actions';
import {AppState} from '../../../reducers';
import BN from 'bn.js';
import {getUserBalanceEpic} from '../../liquidityPool/balance.epic';
import {updateInvestmentAsset} from '../../../actions/ui/liquidityPool.action';

describe('Balance epic', () => {
    const fromAsset = 16001;

    describe('User balance epic test', () => {
        const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

        const triggers = [updateInvestmentAsset(16000)];
        triggers.forEach(action => {
            it(action.type, () => {
                const testScheduler = new TestScheduler((actual, expected) => {
                    // somehow assert the two objects are equal
                    // e.g. with chai `expect(actual).deep.equal(expected)`
                    expect(actual).toEqual(expected);
                });
                testScheduler.run(({hot, cold, expectObservable}) => {
                    // prettier-ignore
                    const action_                       = '-a-';
                    // prettier-ignore
                    const getFreeAssetBalance_          = '-b-';
                    // prettier-ignore
                    const expect_                       = '--c-';

                    const action$ = hot(action_, {
                        a: action,
                    });

                    const api$ = of({
                        genericAsset: {
                            getFreeBalance: () =>
                                cold(getFreeAssetBalance_, {
                                    b: new BN('1000'),
                                }),
                        },
                    });

                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: 16001,
                        },
                        ui: {
                            liquidityPool: {
                                addLiquidity: {
                                    investorBalance: null,
                                    form: {
                                        asset: 16000,
                                        investor: newAccount,
                                    },
                                },
                            },
                        },
                    });
                    const output$ = getUserBalanceEpic(action$, state$, dependencies);
                    const bal: IUserBalance = {
                        assetBalance: new Amount('1000'),
                        coreBalance: new Amount('1000'),
                        investor: newAccount,
                    };
                    expectObservable(output$).toBe(expect_, {
                        c: {
                            type: types.ui.LiquidityPool.INVESTOR_FREE_BALANCE_UPDATE,
                            payload: bal,
                        },
                    });
                });
            });
        });
    });

    describe('User balance epic test when data doesnt change should return EMPTY', () => {
        const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
        const bal: IUserBalance = {
            assetBalance: new Amount('1000'),
            coreBalance: new Amount('1000'),
            investor: newAccount,
        };
        const triggers = [updateInvestmentAsset(16000)];
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
                    const getFreeAssetBalance_      = '-b-';
                    // prettier-ignore
                    const expect_                   = '';

                    const action$ = hot(action_, {
                        a: action,
                    });

                    const api$ = of({
                        genericAsset: {
                            getFreeBalance: () =>
                                cold(getFreeAssetBalance_, {
                                    b: new BN('1000'),
                                }),
                        },
                    });

                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: new EnhancedAssetId(16001),
                        },
                        ui: {
                            liquidityPool: {
                                addLiquidity: {
                                    investorBalance: bal,
                                    form: {
                                        asset: 16000,
                                        investor: newAccount,
                                    },
                                },
                            },
                        },
                    });
                    const output$ = getUserBalanceEpic(action$, state$, dependencies);
                    expectObservable(output$).toBe(expect_);
                });
            });
        });
    });
});
