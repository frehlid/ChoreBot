// Select chores shows a list of chores (obtained from the server)
// the user can re order the chores in order of their preference
// there is a button at the bottom to send the ordered chores back to the server

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function SelectChores() {
  const [chores, setChores] = useState([]);
  const [allChores, setAllChores] = useState([]);
  const [newChoreName, setNewChoreName] = useState('');
  const [newChoreGroup, setNewChoreGroup] = useState('');
  const [choreCounts, setChoreCounts] = useState([])
  

  const choreGroups = ["Upstairs", "Main Floor", "Basement", "Main and Upstairs", "All"]

  const fetchChores = async () => {
    const userName = localStorage.getItem('userName');
    try {
     const response = await axios.get('/choresByUserGroup?name=' + userName);
     if (response.data.chores){
         setChores(response.data.chores)
     } else {
         console.error("Failed to fetch chores");
     }
    } catch (error) {
     console.error("Failed to fetch chores:", error);
    }
 };

  useEffect(() => {
    
    fetchChores();
    getAllChores();
    getLifetimeChores();
    
  }, []) // runs when component is mounted

  const handleOnDragEnd = (result) => {
    if (!result.destination) return; // If the item is dropped outside the list

    const items = Array.from(chores);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setChores(items);
  };

  const handleSubmit = async () => {
    // Retrieve the username from localStorage
    const userName = localStorage.getItem('userName');
    if (!userName) {
      alert('User not identified. Please log in.');
      return;
    }
  
    try {
      // Include the userName in the request payload
      await axios.post('/chores/updatePreferences', { "name":userName, "preferences":chores });
      alert('Chores order updated successfully!');
    } catch (error) {
      console.error('Failed to update chores:', error);
    }
  };

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
        window.location.reload()
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
        fetchChores();
        console.log(response);
        console.log("remove chore called");
        window.location.reload()
        
    } catch (error) {
        console.error('Failed to add new chore:', error);
    } 
  }

  const assignChores = async (e) => {
    e.preventDefault();
    try{
        const response = await axios.get('/assignChores');
        console.log(response)
        window.location.reload()

    } catch (e)
    {
        console.error(e);
    }
  }

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
  
  return (
    <div>
    <h3>Rank your chore preferences here:</h3>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="chores">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {chores.map((chore, index) => (
                <Draggable key={chore.id} draggableId={chore.id.toString()} index={index}>
                  {(provided) => (
                    <p
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {index + 1}. <b>{chore.group}</b>: {chore.name}
                    </p>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button className='button-4' onClick={handleSubmit}>Submit Preferences</button>
      <p></p>
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
    
        <button className="button-4" onClick={handleRemoveChore}>Remove Chore</button>
        <p></p>
        <button className="button-4" onClick={assignChores}>Assign Chores</button>
      </form>
      <h3>Here's what everyone else has been assigned:</h3>
      <ul>
        {allChores.map((chore, index) => (
          <li key={index}>
            {chore.assigned}  - <b>{chore.name}</b> - {chore.completed ? 'Completed' : 'Pending'} - <i>{chore.group}</i> 
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
    </div>
  );
}

export default SelectChores;
