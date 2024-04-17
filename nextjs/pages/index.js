import Layout from "../components/layout";
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to our DVD Rental Store.</h1>
      <Link href='/rental'>
        <div className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Rent your favorite videos today
        </div>
      </Link>
    </main>
  </Layout>
  );
}


