import React, {useState} from 'react';
import YourChores from './yourChores'
import SelectChores from './selectChores';
import AddChore from './addChore';
import AllChores from './allChores';

function Home() {
    const [updateCounter, setUpdateCounter] = useState(0);

    return (
        <div id=".App">
                <YourChores updateCounter={updateCounter} setUpdateCounter={setUpdateCounter}/>
                <SelectChores updateCounter={updateCounter} setUpdateCounter={setUpdateCounter}/>
                <AddChore updateCounter={updateCounter} setUpdateCounter={setUpdateCounter}/>
                <AllChores updateCounter={updateCounter} setUpdateCounter={setUpdateCounter}/>
        </div>
    )
}

export default Home;