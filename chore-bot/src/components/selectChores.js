// Select chores shows a list of chores (obtained from the server)
// the user can re order the chores in order of their preference
// there is a button at the bottom to send the ordered chores back to the server

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function SelectChores() {
  const [chores, setChores] = useState([]);

  useEffect(() => {
    const fetchChores = async () => {
       try {
        const response = await axios.get('/chores');
        if (response.data.exists){
            setChores(response.data.chores)
        } else {
            console.error("Failed to fetch chores");
        }
       } catch (error) {
        console.error("Failed to fetch chores:", error);
       }
    };
    
    fetchChores();
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
      await axios.post('/api/chores/update', { userName, chores });
      alert('Chores order updated successfully!');
    } catch (error) {
      console.error('Failed to update chores:', error);
    }
  };
  
  return (
    <div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="chores">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {chores.map((chore, index) => (
                <Draggable key={chore.id} draggableId={chore.id.toString()} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {chore.name}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={handleSubmit}>Submit Order</button>
    </div>
  );
}

export default SelectChores;
