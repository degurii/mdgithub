type Props = {
  children: React.ReactNode;
};
function MainContent({ children }: Props) {
  return (
    <main className="flex flex-1 justify-center pl-20 pr-4 pt-16 py-6 sm:px-6">
      {children}
    </main>
  );
}

export default MainContent;
