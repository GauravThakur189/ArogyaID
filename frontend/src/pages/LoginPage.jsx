import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext.jsx';

const LoginPage = () => {
  const context = useContext(AuthContext);
  const { login } = context;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://arogyaid-1.onrender.com/api/auth/login', { email, password });
      login(res.data);
      if (res.data.user.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (res.data.user.role === 'insurer') {
        navigate('/insurer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 w-full  overflow-hidden">
      <div className="w-full max-w-7xl flex rounded-2xl overflow-hidden shadow-lg h-screen">
       
        <div className="flex-[2] bg-white p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">Login</h2>
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 text-black border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 text-black border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
       
        <div className="flex-[3] h-full">
          <img
            src="https://assets.grok.com/users/dda5b85d-7709-4811-aff0-8c429683c018/gZXlo7wx93WJF9NI-generated_image.jpg"
            alt="Decorative"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
