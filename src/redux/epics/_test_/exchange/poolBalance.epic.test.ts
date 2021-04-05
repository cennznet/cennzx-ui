import {StateObservable} from 'redux-observable';
import {Observable, Subject, EMPTY} from 'rxjs';
import {ReplaySubject} from 'rxjs';
import types from '../../../actions';
import {AppState} from '../../../reducers';
import {getAssetPoolBalanceEpic} from '../../exchange/poolBalance.epic';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency} from '../../../../typings';
import {updateSelectedToAsset} from '../../../actions/ui/exchange.action';
import {Amount} from '../../../../util/Amount';
import {of} from 'rxjs/index';
import BN from 'bn.js';
import {BaseError, EmptyPool, NodeConnectionTimeOut} from '../../../../error/error';
import {throwError} from 'rxjs/internal/observable/throwError';

const accounts$ = new ReplaySubject<any>(1);
const account = [
    {
        name: 'Account 1',
        address: '5GDq1kEpNzxWQcnviMRFnp1y8m47kWC1EDEUzgCZQFc4G1Df',
    },
];
accounts$.next(account);

describe('trigger on pool balance epic works', () => {
    const asset = 16000;
    const triggers = [updateSelectedToAsset(asset)];
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
                const coreAssetId_              = ' -f-';
                // prettier-ignore
                const getPoolAssetBalance       = '  -b-';
                // prettier-ignore
                const getPoolCoreAssetBalance   = '  -d-';
                // prettier-ignore
                const exchangeAddress           = '  -e-';
                // prettier-ignore
                const expect_                   = '---c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    cennzx: {
                        getPoolAssetBalance: () =>
                            cold(getPoolAssetBalance, {
                                b: new BN('34220'),
                            }),
                        getPoolCoreAssetBalance: () =>
                            cold(getPoolCoreAssetBalance, {
                                d: new BN('14220'),
                            }),
                    },
                    query: {
                        cennzx: {
                            coreAssetId: () =>
                                cold(coreAssetId_, {
                                    f: new BN(16001),
                                }),
                        },
                    },
                    derive: {
                        cennzx: {
                            exchangeAddress: () =>
                                cold(exchangeAddress, {
                                    e: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                                }),
                        },
                    },
                });
                if (typeof window !== 'undefined') {
                    window.SingleSource = {
                        accounts$,
                        signer: {
                            sign: async (t, n, e) => {
                                return 1;
                            },
                        },
                    };
                }

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    extension: {
                        extensionDetected: false,
                        extensionConnected: false,
                        accounts: [],
                    },
                    ui: {
                        exchange: {
                            form: {toAsset: 16000},
                        },
                    },
                });

                const output$ = getAssetPoolBalanceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Exchange.EXCHANGE_POOL_BALANCE_UPDATE,
                        payload: {
                            coreAssetBalance: new Amount('14220'),
                            assetBalance: new Amount('34220'),
                            assetId: 16000,
                            address: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                        },
                    },
                });
            });
        });
    });
});

describe('Return pool balance as empty for core asset', () => {
    const asset = 16001;
    const triggers = [updateSelectedToAsset(asset)];
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
                const coreAssetId_              = ' -f-';
                // prettier-ignore
                const expect_                   = '';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    query: {
                        cennzx: {
                            coreAssetId: () =>
                                cold(coreAssetId_, {
                                    f: new BN(16001),
                                }),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    extension: {
                        extensionDetected: false,
                        extensionConnected: false,
                        accounts: [],
                    },
                    ui: {
                        exchange: {
                            form: {toAsset: 16001},
                        },
                    },
                });

                const output$ = getAssetPoolBalanceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});

describe('Test when pool balance is empty', () => {
    const asset = 16000;
    const triggers = [updateSelectedToAsset(asset)];
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
                const coreAssetId_              = ' -f-';
                // prettier-ignore
                const getPoolAssetBalance       = '  -b-';
                // prettier-ignore
                const getPoolCoreAssetBalance   = '  -d-';
                // prettier-ignore
                const exchangeAddress           = '  -e-';
                // prettier-ignore
                const expect_                   = '---c';

                const action$ = hot(action_, {
                    a: action,
                });
                if (typeof window !== 'undefined') {
                    window.config.ASSETS = [
                        {symbol: 'CENNZ', id: 16000},
                        {symbol: 'CPAY', id: 16001},
                        {symbol: 'PLUG', id: 16003},
                    ];
                }

                const api$ = of({
                    cennzx: {
                        getPoolAssetBalance: () =>
                            cold(getPoolAssetBalance, {
                                b: new BN('0'),
                            }),
                        getPoolCoreAssetBalance: () =>
                            cold(getPoolCoreAssetBalance, {
                                d: new BN('0'),
                            }),
                    },
                    query: {
                        cennzx: {
                            coreAssetId: () =>
                                cold(coreAssetId_, {
                                    f: new BN(16001),
                                }),
                        },
                    },
                    derive: {
                        cennzx: {
                            exchangeAddress: () =>
                                cold(exchangeAddress, {
                                    e: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                                }),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    extension: {
                        extensionDetected: false,
                        extensionConnected: false,
                        accounts: [],
                    },
                    ui: {
                        exchange: {
                            form: {toAsset: 16000},
                        },
                    },
                });

                const output$ = getAssetPoolBalanceEpic(action$, state$, dependencies);
                const err = new EmptyPool({symbol: 'CENNZ', id: 16000});
                expectObservable(output$).toBe(expect_, {
                    c: {
                        error: true,
                        type: types.ui.Exchange.ERROR_SET,
                        payload: err,
                    },
                });
            });
        });
    });
});

describe('Test when api method throws error', () => {
    const asset = 16000;
    const triggers = [updateSelectedToAsset(asset)];
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
                const coreAssetId_              = ' -f-';
                // prettier-ignore
                const getPoolAssetBalance       = '  -#-';
                // prettier-ignore
                const getPoolCoreAssetBalance   = '  -d-';
                // prettier-ignore
                const exchangeAddress           = '  -e-';
                // prettier-ignore
                const expect_                   = '--c';

                const action$ = hot(action_, {
                    a: action,
                });
                const err = new NodeConnectionTimeOut();

                const api$ = of({
                    cennzx: {
                        getPoolAssetBalance: () => throwError(err),
                        getPoolCoreAssetBalance: () =>
                            cold(getPoolCoreAssetBalance, {
                                d: new BN('10'),
                            }),
                    },
                    query: {
                        cennzx: {
                            coreAssetId: () =>
                                cold(coreAssetId_, {
                                    f: new BN(16001),
                                }),
                        },
                    },
                    derive: {
                        cennzx: {
                            exchangeAddress: () =>
                                cold(exchangeAddress, {
                                    e: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                                }),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    extension: {
                        extensionDetected: false,
                        extensionConnected: false,
                        accounts: [],
                    },
                    ui: {
                        exchange: {
                            form: {toAsset: 16000},
                        },
                    },
                });

                const output$ = getAssetPoolBalanceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        error: true,
                        type: types.ui.Exchange.ERROR_SET,
                        payload: err,
                    },
                });
            });
        });
    });
});
