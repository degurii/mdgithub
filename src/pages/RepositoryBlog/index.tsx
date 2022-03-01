import React from 'react';
import { useParams } from 'react-router-dom';

const toStr = (obj: Object) => JSON.stringify(obj, null, 2);
function RepositoryBlog() {
  const params = useParams();

  return (
    <>
      <div>Repository Blog.</div>
      <div>params: {toStr(params)}</div>
    </>
  );
}

export default RepositoryBlog;
