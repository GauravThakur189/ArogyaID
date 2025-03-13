import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const ClaimSubmission = () => {
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    claimAmount: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('claimAmount', formData.claimAmount);
    data.append('description', formData.description);
    if (file) {
      data.append('document', file);
    }
    try {
      await axios.post('http://localhost:3000/api/claims', data, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting claim');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Submit Claim</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Name:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border text-gray-500 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Email:</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Claim Amount:</label>
            <input 
              type="number" 
              name="claimAmount" 
              value={formData.claimAmount} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border text-gray-500 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Description:</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Document:</label>
            <label className="block w-1/4 px-4 py-2 border border-gray-300 bg-gray-200 rounded-lg text-gray-700 cursor-pointer">
              {file ? file.name : 'Choose file'}
              <input 
                type="file" 
                name="document" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit Claim
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClaimSubmission;
