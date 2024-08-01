import Image from "next/image";
import WeatherApp from "@/components/WeatherApp";
export default function Home() {
  return (
    <>
      <h1 className='text-2xl font-bold mb-5'>Welcomee</h1>
      <p className='mb-5'>
        This is the demo site for Traversy Media's Next.js & Clerk tutorial. Go
        ahead and sign up or sign in!
      </p>
    </>
  );
}
