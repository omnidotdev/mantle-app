import { useCallback } from "react";

import type { OnChangeFn, SortingState } from "@tanstack/react-table";

type SortSearch = {
  sort_by?: string | undefined;
  sort_dir?: "asc" | "desc" | undefined;
};

const sortingFromSearch = (
  search: SortSearch,
  defaultSorting: SortingState,
): SortingState => {
  if (!search.sort_by || !search.sort_dir) return defaultSorting;
  return [{ id: search.sort_by, desc: search.sort_dir === "desc" }];
};

const searchFromSorting = (
  sorting: SortingState,
  defaultSorting: SortingState,
): SortSearch => {
  const next = sorting[0];
  const fallback = defaultSorting[0];

  if (!next) return { sort_by: undefined, sort_dir: undefined };

  if (fallback && next.id === fallback.id && next.desc === fallback.desc) {
    return { sort_by: undefined, sort_dir: undefined };
  }

  return { sort_by: next.id, sort_dir: next.desc ? "desc" : "asc" };
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
