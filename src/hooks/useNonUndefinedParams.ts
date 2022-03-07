import { useParams } from 'react-router-dom';

export const useNonUndefinedParams = <T = {}>() => {
  const params = useParams() as unknown as Readonly<T>;
  return params;
};
