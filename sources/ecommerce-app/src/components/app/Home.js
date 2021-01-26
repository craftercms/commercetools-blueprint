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

import React, { useEffect } from 'react';

import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import ContentSideImage from './ContentSideImage';
import Layout from './Layout';
import NotImplemented from '../shared/NotImplemented';
import { useSelector } from 'react-redux';
import BlogTeaser from './BlogTeaser';
import { FETCH_GRAPH } from '../../redux/actions/contentActions';
import { byIdLoadingKey } from '../../util/redux';
import ProductTeaser from './ProductTeaser';

const ContentTypeMap = {
  '/component/hero': Hero,
  '/component/two-column': ContentSideImage,
  '/component/feature-list': Features,
  '/component/testimonials': Testimonials,
  '/component/blog_teaser': BlogTeaser,
  '/component/product-teaser': ProductTeaser
};

export default function Home(props) {
  const {
    model
  } = props;

  const persona = useSelector(state => state.users.persona);

  return (
    <Layout
      className="landing__home-page"
      variables={{
        post: [
          { name: 'ageGroup', type: 'String', value: persona ? persona.age : null },
          { name: 'gender', type: 'String', value: persona ? persona.gender : null },
          { name: 'slug', type: 'String', value: null },
          { name: 'limit', type: 'Int', value: 3 }
        ]
      }}
      requirements={[
        'home',
        {
          name: 'post',
          getter: (content) =>
            (content.loading[byIdLoadingKey(FETCH_GRAPH, 'home')] === false) ? content.post : null
        }
      ]}
    >
      {
        model && model.sections_o && model.sections_o.map((component) => {
          const Component = ContentTypeMap[component.craftercms.contentTypeId] || NotImplemented;

          return <Component key={component.craftercms.id} {...component} />
        })
      }
    </Layout>
  );
}
