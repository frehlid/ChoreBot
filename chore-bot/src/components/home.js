import React from 'react';
import YourChores from './yourChores'
import SelectChores from './selectChores';

function Home() {
    return (
        <div>
            <h1>Welcome!</h1>
            <YourChores />
            <SelectChores />
        </div>
    )
}