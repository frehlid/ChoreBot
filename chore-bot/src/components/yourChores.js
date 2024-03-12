// Your chores is a list of your assigned chores.
// it should present the chores in a check-box style list and notify the server when a user checks a chore off

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function YourChores()
{
    const [chores, setChores] = useState([]);

    useEffect(() => {
        const fetchChores = async () => {
            try {
                const userName = localStorage.getItem('userName');
                const response = await axios.get('/chores?user={userName}');
                setChores(response.data.chores); // Assuming the server responds with an array of chores
            } catch (error) {
              console.error('Failed to fetch chores:', error);
            }
          };
      
          fetchChores();
    }, []);

    const handleCheck = async (choreId, isChecked) => {
        try {
          const userName = localStorage.getItem('userName');
          await axios.post('/api/chores/updateStatus', {
            userName,
            choreId,
            isChecked,
          });
        } catch (error) {
            console.error('Failed to update chore status:', error);
        }
    };
    return (
        <div>
          <h2>Your Chores</h2>
          <ul>
            {chores.map((chore) => (
              <li key={chore.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={chore.completed}
                    onChange={(e) => handleCheck(chore.id, e.target.checked)}
                  />
                  {chore.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      );
}