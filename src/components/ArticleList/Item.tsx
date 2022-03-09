import React from 'react';
import { Link } from 'react-router-dom';
import { GitBlob } from '../../pages/TIL';

type Props = {
  blob: GitBlob;
  createBlobUrl: (path: string) => string;
};

function Item({ blob, createBlobUrl }: Props) {
  return <Link to={createBlobUrl(blob.path)}>{blob.name}</Link>;
}

export default React.memo(Item);
