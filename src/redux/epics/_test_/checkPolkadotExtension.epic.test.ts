import {cennzx} from '@cennznet/types/interfaces/definitions';
import {StateObservable} from 'redux-observable';
import {Observable, ReplaySubject, Subject, of, EMPTY} from 'rxjs';
import {take} from 'rxjs/operators';
import {Amount} from '../../../util/Amount';
import types from '../../actions';
import {updateExAccounts, updateExDetected} from '../../actions/extension.action';
import {AppState} from '../../reducers';
import {Injected, InjectedAccounts} from '@polkadot/extension-inject/types';
import {Signer as InjectedSigner} from '@polkadot/api/types';

import {extensionDetectedEpic, observableAccountsEpic, updateSelectedAccountEpic} from '../checkPolkadotExtension.epic';
import {createAction} from 'redux-actions';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency, SingleSourceInjected} from '../../../typings';

const accounts$ = new ReplaySubject<any>(1);
const account = [
    {
        name: 'Account 1',
        meta: {name: 'Account 1'},
        address: '5GDq1kEpNzxWQcnviMRFnp1y8m47kWC1EDEUzgCZQFc4G1Df',
    },
];
accounts$.next(account);

// FIXME
describe.skip('trigger on init, polkadot extension detected', () => {
    const initAction = createAction(types.GlobalActions.INIT_APP);
    const triggers = [initAction()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
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

                let PolkadotInjected: Injected = {
                    accounts: (accounts$ as unknown) as InjectedAccounts,
                    signer: ({
                        sign: async (t, n, e) => {
                            return 1;
                        },
                    } as unknown) as InjectedSigner,
                };
                if (typeof window !== 'undefined') {
                    window.injectedWeb3 = {
                        ['polkadot-js']: {
                            version: 'A',
                            enable: async (): Promise<Injected> => {
                                return PolkadotInjected;
                            },
                        },
                    };
                }

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    extension: {
                        extensionDetected: false,
                        extensionConnected: false,
                        accounts: [],
                    },
                });

                const output$ = extensionDetectedEpic(action$, state$);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ExtensionActions.DETECTION_UPDATE,
                        payload: {
                            detected: true,
                            polkadotInjected: typeof window !== 'undefined' ? window.injectedWeb3['polkadot-js'] : null,
                        },
                    },
                });
            });
        });
    });
});

describe('trigger on detected, extension connected and accounts update', () => {
    const injectedWeb3 = {
        version: 'A',
        name: 'polkadot-js',
        accounts: (accounts$ as unknown) as InjectedAccounts,
        signer: ({
            sign: async (t, n, e) => {
                return 1;
            },
        } as unknown) as InjectedSigner,
    };
    const triggers = [updateExDetected(true, injectedWeb3)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(async ({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_ = '-a-';
                // prettier-ignore
                const expect_ = '-(c,d)-';
                //  const expect__ = '-c-';

                const action$ = hot(action_, {
                    a: action,
                });

                const output$ = await observableAccountsEpic(action$).pipe(take(1));
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
    const triggers = [updateExAccounts(account)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-(cd)-';

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
                    extension: {
                        extensionDetected: false,
                        extensionConnected: false,
                        accounts: account,
                    },
                });

                const output$ = updateSelectedAccountEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.SELECTED_ACCOUNT_UPDATE,
                        payload: account[0].address,
                    },
                    d: {
                        type: types.ui.Exchange.SELECTED_ACCOUNT_UPDATE,
                        payload: account[0].address,
                    },
                });
            });
        });
    });
});
