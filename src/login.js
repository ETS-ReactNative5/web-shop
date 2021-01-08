import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './styles/main_styles.css';
import './styles/responsive.css';



import './fontawesome-free-5.0.1/css/fontawesome-all.css';


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
