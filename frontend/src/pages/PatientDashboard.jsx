import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const res = await axios.get('https://arogyaid-1.onrender.com/api/claims', {
        headers: { Authorization: `Bearer ${auth.token}` }
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
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Patient Dashboard</h2>
          <Link 
            to="/patient/submit" 
            className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            Submit New Claim
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg 
              className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600" 
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
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {claims.map(claim => (
                  <tr 
                    key={claim._id} 
                    className={
                      claim.status === "Pending"
                        ? "border-l-4 border-yellow-500"
                        : claim.status === "Approved"
                        ? "border-l-4 border-green-500"
                        : claim.status === "Rejected"
                        ? "border-l-4 border-red-500"
                        : ""
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${claim.claimAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(claim.submissionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        to={`/patient/claims/${claim._id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                      >
                        View
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

export default PatientDashboard;
