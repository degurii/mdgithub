import ReactMarkdown from 'react-markdown';

type Props = {
  data?: string;
  type?: 'markdown' | 'html';
};

function Article({ data, type }: Props) {
  if (!data) {
    return <div>로딩중</div>;
    // return (
    //   <div className="w-60 h-24 border-2 rounded-md mx-auto mt-20">
    //     <div className="flex animate-pulse flex-row items-center h-full justify-center space-x-5">
    //       <div className="w-12 bg-gray-300 h-12 rounded-full "></div>
    //       <div className="flex flex-col space-y-3">
    //         <div className="w-36 bg-gray-300 h-6 rounded-md "></div>
    //         <div className="w-24 bg-gray-300 h-6 rounded-md "></div>
    //       </div>
    //     </div>
    //   </div>
    // );
  }

  return type === 'markdown' ? (
    <article className="prose prose-slate break-all w-full">
      <ReactMarkdown>{data}</ReactMarkdown>
    </article>
  ) : (
    <article
      className="prose prose-stone break-all w-full"
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
}

export default Article;
