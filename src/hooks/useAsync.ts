import { useCallback, useEffect, useReducer } from 'react';
import type { DependencyList } from 'react';

const enum ActionType {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

type Action<T> =
  | { type: ActionType.LOADING }
  | { type: ActionType.SUCCESS; payload: T }
  | { type: ActionType.ERROR; payload: Error };

type State<T> = {
  loading: boolean;
  data?: T;
  error?: Error;
};

const createReducer =
  <T>() =>
  (prevState: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case ActionType.LOADING:
        return { loading: true };
      case ActionType.SUCCESS:
        return {
          loading: false,
          data: action.payload,
        };
      case ActionType.ERROR:
        return {
          loading: false,
          error: action.payload,
        };
      default:
        return prevState;
    }
  };

export const useAsync = <T = any>(
  fn: () => Promise<T>,
  deps: DependencyList = [],
): [State<T>, () => void] => {
  const [state, dispatch] = useReducer(createReducer<T>(), {
    loading: false,
  });

  const fetchData = useCallback(() => {
    dispatch({ type: ActionType.LOADING });
    fn()
      .then((result) =>
        dispatch({
          type: ActionType.SUCCESS,
          payload: result,
        }),
      )
      .catch((error) => dispatch({ type: ActionType.ERROR, payload: error }));
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state, fetchData];
};
