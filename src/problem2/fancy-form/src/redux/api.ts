import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiTags = {
  coinList: 'api.coinList',
  historicalData: 'api.historicalData',
} as const;

export type ApiTag = (typeof apiTags)[keyof typeof apiTags];

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
});

export type ApiBaseQuery = typeof baseQuery;

export const api = createApi({
  baseQuery: baseQuery,
  tagTypes: [...Object.values(apiTags)],
  endpoints: () => ({
    // logOut: builder.mutation<{ [key: string]: any }, void>({
    //   query: () => ({
    //     url: '/user/logout',
    //     method: 'POST',
    //   }),
    //   invalidatesTags: [apiTags.user, apiTags.script, apiTags.command],
    // }),
  }),
});

// export const { useLogOutMutation } = api;

// export const { logOut } = api.endpoints;
