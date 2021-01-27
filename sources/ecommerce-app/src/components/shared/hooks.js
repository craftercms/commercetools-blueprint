/*
 * Copyright (C) 2007-2021 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { fetchQuery } from '../../util/content';
import { postsQuery } from './queries.graphql';
import { parseDescriptor, preParseSearchResults } from '@craftercms/content';
import { useGlobalContext } from './context';
import { useLocation } from 'react-router-dom';
import { parse } from 'query-string';
import { crafterConfig, createResource } from './utils';
import { createQuery, search } from '@craftercms/search';
import { map } from 'rxjs/operators';

const defaultPaginationData = {
  itemsPerPage: 3,
  currentPage: 0
};

export const neverResource = createResource(() => new Promise(() => void 0));

const reducer = (state, nextState) => {
  return { ...state, ...nextState };
};

export function useSpreadState(initializerArg, initializer) {
  return useReducer(reducer, initializerArg, initializer);
}

export function usePosts(paginationData = defaultPaginationData, slug) {
  const [posts, setPosts] = useState();

  useEffect(() => {
    fetchQuery(
      { text: postsQuery },
      {
        postsLimit: paginationData.itemsPerPage,
        postsOffset: (paginationData.currentPage * paginationData.itemsPerPage),
        slug
      }
    ).then(({ data }) => {
      setPosts({
        items: parseDescriptor(data.post.items),
        total: data.post.total,
        pageCount: Math.ceil(data.post.total/paginationData.itemsPerPage)
      });
    });
  }, [paginationData]);

  return posts;
}

export function useCategories() {
  const [{ categories, categoriesLoading }, update] = useGlobalContext();
  const destroyedRef = useRef(false);

  useEffect(() => {
    return () => {
      destroyedRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (!categories && !categoriesLoading) {
      update({ categoriesLoading: true });
      fetchQuery({
        text: `
          query Blog {
            categories: taxonomy {
              items {
                file__name(filter:{matches:"category.xml"})
                items {
                  item {
                    key
                    value
                  }
                }
              }
            }
          }
        `
      }).then(({ data }) => {
        (!destroyedRef.current) && update({ categories: parseDescriptor(data.categories.items)[0].items.item });
      });
    }
  }, [update, categories, categoriesLoading]);

  return categories;
}

export function useSearchQuery() {
  const { search } = useLocation();
  const [query, setQuery] = useState(() => parse(search).q ?? '');
  const [page, setPage] = useState(() => parse(search).p ?? 0);
  const onChange = useCallback((e) => setQuery(e.target.value), []);
  useEffect(() => {
    setQuery(parse(search).q ?? '');
    setPage(parse(search).p ?? 0);
  }, [search]);

  return [query, onChange, setQuery, page];
}

const contentTypes = ['/component/post'];
export function useUrlSearchQueryFetchResource(size = 1) {
  const [query, , , page] = useSearchQuery();
  const [resource, setResource] = useState(neverResource);

  useEffect(() => {
    setResource(createResource(
      () => search(
        createQuery('elasticsearch', {
          query: {
            'bool': {
              'filter': [
                { 'bool': { 'should': contentTypes.map(id => ({ 'match': { 'content-type': id } })) } },
                {
                  'multi_match': {
                    'query': query,
                    'type': 'phrase_prefix'
                  }
                },
              ]
            }
          },
          size,
          from: page
        }),
        crafterConfig
      ).pipe(
        map(({ hits, ...rest }) => {
          const counted = {};
          const parsedHits = hits.map(({ _source }) => parseDescriptor(
            preParseSearchResults(_source)
          )).filter((content) => {
            if (content.craftercms.id in counted) {
              return false;
            } else {
              counted[content.craftercms.id] = true;
              return true;
            }
          });
          return { ...rest, hits: parsedHits };
        })
      ).toPromise()
    ))
  }, [query, page, size]);
  return resource;
}
