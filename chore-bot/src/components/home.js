import React, {useState , useEffect} from 'react';
import YourChores from './yourChores'
import SelectChores from './selectChores';
import AddChore from './addChore';
import AllChores from './allChores';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [updateCounter, setUpdateCounter] = useState(0);
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const userName = localStorage.getItem('userName');

            if (userName == null) {
                navigate("/");
            } else
            {
                setUserName(userName);
            }

        } catch (error) {
            navigate("/");
        }
        

    }, [])

    return (
        <div id=".App">
            {userName && 
            <div>
                <YourChores updateCounter={updateCounter} setUpdateCounter={setUpdateCounter}/>
                <SelectChores updateCounter={updateCounter} setUpdateCounter={setUpdateCounter}/>
                <AddChore updateCounter={updateCounter} setUpdateCounter={setUpdateCounter}/>
                <AllChores updateCounter={updateCounter} setUpdateCounter={setUpdateCounter}/>
            </div>
            }
        </div>
        
    )
}

export default Home;