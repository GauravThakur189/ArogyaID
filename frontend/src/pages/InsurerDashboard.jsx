import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

const InsurerDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    claimAmount: '',
    startDate: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/claims', {
        headers: { Authorization: `Bearer ${auth.token}` },
        params: filters
      });
      setClaims(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching claims', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  
  const getBorderClasses = (status) => {
    let colorClass = 'border-blue-500'; 
    if (status === 'Pending') colorClass = 'border-yellow-500';
    else if (status === 'Approved') colorClass = 'border-green-500';
    else if (status === 'Rejected') colorClass = 'border-red-500';
    return `border-l-4 border-b-2 ${colorClass}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Insurer Dashboard</h2>
        
       
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Status</label>
              <select 
                name="status" 
                value={filters.status} 
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Claim Amount</label>
              <input 
                type="number" 
                name="claimAmount" 
                value={filters.claimAmount} 
                onChange={handleFilterChange} 
                placeholder="e.g. 500" 
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Start Date</label>
              <input 
                type="date" 
                name="startDate" 
                value={filters.startDate} 
                onChange={handleFilterChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
              />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg 
              className="animate-spin -ml-1 mr-3 h-12 w-12 text-blue-600" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <span className="text-xl text-gray-600">Loading...</span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Submission Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {claims.map(claim => (
                  <tr key={claim._id} className={`hover:bg-gray-100 ${getBorderClasses(claim.status)}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${claim.claimAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(claim.submissionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        to={`/insurer/claims/${claim._id}`} 
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsurerDashboard;
