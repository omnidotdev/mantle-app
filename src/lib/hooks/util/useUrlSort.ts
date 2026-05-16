import { useCallback } from "react";

import type { OnChangeFn, SortingState } from "@tanstack/react-table";

type SortSearch = {
  sortBy?: string | undefined;
  sortDir?: "asc" | "desc" | undefined;
};

const sortingFromSearch = (
  search: SortSearch,
  defaultSorting: SortingState,
): SortingState => {
  if (!search.sortBy || !search.sortDir) return defaultSorting;
  return [{ id: search.sortBy, desc: search.sortDir === "desc" }];
};

const searchFromSorting = (
  sorting: SortingState,
  defaultSorting: SortingState,
): SortSearch => {
  const next = sorting[0];
  const fallback = defaultSorting[0];

  if (!next) return { sortBy: undefined, sortDir: undefined };

  if (fallback && next.id === fallback.id && next.desc === fallback.desc) {
    return { sortBy: undefined, sortDir: undefined };
  }

  return { sortBy: next.id, sortDir: next.desc ? "desc" : "asc" };
};

type UseUrlSortArgs = {
  search: SortSearch;
  defaultSorting: SortingState;
  navigate: (updater: {
    search: (prev: Record<string, unknown>) => Record<string, unknown>;
  }) => void;
};

const useUrlSort = ({
  search,
  defaultSorting,
  navigate,
}: UseUrlSortArgs): [SortingState, OnChangeFn<SortingState>] => {
  const sorting = sortingFromSearch(search, defaultSorting);

  const setSorting: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const params = searchFromSorting(next, defaultSorting);
      navigate({
        search: (prev) => ({ ...prev, ...params }),
      });
    },
    [sorting, defaultSorting, navigate],
  );

  return [sorting, setSorting];
};

export { sortingFromSearch, searchFromSorting, useUrlSort };
export type { SortSearch };
