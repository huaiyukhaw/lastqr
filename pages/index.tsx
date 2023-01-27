import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>LastQR - Create QR menus for your restaurant</title>
        <meta name="description" content="Create menus QR using LastQR" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <Image
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
              alt="Restaurant image"
              layout="fill"
            />
          </div>
          <div className="absolute inset-0 bg-black/75 mix-blend-multiply" />
        </div>
        <div className="relative flex min-h-screen items-center justify-center">
          <div className="mx-auto w-full max-w-5xl text-center">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-white sm:text-6xl sm:leading-[1.1]">
                Create QR menus for your restaurant
              </h1>
            </div>
            <div className="mb-12">
              <div className="mx-auto max-w-xl">
                <p className="text-lg leading-6 text-gray-300 sm:text-[1.4rem] sm:leading-[1.4]">
                  LastQR is the solution that has everything you need to
                  manage your restaurant menu.
                </p>
              </div>
            </div>
            <Link href="/signup">
              <a className="mx-auto w-fit rounded-lg bg-indigo-600 px-8 py-3 text-lg font-medium text-white drop-shadow-xl hover:bg-indigo-700">
                Get Started - It&apos;s free
              </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
