import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const PatientClaimDetail = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/claims/${id}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setClaim(res.data);
      } catch (error) {
        console.error('Error fetching claim details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClaim();
  }, [id, auth.token]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  if (!claim)
    return <p className="text-center text-red-600 mt-8">Claim not found</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Claim Details</h2>
        <div className="flex flex-col md:flex-row">
         
          <div className="md:w-1/2 space-y-4">
            <p>
              <span className="font-semibold text-gray-700">Name:</span>{' '}
              <span className="text-gray-900">{claim.name}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-700">Email:</span>{' '}
              <span className="text-gray-900">{claim.email}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-700">Claim Amount:</span>{' '}
              <span className="text-gray-900">${claim.claimAmount}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-700">Description:</span>{' '}
              <span className="text-gray-900">{claim.description}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-700">Status:</span>{' '}
              <span className="text-gray-900">{claim.status}</span>
            </p>
            {claim.approvedAmount && (
              <p>
                <span className="font-semibold text-gray-700">Approved Amount:</span>{' '}
                <span className="text-gray-900">${claim.approvedAmount}</span>
              </p>
            )}
            {claim.insurerComments && (
              <p>
                <span className="font-semibold text-gray-700">Insurer Comments:</span>{' '}
                <span className="text-gray-900">{claim.insurerComments}</span>
              </p>
            )}
            <div className="mt-6">
              <Link
                to="/patient/dashboard"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
         
          {claim.document && (
            <div className="md:w-1/2 mt-6 md:mt-0 md:pl-8 flex justify-center items-center">
              <img
                src={`http://localhost:3000/${claim.document}`}
                alt="Claim Document"
                className="max-w-1/2 h-auto rounded cursor-pointer shadow-lg"
                onClick={() => setShowFullImage(true)}
              />
            </div>
          )}
        </div>
      </div>
     
      {showFullImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={`http://localhost:3000/${claim.document}`}
              alt="Full Size Document"
              className="max-h-full max-w-full rounded shadow-2xl"
            />
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientClaimDetail;
