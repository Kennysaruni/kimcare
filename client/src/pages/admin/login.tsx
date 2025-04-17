import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useLocation } from 'wouter';

// Type for the API response (based on the expected shape)
interface LoginResponse {
  success: boolean;
  token: string;
}

export default function Login() {
  // State variables with proper types
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  // useLocation hook from Wouter
  const [_, navigate] = useLocation(); 

  // Submit handler with typed event
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Axios request with response type
      const res = await axios.post<LoginResponse>('http://localhost:5000/api/login',
        { username, password },
        { withCredentials: true }
      );
      
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify({username}))
        console.log("Navigating....")
        navigate('/admin/content');
      }
      else{
        setError("Login failed, Please try again")
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 mb-10 p-6 border rounded">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button className="bg-blue-600 text-white p-2 rounded" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
