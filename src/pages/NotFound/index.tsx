import LinkButton from '../../components/LinkButton';

function NotFound() {
  return (
    <>
      <div className="min-h-full h-screen pb-32 flex flex-col bg-white">
        <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="text-center">
              <p className="text-2xl font-semibold text-indigo-600 uppercase tracking-wide">
                404 error
              </p>
              <h1 className="mt-2 text-6xl font-bold text-gray-900 tracking-tight sm:text-5xl">
                Page not found.
              </h1>
              <p className="mt-2 text-xl text-gray-500">
                주소가 잘못됐나봐요!!
              </p>
              <LinkButton to="/" className="mt-8 text-xl">
                홈으로
              </LinkButton>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
/*
function NotFound() {
  return (
    <>
      <div className="bg-white h-full min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="sm:flex">
            <p className="text-4xl font-extrabold text-indigo-600 sm:text-5xl">
              404
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                  Page not found
                </h1>
                <p className="mt-1 text-base text-gray-500">
                  Please check the URL in the address bar and try again.
                </p>
              </div>
              <div className="mt-10 flex sm:border-l sm:border-transparent sm:pl-6">
                <LinkButton to="/">홈으로</LinkButton>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
*/

export default NotFound;
