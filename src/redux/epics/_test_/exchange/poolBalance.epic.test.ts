import {StateObservable} from 'redux-observable';
import {Observable, Subject, EMPTY} from 'rxjs';
import {ReplaySubject} from 'rxjs';
import types from '../../../actions';
import {updateSelectedAccount} from '../../../actions/ui/liquidity.action';
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

const globalAssetList = new Array();
globalAssetList[16000] = {decimalPlaces: 4, symbol: 'CENNZ', id: 16000};
globalAssetList[16001] = {decimalPlaces: 4, symbol: 'CPAY', id: 16001};

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
                const getPoolAssetBalance       = ' -b-';
                // prettier-ignore
                const getPoolCoreAssetBalance   = ' -d-';
                // prettier-ignore
                const exchangeAddress           = ' -e-';
                // prettier-ignore
                const expect_                   = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    derive: {
                        cennzx: {
                            poolAssetBalance: () =>
                                cold(getPoolAssetBalance, {
                                    b: new BN('34220'),
                                }),
                            poolCoreAssetBalance: () =>
                                cold(getPoolCoreAssetBalance, {
                                    d: new BN('14220'),
                                }),
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
                    ui: {
                        exchange: {
                            form: {toAsset: 16000},
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
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
                const expect_                   = '';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = EMPTY;

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        exchange: {
                            form: {toAsset: 16001},
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
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
                const getPoolAssetBalance       = ' -b-';
                // prettier-ignore
                const getPoolCoreAssetBalance   = ' -d-';
                // prettier-ignore
                const exchangeAddress           = ' -e-';
                // prettier-ignore
                const expect_                   = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    derive: {
                        cennzx: {
                            poolAssetBalance: () =>
                                cold(getPoolAssetBalance, {
                                    b: new BN('0'),
                                }),
                            poolCoreAssetBalance: () =>
                                cold(getPoolCoreAssetBalance, {
                                    d: new BN('0'),
                                }),
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
                    ui: {
                        exchange: {
                            form: {toAsset: 16000},
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
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
                const getPoolCoreAssetBalance   = '-d-';
                // prettier-ignore
                const exchangeAddress           = '-e-';
                // prettier-ignore
                const expect_                   = '-c';

                const action$ = hot(action_, {
                    a: action,
                });
                const err = new NodeConnectionTimeOut();

                const api$ = of({
                    derive: {
                        cennzx: {
                            poolAssetBalance: () => throwError(err),
                            poolCoreAssetBalance: () =>
                                cold(getPoolCoreAssetBalance, {
                                    d: new BN('10'),
                                }),
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
                    ui: {
                        exchange: {
                            form: {toAsset: 16000},
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
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

describe('Return empty from get assets pool balance epic when pool id is same as core asset', () => {
    const triggers = [updateSelectedToAsset(16001)];
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
                const expect_                   = '';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    rpc: {
                        cennzx: {},
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        exchange: {},
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getAssetPoolBalanceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});
