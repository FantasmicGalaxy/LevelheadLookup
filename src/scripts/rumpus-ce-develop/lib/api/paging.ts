import { capitalize } from "../utility";
import RumpusCE from "../RumpusCE";

interface BaseQueryAuto {
  nextPageToken?: string;
  paging?: boolean;
}

interface BaseQueryManual {
  limit?: number;
  sort?: string;
  tiebreakerItemId?: string;
}

interface BaseQuery extends BaseQueryAuto, BaseQueryManual {}

interface Item {
  _id: string;
}

/** An array that incluedes a `nextPage()` function, representing a "page" of search results. */
export interface ResultsPage<t> extends Array<t> {
  /** Fetch the next page of results from the API. */
  nextPage(): Promise<ResultsPage<t>>;
}

/** Return a ResultsPage whose `nextPage()` method always returns an empty ResultsPage. For exhausted searches. */
export async function blankResultsPage() {
  const results = [] as ResultsPage<never>;
  results.nextPage = blankResultsPage;
  return results;
}

interface SearchFunction {
  call<item extends Item, query extends BaseQuery, options>(
    client: RumpusCE,
    query?: query,
    options?: options
  ): Promise<ResultsPage<item>>;
}

export function addNextPageSearchFunction<
  item extends Item,
  query extends BaseQuery,
  options
>(
  client: RumpusCE,
  page: ResultsPage<item>,
  nextLink: string | undefined,
  query: query,
  options: options,
  search: SearchFunction
) {
  page.nextPage = blankResultsPage;
  const hasNextPage =
    page.length && (nextLink || !query?.limit || query.limit == page.length);

  if (hasNextPage) {
    if (nextLink) {
      // Then continue using server-based paging
      const nextPageToken = nextLink.replace(
        /.*nextPageToken=([a-z0-9]+).*?/i,
        "$1"
      );
      page.nextPage = () =>
        search.call(client, { nextPageToken, paging: true }, options);
    } else {
      const queryParams = { ...query } as BaseQueryManual;
      // Then need "manual" paging, based on the last-returned result and the sorting mechanism.
      const sortParam = queryParams.sort || "";
      const lastLevel = page[page.length - 1];
      const sortField = sortParam.replace(/^-/, "");
      // Need to set a min/max based on the sort field and direction to get to the next page of results.
      // A '-' prefix means the sort is ASCENDING, while default is DESCENDING.
      let skipFilter = sortParam[0] == "-" ? "min" : "max";
      skipFilter += capitalize(sortField);
      queryParams[skipFilter] =
        lastLevel[sortField] || lastLevel.stats?.[sortField];
      if (typeof queryParams[skipFilter] != "undefined") {
        queryParams.tiebreakerItemId = lastLevel._id;
        page.nextPage = () => search.call(client, queryParams, options);
      }
    }
  }
  return page;
}
