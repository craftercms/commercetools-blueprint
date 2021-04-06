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

import React from 'react';

import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import ContentSideImage from './ContentSideImage';
import Layout from './Layout';
import NotImplemented from '../shared/NotImplemented';
import BlogTeaser from './BlogTeaser';
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

  return (
    <Layout className="landing__home-page">
      {
        model && model.sections_o && model.sections_o.map((component) => {
          const Component = ContentTypeMap[component.craftercms.contentTypeId] || NotImplemented;

          return <Component key={component.craftercms.id} {...component} />
        })
      }
    </Layout>
  );
}
