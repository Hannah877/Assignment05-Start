import Layout from '../components/layout';
import { useState } from 'react';
import Link from 'next/link';

export default function Rental() {
  const [customer, setCustomer] = useState('');
  const [video, setVideo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Customer: ${customer}, Video: ${video}`);
  };

  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-center p-12">
        <h1 className="text-3xl font-bold mb-4">Customer and Video Rental Management</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="flex flex-wrap mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
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
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
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

        <Link href='/'>
          <div className="text-blue-600 hover:underline">Go back to homepage</div>
        </Link>
      </main>
    </Layout>
  );
}
