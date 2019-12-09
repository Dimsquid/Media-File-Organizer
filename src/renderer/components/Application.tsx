import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import * as css from './app.scss';

import Sidebar from './Sidebar/Sidebar';
import MainContentPane from '../MainContentPane/MainContentPane'

const Application = () => (
    <div className={css.container}>
        <Sidebar/>
        <MainContentPane/>
    </div>
);

export default hot(Application);
