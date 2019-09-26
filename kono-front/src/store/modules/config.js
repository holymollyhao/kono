import storage from '../../lib/storage';

/* Action Types. */
const SET_THEME = 'theme/SET_THEME';
const TOGGLE_THEME = 'theme/TOGGLE_THEME';
const SET_LANGUAGE = 'theme/SET_LANGUAGE';
const TOGGLE_LANGUAGE = 'theme/TOGGLE_LANGUAGE';
const SET_TO_LOCAL_STORAGE_THEME = 'theme/SET_TO_LOCAL_STORAGE_THEME';
const SET_TO_LOCAL_STORAGE_LANGUAGE = 'theme/SET_TO_LOCAL_STORAGE_LANGUAGE';

/* String Constants. */
const THEME_DEFAULT = 'theme_default';
const THEME_DARK = 'theme_dark';
const LANGUAGE_KR = 'kr';
const LANGUAGE_EN = 'en';
const STORAGE_KEY_THEME = '__THEME__';
const STORAGE_KEY_LANGUAGE = '__LANGUAGE__';

/* Initial States. */
const initialState = {
    theme: THEME_DEFAULT,
    language: LANGUAGE_KR
};

/* Action Definitions. */

/* SetTheme(theme: string) */
export const SetTheme = (theme) => {
    return {
        type: SET_THEME,
        theme
    };
};

/* ToggleTheme() */
export const ToggleTheme = () => {
    return {
        type: TOGGLE_THEME
    };
};


/* SetLanguage(language: string) */
export const SetLanguage = (language) => {
    return {
        type: SET_LANGUAGE,
        language
    };
};

/* ToggleLanguage() */
export const ToggleLanguage = () => {
    return {
        type: TOGGLE_LANGUAGE
    };
};
  
/* SetToLocalStorageTheme() */
export const SetToLocalStorageTheme = () => {
    return {
        type: SET_TO_LOCAL_STORAGE_THEME
    };
};
  
/* SetToLocalStorageLanguage() */
export const SettoLocalStorageLanguage = () => {
    return {
        type: SET_TO_LOCAL_STORAGE_LANGUAGE
    };
};

export const ConfigMiddleWare = store => next => action => {
    const state = store.getState();
    switch (action.type) {
        case SET_THEME:
            break;
        case TOGGLE_THEME:
            action.theme = state.config.theme === THEME_DARK ? THEME_DEFAULT : THEME_DARK;
            break;
        case SET_TO_LOCAL_STORAGE_THEME:
            action.theme = storage.get(STORAGE_KEY_THEME);
            break;
        case SET_LANGUAGE:
            break;
        case TOGGLE_LANGUAGE:
            action.language = state.config.language === LANGUAGE_EN ? LANGUAGE_KR : LANGAUGE_EN;
            break;
        case SET_TO_LOCAL_STORAGE_LANGUAGE:
            action.language = storage.get(STORAGE_KEY_LANGUAGE);
            break;
        default:
    }
    
    // In case action.theme is set to undefined or other unexpected string values.
    action.theme = (action.theme === THEME_DEFAULT || action.theme === THEME_DARK) ? action.theme : THEME_DEFAULT;
    // In case action.language is set to undefined or other unexpected string values.
    action.language = (action.language === LANGUAGE_KR || action.language === LANGUAGE_EN) ? action.language : LANGUAGE_KR;
    
    storage.set(STORAGE_KEY_THEME, action.theme);
    storage.set(STORAGE_KEY_LANGUAGE, action.language);
    
    next(action);
};

/* Reducer. */
const config = (state = initialState, action) => {
    switch (action.type) {
        case SET_THEME:
        case TOGGLE_THEME:
        case SET_TO_LOCAL_STORAGE_THEME:
            return { ...state, theme: action.theme };
        case SET_LANGUAGE:
        case TOGGLE_LANGUAGE:
        case SET_TO_LOCAL_STORAGE_LANGUAGE:
            return { ...state, language: action.language };
        default:
            return state;
    }
}

export default config;