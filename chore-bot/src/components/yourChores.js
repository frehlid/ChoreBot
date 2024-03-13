// Your chores is a list of your assigned chores.
// it should present the chores in a check-box style list and notify the server when a user checks a chore off

import React, { useState, useEffect } from 'react';
import axios from 'axios';


function YourChores({ updateCounter, setUpdateCounter })
{
    const [chores, setChores] = useState([]);
    const [userName, setUserName] = useState("")


    useEffect(() => {
        const fetchChores = async () => {
            try {
                const userName = localStorage.getItem('userName');
                setUserName(userName);
                const response = await axios.get('/chores?name=' + userName);
                console.log(response.data.chores)
                setChores(response.data.chores); // Assuming the server responds with an array of chores
            } catch (error) {
              console.error('Failed to fetch chores:', error);
            }
        };
        
        fetchChores();
    }, [updateCounter]);

    const handleCheck = async (choreId, isChecked) => {
        try {
          const userName = localStorage.getItem('userName');
          await axios.post('/chores/updateStatus', {
            name:userName,
            id:choreId,
            isCompleted:isChecked,
          });
          const updatedChores = chores.map(chore => 
            chore.id === choreId ? { ...chore, isCompleted: isChecked } : chore
          );
          
          setChores(updatedChores);
          setUpdateCounter(prevCounter => prevCounter + 1)
        } catch (error) {
            console.error('Failed to update chore status:', error);
        }
    };
    return (
        <div>
          <h3>{userName}, your currently assigned chores are:</h3>
          <div>
            {chores.map((chore) => (
              <p key={chore.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={chore.completed}
                    onChange={(e) => handleCheck(chore.id, e.target.checked)}
                  />
                  {chore.name}
                </label>
              </p>
            ))}
          </div>
        </div>
      );
}

export default YourChores