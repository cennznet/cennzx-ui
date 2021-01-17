import * as R from 'ramda';
import {addTranslationForLanguage, initialize} from 'react-localize-redux';
import {ofType} from 'redux-observable';
import {of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import supportedLanguages from '../../i18n/supportedLanguages';
import translations from '../../i18n/translations';
import {localStorage} from '../../storage';
import actions from '../actions';

let currentLanguage = 'en';
try {
    if (typeof window !== 'undefined') {
        currentLanguage = window.navigator.language;
    }
} catch {}

const i18nEpic = action$ =>
    action$.pipe(
        ofType(actions.GlobalActions.INIT_APP),
        mergeMap(() =>
            of(
                initialize({
                    languages: sortLocale(localStorage, supportedLanguages, currentLanguage),
                    options: {
                        renderToStaticMarkup: false, // don't support translations that contain HTML
                        onMissingTranslation: ({translationId}) => `*${translationId}*`,
                    },
                }),
                // @ts-ignore
                ...addTranslations(translations)
            )
        )
    );

const sortLocale = (storage, languages, defaultLanguage) => {
    const preferredLocale = storage ? storage.getItem('USER_LOCALE') || defaultLanguage : defaultLanguage;
    const selectedLang = R.find((lang: any) => preferredLocale.toLowerCase().includes(lang.code))(languages);
    return selectedLang ? R.prepend(selectedLang, R.without([selectedLang])(languages)) : languages;
};

const addTranslations = translations =>
    // @ts-ignore
    Object.entries(translations).map(([code, trans]: any) => addTranslationForLanguage(trans, code));

export default i18nEpic;
