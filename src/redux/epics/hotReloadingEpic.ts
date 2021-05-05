import {Epic} from 'redux-observable';
import {BehaviorSubject, of} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {updateAppError} from '../actions/global.action';
import epics from './index';

const epic$ = new BehaviorSubject(epics);
export const hotReloadingEpic: Epic = (...args) =>
    epic$.pipe(
        switchMap((epic: any) => {
            return epic(...args);
        }),
        catchError((err: Error) => {
            return of(updateAppError(err));
        })
    );
