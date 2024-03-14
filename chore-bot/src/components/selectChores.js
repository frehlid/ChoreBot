// Select chores shows a list of chores (obtained from the server)
// the user can re order the chores in order of their preference
// there is a button at the bottom to send the ordered chores back to the server

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Divider, Typography, Button } from 'antd';
const { Title, Paragraph, Text} = Typography;

function SelectChores({ updateCounter, setUpdateCounter }) {
  const [chores, setChores] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  
  const fetchChores = async () => {
    const userName = localStorage.getItem('userName');
    try {
     const response = await axios.get('/choresByUserGroup?name=' + userName);
     console.log("CHORES")
     console.log(response.data.chores)
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
    
  }, [updateCounter]) // runs when component is mounted

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
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 2500);
    } catch (error) {
      console.error('Failed to update chores:', error);
    }
  };

  
  return (
    <Typography>
    <Title level={3}>Rank your chore preferences here:</Title>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="chores">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {chores.map((chore, index) => (
                <Draggable key={chore.id} draggableId={chore.id.toString()} index={index}>
                  {(provided) => (
                    <Paragraph
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {index + 1}. <b>{chore.group}</b>: {chore.name}
                    </Paragraph>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button onClick={handleSubmit}>Submit Preferences</Button>
      {isVisible && <Text>    Preferences updated successfully!</Text>}
      <Divider></Divider>

      
    </Typography>
  );
}

export default SelectChores;
