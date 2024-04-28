import Layout from '../components/layout';
import React, { useState, Fragment } from 'react';
import Link from 'next/link';
import Sidebar from "../components/sidebar";

export default function Rental() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [videoTitles, setVideoTitles] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const videos = videoTitles.split(',').map(title => title.trim());

    const payload = {
      firstName,
      lastName,
      videos,
      staff_id: 1,
      rental_period: 5,
    };

    try {
      const response = await fetch('http://localhost:8000/rental', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setConfirmation(data.message);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-800">
      <Sidebar />
      
      <div className="flex-1 flex items-center justify-center">

        {confirmation ? (
          <div className="text-white p-10 bg-gray-700 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Confirmation</h2>
            {confirmation.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line} <br />
              </React.Fragment>
            ))}
            <button onClick={() => setConfirmation('')} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Close
            </button>
          </div>
        ) : (
          <div className="w-full max-w-lg">
            <h1 className="text-3xl font-bold mb-4 text-white text-center">Customer and Rental Management</h1>
            <form onSubmit={handleSubmit} className="bg-gray-700 p-10 rounded-lg">

              {/* add customer first name*/}
              <div className="flex flex-wrap mb-6">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2">
                    Customer First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter customer first name"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    required
                  />
                </div>
              </div>

              {/* add customer last name*/}
              <div className="flex flex-wrap mb-6">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2">
                    Customer Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter customer last name"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    required
                  />
                </div>
              </div>

              {/* rent videos */}
              <div className="flex flex-wrap mb-6">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2">
                    Video Title 
                  </label>
                  <input
                    type="text"
                    value={videoTitles}
                    onChange={(e) => setVideoTitles(e.target.value)}
                    placeholder="e.g. Inception, Titanic"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    required
                  />
                </div>
              </div>

              {/* submit button */}
              <div className="flex flex-wrap mb-6">
                <div className="w-full px-3">
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                    Rent Video
                  </button>
                </div>
              </div>

            </form> 
            </div>
           )}
        </div>
      </div>
  );
}
