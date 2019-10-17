/*
 * MIT License
 *
 * Copyright (c) 2019 Crafter Software Corporation. All Rights Reserved.
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

import { FETCH_GRAPH, FETCH_GRAPH_COMPLETE, FETCH_GRAPH_FAILED } from '../actions/contentActions';
import { byIdLoadingKey, removeProp } from '../../util/redux';
import { toLookupTable } from '../../util/array';
import { LOGIN_COMPLETE } from '../actions/usersActions';

const initialState = {
  nav: null,
  header: null,
  home: null,
  footer: null,
  store: null,
  post: null,
  categories: null,
  loading: {},
  errors: {}
};

export default function contentReducer(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case LOGIN_COMPLETE: {
      return {
        ...state,
        home: null,
        loading: removeProp(state.loading, byIdLoadingKey(FETCH_GRAPH, 'home'))
      }
    }
    case FETCH_GRAPH: {
      return {
        ...state,
        loading: {
          ...state.loading,
          [FETCH_GRAPH]: true,
          ...payload.requirements.reduce(
            (table, req) => {
              const key = byIdLoadingKey(FETCH_GRAPH, req);
              table[key] = true;
              return table;
            },
            {}
          )
        }
      };
    }
    case FETCH_GRAPH_COMPLETE: {
      return {
        ...state,
        loading: {
          ...state.loading,
          [FETCH_GRAPH]: false,
          ...action.rootPayload.requirements.reduce(
            (table, req) => {
              const key = byIdLoadingKey(FETCH_GRAPH, req);
              table[key] = false;
              return table;
            },
            {}
          )
        },
        nav: getNav(payload) || state.nav,
        header: getHeader(payload) || state.header,
        home: getHome(payload) || state.home,
        footer: getFooter(payload) || state.footer,
        post: getPosts(state.post, payload),
        categories: getCategories(state.categories, payload),
        errors: removeProp(state.errors, FETCH_GRAPH),
        store: getStore(state.store, payload)
      };
    }
    case FETCH_GRAPH_FAILED: {
      return {
        ...state,
        loading: removeProp(
          state.loading,
          FETCH_GRAPH,
          ...action.rootPayload.requirements.map(req => byIdLoadingKey(FETCH_GRAPH, req))
        ),
        errors: {
          ...state.errors,
          [FETCH_GRAPH]: payload.errors
        }
      }
    }
    default:
      return state;
  }
}

function getHeader(data) {
  return data && data.header ? data.header.items[0] : null;
}

function getFooter(data) {
  return data && data.footer ? data.footer.items[0] : null;
}

function getNav(data) {
  return data && data.nav ? data.nav.items : null;
}

function getHome(data) {
  if (!data || !data.home)
    return null;

  const posts = data.post && data.post.items.length > 0 ? data.post.items : [];
  const sections = data.home.items[0].sections_o.item;

  return sections
    .map(({ component, key, value }) => ({
      localId: key,
      label: value,
      ...component,
      ...component.contentType === '/component/blog_teaser' ? { posts_o: posts } : {}
    }))
    .filter(
      (component) => ![
        '/component/header',
        '/component/footer'
      ].includes(component.contentType)
    );

}

function getPosts(state, payload) {
  const data = payload && payload.post ? payload.post : null;
  if (!data || !data && !state) {
    return state;
  }
  return {
    bySlug: {
      ...state ? state.bySlug : {},
      ...toLookupTable(data.items, 'slug_s')
    }
  };
}

function getStore(state, payload) {
  const data = payload && payload.store ? payload.store : null;
  if (!data || !data && !state) {
    return state;
  }
  return {
    ...payload.store.settings
  };
}

function getCategories(state, payload) {
  const data = payload && payload.categories ? payload.categories : null;
  if (!data || !data && !state)
    return state;
  return {
    byId: toLookupTable(payload.categories.items[0].items.item, 'key')
  }
}
