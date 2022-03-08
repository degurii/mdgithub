type Props = {
  children: React.ReactNode;
};
function MainContent({ children }: Props) {
  return (
    <main className="flex flex-1 justify-center pt-16 py-6 px-6 lg:px-8">
      {children}
    </main>
  );
}

export default MainContent;
