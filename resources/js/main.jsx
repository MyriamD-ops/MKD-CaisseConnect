import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    return React.createElement('div', {
        style: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fef2f2'
        }
    }, React.createElement('h1', {
        style: { fontSize: '48px', color: '#be123c' }
    }, '✅ React fonctionne ENFIN !'));
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(React.createElement(App));