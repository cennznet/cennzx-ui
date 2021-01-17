import {StateObservable} from 'redux-observable';
import {Observable, ReplaySubject, Subject, of, EMPTY} from 'rxjs';
import {take} from 'rxjs/operators';
import types from '../../actions';
import {AppState} from '../../reducers';
import {
    ssExtensionDetectedEpic,
    ssExtensionDetectionCompleted,
    updateExtensionInformationEpic,
} from '../checkSingleSourceExtension.epic';
import {createAction} from 'redux-actions';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency, SingleSourceInjected} from '../../../typings';
import {updateSSDetected} from '../../actions/extension.action';
import {swapAsset} from '../../actions/ui/exchange.action';
import {prepareBalanceParamsEpic} from '../exchange/balance.epic';
import {Amount} from '../../../util/Amount';
import {SWAP_INPUT} from '../../../util/extrinsicUtil';

const accounts$ = new ReplaySubject<any>(1);
const account = [
    {
        name: 'Account 1',
        address: '5GDq1kEpNzxWQcnviMRFnp1y8m47kWC1EDEUzgCZQFc4G1Df',
    },
];
accounts$.next(account);

describe('trigger on init, extension detected', () => {
    const initAction = createAction(types.GlobalActions.INIT_APP);
    const triggers = [initAction()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
                expect(actual[0]).toEqual(expected[0]);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_ = '-a-';
                // prettier-ignore
                const expect_ = '-c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = EMPTY;
                let SingleSourceInjected = {
                    accounts$,
                    signer: {
                        sign: async (t, n, e) => {
                            return 1;
                        },
                    },
                    isPaired$: EMPTY,
                    isPaired: true,
                    pairedDevice$: EMPTY,
                    pairedDevice: null,
                    accounts: [],
                };
                if (typeof window !== 'undefined') {
                    window.cennznetInjected = {
                        ['singleSource']: {
                            version: 'A',
                            enable: async (): Promise<SingleSourceInjected> => {
                                return SingleSourceInjected;
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
                });

                const output$ = ssExtensionDetectedEpic(action$, state$, dependencies).pipe(take(1));
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ExtensionActions.DETECTION_UPDATE,
                        payload: {detected: true, cennznetInjected: window.cennznetInjected},
                    },
                });
            });
        });
    });
});

describe('trigger on detected, extension connected and accounts update', () => {
    let SingleSourceInjected = {
        accounts$,
        signer: {
            sign: async (t, n, e) => {
                return 1;
            },
        },
        isPaired$: EMPTY,
        isPaired: true,
        pairedDevice$: EMPTY,
        pairedDevice: null,
        accounts: [],
    };
    if (typeof window !== 'undefined') {
        window.cennznetInjected = {
            ['singleSource']: {
                version: 'semver',

                enable: async (): Promise<SingleSourceInjected> => {
                    return SingleSourceInjected;
                },
            },
        };
    }
    const triggers = [updateSSDetected(true, window.cennznetInjected)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
                expect(actual).toEqual(expected);
            });
            testScheduler.run(async ({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_ = '-a-';
                // prettier-ignore
                const expect_ = '-(cd)-';
                //  const expect__ = '-c-';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    setSigner: () => {},
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
                });

                const output$ = await updateExtensionInformationEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ExtensionActions.CONNECTION_UPDATE,
                        payload: true,
                    },
                    d: {
                        type: types.ExtensionActions.ACCOUNTS_UPDATE,
                        payload: account,
                    },
                });
            });
        });
    });
});

describe('Extension detection completed works', () => {
    const feeAsset = 16001;
    const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
    const triggers = [updateSSDetected(true, window.cennznetInjected)];
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
                    ui: {},
                });

                const output$ = ssExtensionDetectionCompleted(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ExtensionActions.DETECTION_COMPLETED,
                    },
                });
            });
        });
    });
});
