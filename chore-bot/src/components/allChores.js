import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Divider, Typography } from 'antd';
const { Title } = Typography;

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
        <Typography>
            <Title level={3}>Here's what everyone else has been assigned:</Title>
            <ul>
                {allChores.map((chore, index) => (
                <li key={index}>
                    {chore.assigned}  - <b>{chore.name}</b> - {chore.isCompleted ? 'Completed' : 'Pending'} - <i>{chore.group}</i> 
                </li>
                ))}
            </ul>
            <Title level={3}>Here's everyone's lifetime chore count:</Title>
            <ul>
            {choreCounts.map((count, index) => (
                <li key={index}>
                    <b>{count.name}</b> -- {count.count}
                </li>

            ))
            }
            </ul>
            <Divider />
      </Typography>)

}

export default AllChores;