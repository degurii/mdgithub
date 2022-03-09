import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { GitTree } from '../../pages/Repository';
import Item from './Item';

type Props = {
  closeSidebar: () => void;
  createTreeUrl: (path: string, isRoot?: boolean) => string;
  isSidebarOpen: boolean;
  rootTree?: GitTree;
};
function Sidebar({
  closeSidebar,
  createTreeUrl,
  isSidebarOpen,
  rootTree,
}: Props) {
  const isLoading = !rootTree;

  return (
    <>
      {/* Sidebar for Mobile */}
      <Transition.Root show={isSidebarOpen} as={Fragment}>
        <Dialog
          as="aside"
          className="fixed inset-0 z-40 flex lg:hidden"
          onClose={closeSidebar}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative max-w-xs w-full bg-white pt-5 pb-4 flex-1 flex flex-col">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={closeSidebar}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>

              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {isLoading ? (
                    <div>로딩중</div>
                  ) : (
                    <Item
                      createTreeUrl={createTreeUrl}
                      level={0}
                      tree={rootTree}
                    />
                  )}
                </nav>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <aside className="hidden lg:shrink-0 lg:flex lg:w-80 lg:flex-col lg:inset-y-0">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="border-r border-gray-200 pt-5 flex flex-col flex-grow bg-white overflow-y-auto">
          <div className="flex-grow mt-5 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {isLoading ? (
                <div>로딩중</div>
              ) : (
                <Item createTreeUrl={createTreeUrl} level={0} tree={rootTree} />
              )}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
