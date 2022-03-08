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
                주소가 잘못됐나 봐요!!
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

export default NotFound;
