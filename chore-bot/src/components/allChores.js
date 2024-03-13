import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AllChores({ updateCounter, setUpdateCounter })
{
    const [allChores, setAllChores] = useState([]);
    const [choreCounts, setChoreCounts] = useState([])

    const getAllChores = async () => {
        try {
            const response = await axios.get('/allChores');
            var allChores = Array.from(response.data.chores)
            allChores.sort((a, b) => {
                if (a.assigned < b.assigned) return -1;
                if (a.assigned > b.assigned) return 1;
                return 0;
              });
            setAllChores(allChores);
        } catch (e) {
            console.error(e);
        }
      }
    
      const getLifetimeChores = async () => {
        try{
            const response = await axios.get('/choreCounts')
            setChoreCounts(response.data.counts)
        } catch (e)
        {
            console.error(e)
        }
      }

    useEffect(() => {
        getAllChores();
        getLifetimeChores();
      }, [updateCounter]) 

      return (
        <div>
            <h3>Here's what everyone else has been assigned:</h3>
            <ul>
                {allChores.map((chore, index) => (
                <li key={index}>
                    {chore.assigned}  - <b>{chore.name}</b> - {chore.isCompleted ? 'Completed' : 'Pending'} - <i>{chore.group}</i> 
                </li>
                ))}
            </ul>
            <h3>Here's everyone's lifetime chore count:</h3>
            <ul>
            {choreCounts.map((count, index) => (
                <li key={index}>
                    <b>{count.name}</b> -- {count.count}
                </li>

            ))
            }
            </ul>
      </div>)

}

export default AllChores;