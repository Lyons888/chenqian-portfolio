import React from 'react';
import {renderToString} from 'react-dom/server';
import {App} from '../src/main.jsx';
export const renderStatic=()=>renderToString(<App/>);
