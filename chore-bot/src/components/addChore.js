import React, { useState } from 'react';
import axios from 'axios';

import { Divider , Button, Input, Dropdown, Menu} from 'antd';


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

      const menu = (
        <Menu onClick={(e) => setNewChoreGroup(e.key)}>
          <Menu.Item key="" disabled>Choose a group</Menu.Item>
          {choreGroups.map(group => (
            <Menu.Item key={group}>{group}</Menu.Item>
          ))}
        </Menu>
      );
    

      return (     
        <form onSubmit={handleAddChore}>
        <Input
          className='maxWidth margin'
          type="text"
          value={newChoreName}
          onChange={(e) => setNewChoreName(e.target.value)}
          placeholder="Enter new chore name"
        />
        <Dropdown overlay={menu} trigger={['click']}>
            <Button className='margin'>
            {newChoreGroup || "Choose a group"}
            </Button>
        </Dropdown>
        <br/>
        <Button className='margin' type='primary' htmlType="submit">Add Chore</Button>
        <Button className='margin' danger onClick={handleRemoveChore}>Remove Chore</Button>      
        <Button className='margin' onClick={assignChores}>Assign Chores</Button>
        <Divider></Divider>
      </form>)
}

export default AddChore;