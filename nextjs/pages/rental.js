import Layout from '../components/layout';
import { useState } from 'react';
import Link from 'next/link';
import Sidebar from "../components/sidebar";

export default function Rental() {
  const [customer, setCustomer] = useState('');
  const [video, setVideo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Customer: ${customer}, Video: ${video}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-800">
      <Sidebar />
      
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-white text-center">Customer and Video Rental Management</h1>

            <form onSubmit={handleSubmit} className="bg-gray-700 p-10 rounded-lg">

            <div className="flex flex-wrap mb-6">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="Enter customer name"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap mb-6">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  value={video}
                  onChange={(e) => setVideo(e.target.value)}
                  placeholder="Enter video title"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap mb-6">
              <div className="w-full px-3">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Rent Video
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
