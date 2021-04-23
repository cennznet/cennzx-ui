import {StateObservable} from 'redux-observable';
import {Observable, Subject, EMPTY} from 'rxjs';
import {ReplaySubject} from 'rxjs';
import types from '../../../actions';
import {requestTotalLiquidity, updateSelectedAccount, updateSelectedAsset1} from '../../../actions/ui/liquidity.action';
import {AppState} from '../../../reducers';
import {getAssetPoolBalanceEpic, getTotalLiquidityEpic, getUserPoolShareEpic} from '../../liquidity/poolBalance.epic';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency, IUserShareInPool} from '../../../../typings';
import {Amount} from '../../../../util/Amount';
import {of} from 'rxjs/index';
import BN from 'bn.js';
import {NodeConnectionTimeOut} from '../../../../error/error';
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
    const triggers = [updateSelectedAsset1(asset)];
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
                        liquidity: {
                            form: {assetId: 16000},
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
                        type: types.ui.Liquidity.LIQUIDITY_POOL_BALANCE_UPDATE,
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
    const triggers = [updateSelectedAsset1(asset)];
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
                const expect_                   =  '';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    derive: {
                        cennzx: {},
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {assetId: 16001},
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
    const triggers = [updateSelectedAsset1(asset)];
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
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.LIQUIDITY_POOL_BALANCE_UPDATE,
                        payload: {
                            coreAssetBalance: new Amount('0'),
                            assetBalance: new Amount('0'),
                            assetId: 16000,
                            address: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                        },
                    },
                });
            });
        });
    });
});

describe('Test when api method throws error', () => {
    const asset = 16000;
    const triggers = [updateSelectedAsset1(asset)];
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
                        liquidity: {
                            form: {assetId: 16000},
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
                        type: types.ui.Liquidity.ERROR_SET,
                        payload: err,
                    },
                });
            });
        });
    });
});

describe('get user pool share epic works', () => {
    const asset = 16000;
    const triggers = [updateSelectedAsset1(asset), updateSelectedAccount('aaa')];
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
                const getLiquidityValue         = ' -b-';
                // prettier-ignore
                const expect_                   = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const liquidityVolume = new BN('34220');
                const coreValue = new BN('14220');
                const assetValue = new BN('12830');
                const api$ = of({
                    rpc: {
                        cennzx: {
                            liquidityValue: () =>
                                cold(getLiquidityValue, {
                                    b: [liquidityVolume, coreValue, assetValue],
                                }),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {
                                assetId: 16000,
                                coreAssetId: 16001,
                                signingAccount: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                            },
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const userShare: IUserShareInPool = {
                    coreAssetBalance: new Amount(coreValue),
                    assetBalance: new Amount(assetValue),
                    address: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                    liquidity: new Amount(liquidityVolume),
                    assetId: asset,
                };
                const output$ = getUserPoolShareEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.USER_POOL_SHARE_UPDATE,
                        payload: userShare,
                    },
                });
            });
        });
    });
});

describe('Return empty from get user pool share epic when pool is same as core asset', () => {
    const triggers = [updateSelectedAccount('xyz')];
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
                        liquidity: {
                            form: {
                                assetId: 16001,
                                coreAssetId: 16001,
                                signingAccount: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                            },
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getUserPoolShareEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});

describe('Test pool share when api method throws error', () => {
    const asset = 16000;
    const triggers = [updateSelectedAsset1(asset)];
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
                const err = new NodeConnectionTimeOut();

                const api$ = of({
                    rpc: {
                        cennzx: {
                            liquidityValue: () => throwError(err),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {assetId: 16000, signingAccount: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe'},
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getUserPoolShareEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        error: true,
                        type: types.ui.Liquidity.ERROR_SET,
                        payload: err,
                    },
                });
            });
        });
    });
});

describe('Get total liquidity epic works', () => {
    const asset = 16000;
    const triggers = [requestTotalLiquidity(asset)];
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

                const totalLiquidity = new BN('34220');
                const api$ = of({
                    derive: {
                        cennzx: {
                            totalLiquidity: () =>
                                cold(getPoolAssetBalance, {
                                    b: totalLiquidity,
                                }),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {assetId: 16000},
                            totalLiquidity: new Amount(1),
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getTotalLiquidityEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.TOTAL_LIQUIDITY_UPDATE,
                        payload: new Amount(totalLiquidity),
                    },
                });
            });
        });
    });
});

describe('Get total liquidity epic when liquidity is same', () => {
    const asset = 16000;
    const triggers = [requestTotalLiquidity(asset)];
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
                const getTotalLiquidity         = ' -b-';
                // prettier-ignore
                const expect_                   = '';

                const action$ = hot(action_, {
                    a: action,
                });

                const totalLiquidity = new BN('34220');
                const api$ = of({
                    derive: {
                        cennzx: {
                            totalLiquidity: () =>
                                cold(getTotalLiquidity, {
                                    b: totalLiquidity,
                                }),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {assetId: 16000},
                            totalLiquidity: totalLiquidity,
                        },
                    },
                    global: {
                        coreAssetId: 16001,
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getTotalLiquidityEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});
