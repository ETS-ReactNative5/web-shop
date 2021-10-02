import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import './styles/main_styles.css';

import './styles/responsive.css';

import './fontawesome_pro/css/fontawesome-all.css';
import 'react-table/react-table.css'
import './styles/hover.css';
import '../node_modules/animate.css/animate.min.css';
import './styles/ania_chat.css';
import 'primereact/resources/primereact.min.css';
  



import './js/ania_chat.js';



import swDev from './swDev'

ReactDOM.render(<App />, document.getElementById('root'));
//swDev();
//registerServiceWorker();   
