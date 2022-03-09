import React from 'react';
import { MenuAlt2Icon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { RepoParams } from '../../pages/TIL';

type Props = {
  openSidebar: () => void;
  repoParams?: RepoParams;
};
function Header({ openSidebar, repoParams }: Props) {
  return (
    <header className="mx-auto flex-none w-full border-b-2 border-gray-100 py-4">
      <div className="flex justify-between items-center px-4">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <button
            type="button"
            className="border-gray-200 px-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={openSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          {repoParams ? (
            <Link
              to={`/${repoParams.owner}/${repoParams.repo}`}
              className="prose prose-h1:text-2xl ml-2"
            >
              <h1>
                <span className="text-indigo-500">{repoParams.owner} /</span>
                <span> {repoParams.repo}</span>
              </h1>
            </Link>
          ) : (
            // 여긴 스켈레톤 넣어
            <div></div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;