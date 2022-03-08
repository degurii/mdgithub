import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRateLimit } from '../../apis/services/github';

import InputBox from '../../components/InputBox';

type Props = {
  inputUrl: string;
  handleChangeInputUrl: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const removeHostFromGithubUrl = (url: string) => {
  const urlWithoutProtocol = url.replace(/^https:\/\//, '');
  const [host, ...rest] = urlWithoutProtocol.split('/');

  if (host !== 'github.com') {
    return null;
  }
  return '/' + rest.join('/');
};

function Home({ inputUrl, handleChangeInputUrl }: Props) {
  const navigate = useNavigate();
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const url = removeHostFromGithubUrl(inputUrl);
      if (url === null) {
        navigate('404-not-found');
      } else {
        navigate(url);
      }
    }
  };

  useEffect(() => {
    getRateLimit().then(({ data }) => {
      console.log('rate limit:', data);
    });
  });
  return (
    <div className="relative pt-36 pb-16 sm:pb-24">
      <main className="mt-16 mx-auto px-4 ">
        <h1 className="text-center text-5xl sm:text-7xl tracking-tight font-extrabold text-gray-900">
          <span className="block select-none">
            Github <span className="text-indigo-500">TIL</span>
          </span>
        </h1>
        <div className="mt-9 sm:mt-14 relative flex items-center justify-center">
          <InputBox
            focus
            value={inputUrl}
            onChange={handleChangeInputUrl}
            onKeyPress={handleKeyPress}
            placeholder="Github Repository URL 입력"
          />
        </div>
      </main>
    </div>
  );
}

export default Home;
