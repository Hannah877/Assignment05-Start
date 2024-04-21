import Layout from "../components/layout";
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from "../components/sidebar";

export default function Home() {
  const movies = [
    { title: "Movie 1", imageUrl: "/image1.png" },
    { title: "Movie 2", imageUrl: "/image2.png" },
    { title: "Movie 3", imageUrl: "/image3.png" },
    { title: "Movie 4", imageUrl: "/image4.png" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-800">
      <Sidebar />

      <div className="flex-1">

        <div className="relative w-full h-[300px]">
          <Image
            src="/background1.png"
            alt="Featured Background"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <div className="absolute inset-0 flex items-center justify-center"> 
            <span className="text-gray-200 text-3xl">Discover and Rent your Favorite Videos Today!</span>
          </div>
        </div>
      
        <section className="mb-2 p-5 bg-gray-800">
          <h2 className="text-xl font-bold mb-4 text-white">Trending</h2>
          <div className="w-4"></div>
          <div className="flex space-x-4 overflow-auto">
            {movies.map((movie, index) => (
              <div key={index} className="flex-none w-[290px] h-[370px] relative rounded-lg border border-white">
                <Image src={movie.imageUrl} alt={movie.title} layout="fill" objectFit="cover" className="rounded-lg"/>
              </div>
            ))}
          </div>
        </section>

      </div>
      
    </div>
  );
}