import BN from 'bn.js';
import {StateObservable} from 'redux-observable';
import {Observable, of, Subject} from 'rxjs';
import {throwError} from 'rxjs/internal/observable/throwError';
import {TestScheduler} from 'rxjs/testing';
import {NodeConnectionTimeOut} from '../../../error/error';
import {IEpicDependency} from '../../../typings';
import types from '../../actions';
import {startApp} from '../../actions/global.action';
import {AppState} from '../../reducers';
import {getCoreAsset, getFeeRate, getRegisteredAssets} from '../global.epic';
import {AssetId} from '@cennznet/types';

describe('get core asset from api epic working', () => {
    const triggers = [startApp()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                const action_ = '-a-';
                // prettier-ignore
                const getCoreAssetId   = ' -b-';
                // prettier-ignore
                const expect_           = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    query: {
                        cennzx: {
                            coreAssetId: () =>
                                cold(getCoreAssetId, {
                                    b: new BN(16001),
                                }),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {});

                const output$ = getCoreAsset(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.GlobalActions.CORE_ASSET_UPDATE,
                        payload: 16001,
                    },
                });
            });
        });
    });
});

describe('get fee rate from api epic working', () => {
    const triggers = [startApp()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                const action_ = '-a-';
                // prettier-ignore
                const getDefaultFeeRate   = ' -b-';
                // prettier-ignore
                const expect_           = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    query: {
                        cennzx: {
                            defaultFeeRate: () =>
                                cold(getDefaultFeeRate, {
                                    b: 3000,
                                }),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {});

                const output$ = getFeeRate(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.GlobalActions.DEFAULT_FEE_RATE_UPDATE,
                        payload: 3000,
                    },
                });
            });
        });
    });
});

describe('get registered assets from api epic working', () => {
    const triggers = [startApp()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                const action_ = '-a-';
                // prettier-ignore
                const fetchRegisteredAssets   = ' -b-';
                // prettier-ignore
                const expect_           = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const assetInfo = [
                    [
                        '1',
                        {
                            symbol: 'CENNZ',
                            decimalPlaces: '4',
                        },
                    ],
                    [
                        '2',
                        {
                            symbol: 'CPAY',
                            decimalPlaces: '4',
                        },
                    ],
                ];
                const assets = {
                    assetInfo: assetInfo,
                    toJSON: function() {
                        return this.assetInfo;
                    },
                };
                const api$ = of({
                    rpc: {
                        genericAsset: {
                            registeredAssets: () =>
                                cold(fetchRegisteredAssets, {
                                    b: assets,
                                }),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {});

                const output$ = getRegisteredAssets(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.GlobalActions.ASSET_INFO_UPDATE,
                        payload: assetInfo,
                    },
                });
            });
        });
    });
});

describe('get registered assets from api epic working when api throws error', () => {
    const triggers = [startApp()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                const action_ = '-a';
                // prettier-ignore
                const expect_           = '-(b|)';

                const action$ = hot(action_, {
                    a: action,
                });

                const err = new NodeConnectionTimeOut();

                const api$ = of({
                    rpc: {
                        genericAsset: {
                            registeredAssets: () => throwError(err),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {});

                const output$ = getRegisteredAssets(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    b: {
                        error: true,
                        type: types.ui.Exchange.ERROR_SET,
                        payload: err,
                    },
                });
            });
        });
    });
});
