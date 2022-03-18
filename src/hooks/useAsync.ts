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
  data: T | null;
  error: Error | null;
};

const createReducer =
  <T>() =>
  (prevState: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case ActionType.LOADING:
        return { ...prevState, loading: true };
      case ActionType.SUCCESS:
        return {
          loading: false,
          data: action.payload,
          error: null,
        };
      case ActionType.ERROR:
        return {
          loading: false,
          data: null,
          error: action.payload,
        };
      default:
        return prevState;
    }
  };

export const useAsync = <T>(
  fn: () => Promise<T>,
  deps: DependencyList = [],
): [State<T>, () => void] => {
  const [state, dispatch] = useReducer(createReducer<T>(), {
    loading: false,
    data: null,
    error: null,
  });

  const fetchData = useCallback(() => {
    dispatch({ type: ActionType.LOADING });
    try {
      fn().then((result) =>
        dispatch({
          type: ActionType.SUCCESS,
          payload: result,
        }),
      );
    } catch (error) {
      dispatch({
        type: ActionType.ERROR,
        payload: error as Error,
      });
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state, fetchData];
};
