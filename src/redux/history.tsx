import {createBrowserHistory} from 'history';
// {basename: '/'}
//export default createBrowserHistory();*

let history;

if (typeof document !== 'undefined') {
    history = createBrowserHistory();
}

export default history;
