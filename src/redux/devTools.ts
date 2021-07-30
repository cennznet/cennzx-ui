declare let window: Window;
export const getDevToolsExt = () => {
    if (typeof window !== 'undefined' && process.env.ENV !== 'PROD') {
        const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
        if (typeof devToolsExtension === 'function') {
            return [devToolsExtension];
        }
    }

    return [];
};
