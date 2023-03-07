
type Query = {
    page: number | 1;
    limit: number | 0;
    order: string | 'asc' | 'desc';
    filter: string;
    skip: number;
}

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPaginatedQuery(query: Partial<Query>) {
    query.page = Math.abs(query.page || DEFAULT_PAGE_NUMBER); // 1 is the default page
    query.limit = Math.abs(query.limit || DEFAULT_PAGE_LIMIT); // 0 means no limit for mongoose it will return all the data
    query.order = query.order || 'asc'; // asc or desc
    query.filter = query.filter || ''; // filter by msg_id
    query.skip = (query.page - 1) * query.limit; // skip the first n documents

    return query; // return the query object
}

export default getPaginatedQuery;