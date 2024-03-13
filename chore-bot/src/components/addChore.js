import React, { useState } from 'react';
import axios from 'axios';

function AddChore({ updateCounter, setUpdateCounter })
{
    const choreGroups = ["Upstairs", "Main Floor", "Basement", "Main and Upstairs", "All"]
    const [newChoreName, setNewChoreName] = useState('');
    const [newChoreGroup, setNewChoreGroup] = useState('');
    const [chores, setChores] = useState([]);

    const handleAddChore = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('/chores/add', {
                name: newChoreName,
                group: newChoreGroup
            });
            const newChore = response.data.chore; // server should only send chore if it applies to the user's group
            if (newChore) {
                setChores([...chores, newChore]);  
            }
            setNewChoreName('');
            setUpdateCounter(prevCounter => prevCounter + 1)
        } catch (error) {
            console.error('Failed to add new chore:', error);
        }
      }
    
      const handleRemoveChore = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/chores/remove', {
                name: newChoreName,
                group: newChoreGroup
            });
            setNewChoreName('');
            console.log(response);
            console.log("remove chore called");
            setUpdateCounter(prevCounter => prevCounter + 1)
            
        } catch (error) {
            console.error('Failed to add new chore:', error);
        } 
      }

      const assignChores = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.get('/assignChores');
            console.log(response)
            setUpdateCounter(prevCounter => prevCounter + 1)
        } catch (e)
        {
            console.error(e);
        }
      }

      return (     
        <form onSubmit={handleAddChore}>
        <input className='button-4'
          type="text"
          value={newChoreName}
          onChange={(e) => setNewChoreName(e.target.value)}
          placeholder="Enter new chore name"
        />
        <select className='button-4'
          value={newChoreGroup}
          onChange={(e) => setNewChoreGroup(e.target.value)}
          placeholder="Enter new chore group"
        > <option value="" disabled>Choose a group</option>
        {choreGroups.map(group => (
          <option key={group} value={group}>{group}</option>
        ))}
      </select>
        <button className="button-4" type="submit">Add Chore</button>
        <button className="button-4" onClick={handleRemoveChore}>Remove Chore</button>        <button className="button-4" onClick={assignChores}>Assign Chores</button>
      </form>)
}

export default AddChore;