import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 bg-black bg-opacity-40 text-white flex flex-col">
      <div className="flex flex-col items-center py-10">
        <h1 className="text-xl font-bold mb-10">DVD Rental</h1>
        <nav className="flex flex-col w-full px-5">
          <Link href="/" className="mb-5 text-gray-300 hover:text-gray-100">Home</Link>
          <Link href="/rental" className="mb-5 text-gray-300 hover:text-gray-100">Rent</Link>
          <Link href="/CanadianCustomers" className="mb-5 text-gray-300 hover:text-gray-100">View Canadian Customers</Link>
          <Link href="/AmericanCustomers" className="text-gray-300 hover:text-gray-100">View American Customers</Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
