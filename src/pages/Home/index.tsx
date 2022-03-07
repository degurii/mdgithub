import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeHostFromGithubUrl } from '../../utils/url';

import InputBox from '../../components/InputBox';

type Props = {
  inputUrl: string;
  handleChangeInputUrl: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
