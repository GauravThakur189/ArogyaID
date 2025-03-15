import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const ClaimDetail = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [claim, setClaim] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    approvedAmount: '',
    insurerComments: ''
  });
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [zoom, setZoom] = useState(1);
  const navigate = useNavigate();

  const fetchClaim = async () => {
    try {
      const res = await axios.get('https://arogyaid-1.onrender.com/api/claims', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      const found = res.data.find((c) => c._id === id);
      if (found) {
        setClaim(found);
        setFormData({
          status: found.status,
          approvedAmount: found.approvedAmount || '',
          insurerComments: found.insurerComments || ''
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching claim detail', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaim();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`https://arogyaid-1.onrender.com/api/claims/${id}`, formData, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setClaim(res.data);
      alert('Claim updated successfully!');
      navigate('/insurer/dashboard');
    } catch (error) {
      console.error('Error updating claim', error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  if (!claim)
    return <p className="text-center text-red-600 mt-8">Claim not found</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Review &amp; Update Claim</h2>
        <div className="mb-6 space-y-2">
          <p>
            <strong className="text-gray-700">Name:</strong>{' '}
            <span className="text-gray-900">{claim.name}</span>
          </p>
          <p>
            <strong className="text-gray-700">Email:</strong>{' '}
            <span className="text-gray-900">{claim.email}</span>
          </p>
          <p>
            <strong className="text-gray-700">Claim Amount:</strong>{' '}
            <span className="text-gray-900">${claim.claimAmount}</span>
          </p>
          <p>
            <strong className="text-gray-700">Description:</strong>{' '}
            <span className="text-gray-900">{claim.description}</span>
          </p>
          {claim.document && (
            <div className="mt-2">
              <button
                onClick={() => setPreviewVisible(true)}
                className="text-blue-600 hover:underline font-medium"
              >
                View Document
              </button>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select status</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Approved Amount:</label>
            <input
              type="number"
              name="approvedAmount"
              value={formData.approvedAmount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Comments:</label>
            <textarea
              name="insurerComments"
              value={formData.insurerComments}
              onChange={handleChange}
              className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Update Claim
          </button>
        </form>
      </div>

     
      {previewVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={`https://arogyaid-1.onrender.com/${claim.document}`}
              alt="Claim Document"
              style={{ transform: `scale(${zoom})` }}
              className="max-h-screen max-w-full transition-transform duration-300 cursor-zoom-in"
            />
            
            <button
              onClick={() => {
                setPreviewVisible(false);
                setZoom(1);
              }}
              className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
            >
             
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
           
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}
                className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700"
              >
                -
              </button>
              <button
                onClick={() => setZoom(1)}
                className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700"
              >
                Reset
              </button>
              <button
                onClick={() => setZoom((prev) => prev + 0.1)}
                className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimDetail;
