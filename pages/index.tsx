import type { NextPage } from "next";
import Head from "next/head";
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
      <main>
        <div className="px-[5%] pt-32">
          <div className="mx-auto w-full max-w-5xl text-center">
            <div className="mb-6">
              <h1 className="text-4xl font-bold sm:text-6xl sm:leading-[1.1]">
                Create QR menus for your restaurant
              </h1>
            </div>
            <div className="mb-12">
              <div className="mx-auto max-w-xl">
                <p className="text-lg leading-6 text-gray-800 dark:text-gray-300 sm:text-[1.4rem] sm:leading-[1.4]">
                  LastQR is the cloud solution that has everything you need to
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
