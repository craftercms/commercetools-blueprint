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

import { loader } from 'graphql.macro';
import { ofType } from 'redux-observable';
import { FETCH_GRAPH, fetchGraphComplete, fetchGraphFailed } from '../actions/contentActions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { capitalize } from '../../util/string';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';

const FragmentMap = {
  home: loader('../../queries/Home.fragment.graphql').loc.source.body,
  nav: loader('../../queries/Nav.fragment.graphql').loc.source.body,
  header: loader('../../queries/Header.fragment.graphql').loc.source.body,
  footer: loader('../../queries/Footer.fragment.graphql').loc.source.body,
  post: loader('../../queries/Post.fragment.graphql').loc.source.body,
  categories: loader('../../queries/Categories.fragment.graphql').loc.source.body,
  blog: loader('../../queries/Blog.graphql').loc.source.body,
  Hero: loader('../../queries/Hero.fragment.graphql').loc.source.body,
  ContentSideImage: loader('../../queries/ContentSideImage.fragment.graphql').loc.source.body,
  FeatureList: loader('../../queries/FeatureList.fragment.graphql').loc.source.body,
  Testimonials: loader('../../queries/Testimonials.fragment.graphql').loc.source.body,
};

export function fetchGraphEpic(action$) {
  return action$.pipe(
    ofType(FETCH_GRAPH),
    switchMap(({ payload }) => {
      const { requirements, variables } = payload;

      const fragments = [];
      const queryPieces = ['\n'];
      const vars = {};
      let varSignature = '';

      if (variables && variables.length) {
        const signaturePieces = [];
        variables.forEach((variable) => {
          if (variable.value != null) {
            vars[variable.name] = variable.value;
          }
          signaturePieces.push(`$${variable.name}: ${variable.type}`);
        });
        varSignature = `(${signaturePieces.join(', ')})`;
      }

      requirements.forEach((req) => {
        queryPieces.push(`...${capitalize(req)}\n`);
        fragments.push(FragmentMap[req]);
      });

      const query = `query CustomGraph${varSignature} {${queryPieces.join('')}}\n${fragments.join('\n')}`;

      return ajax.post(
        process.env.REACT_APP_GRAPHQL_SERVER,
        {
          query,
          variables: vars
        },
        { 'Content-Type': 'application/json; charset=UTF-8' }
      ).pipe(
        catchError((response) => of(response)),
        map(({ response, name }) => (
          (name !== 'AjaxError' && !response.errors)
            ? fetchGraphComplete(response.data, payload)
            : fetchGraphFailed(response, payload)
        ))
      );

    })
  );
}
