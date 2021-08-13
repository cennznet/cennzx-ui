import {combineEpics} from 'redux-observable';
// tslint:disable:no-string-literal
const epicsContext = require['context']('./', true, /\.epic\.ts$/);
const multipleEpicsContext = require['context']('./', true, /\.epics\.ts$/);

const epics: any = [];

epicsContext.keys().forEach(key => {
    epics.push(epicsContext(key).default);
});

multipleEpicsContext.keys().forEach(key => {
    epics.push(...multipleEpicsContext(key).default);
});

const rootEpic = combineEpics(...epics); // buttonTestEpic, i18nEpic
export default rootEpic;
