// Login prompts the user for their name
// sends a request to the server to see if that name exists
//      if yes -> redirects to home page, stores name for later requests
//      if no -> prints error


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login()
{
    const [name, setName] = useState('') 
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault(); // stop from submitting automatically

        try {
            const response = await axios.get('/login?name=' + name)
            if (response.data.exists)
            {
                localStorage.setItem('userName', name); // store name in local storage
                navigate('/home'); // redirect to home page!
            } else {
                setError("Username not found. Please ensure your name is spelt correctly and try again.")
            }
        } catch (error) {
            setError("An error occurred while logging in. Please ensure your name is spelt correctly and try again. If this issue persists, contact Dieter.")
        }
    }


    return (
        <div>
          <form onSubmit={handleLogin}>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <button type="submit">Login</button>
          </form>
          {error && <p>{error}</p>}
        </div>
      );
}

export default Login;