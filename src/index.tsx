import { render } from 'react-dom'
import App from './App'

import { Provider } from 'react-redux'
import store from './store'

import './index.css'

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
