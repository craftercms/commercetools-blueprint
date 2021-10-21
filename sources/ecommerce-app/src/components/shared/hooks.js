/*
 * MIT License
 *
 * Copyright (c) 2021 Crafter Software Corporation. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { fetchQuery } from '../../util/content';
import {
  footerQuery,
  headerQuery,
  navQuery,
  postsQuery,
  storeSettingsQuery
} from './queries.graphql';
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
  }, [paginationData, slug]);

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
        createQuery({
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

export function useNavigation() {
  const [{ pages, pagesLoading }, update] = useGlobalContext();
  const destroyedRef = useRef(false);
  useEffect(() => {
    return () => {
      destroyedRef.current = true;
    }
  }, []);
  useEffect(() => {
    if (!pages && !pagesLoading) {
      update({ pagesLoading: true });
      fetchQuery({
        text: navQuery
      }).then(({ data }) => {
        (!destroyedRef.current) && update({ pages: data.pages.items });
      })
    }
  }, [update, pages, pagesLoading]);
  return pages;
}

export function useHeader() {
  const [{ header, headerLoading}, update] = useGlobalContext();
  const destroyedRef = useRef(false);
  useEffect(() => {
    return () => {
      destroyedRef.current = true;
    }
  }, []);
  useEffect(() => {
    if (!header && !headerLoading) {
      update({ headerLoading: true });
      fetchQuery({
        text: headerQuery
      }).then(({ data }) => {
        (!destroyedRef.current) && update({ header: data.component_header.items[0]});
      })
    }
  }, [update, header, headerLoading]);
  return header;
}

export function useFooter() {
  const [{ footer, footerLoading }, update] = useGlobalContext();
  const destroyedRef = useRef(false);
  useEffect(() => {
    return () => {
      destroyedRef.current = true;
    }
  }, []);
  useEffect(() => {
    if (!footer && !footerLoading) {
      update({ footerLoading: true });
      fetchQuery({
        text: footerQuery
      }).then(({ data }) => {
        (!destroyedRef.current) && update({ footer: data.component_footer.items[0] });
      })
    }
  }, [update, footer, footerLoading]);
  return footer;
}

export function useStoreSettings() {
  const [{ storeSettings, storeSettingsLoading }, update] = useGlobalContext();
  const destroyedRef = useRef(false);
  useEffect(() => {
    return () => {
      destroyedRef.current = true;
    }
  }, []);
  useEffect(() => {
    if(!storeSettings && !storeSettingsLoading) {
      update({ storeSettingsLoading: true });
      fetchQuery({
        text: storeSettingsQuery
      }).then(({ data }) => {
        (!destroyedRef.current) && update({ storeSettings: data.store.settings });
      });
    }
  }, [update, storeSettings, storeSettingsLoading]);
  return storeSettings;
}
