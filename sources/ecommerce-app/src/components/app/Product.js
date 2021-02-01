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
import { Link } from 'react-router-dom';
import { money } from '../../util/string';
import Ratings from 'react-ratings-declarative';

const saleBadge = `${process.env.PUBLIC_URL}/img/for_store/catalog/sale_lable.png`;
const newBadge = `${process.env.PUBLIC_URL}/img/for_store/catalog/new_lable.png`;

export default function Product(props) {

  let isNew, isSale;
  const { product } = props;
  const { id, name, variants, rating } = product || {};

  const colors = variants
    .filter(variant => variant.attributes.some(a => a.name === 'Color'))
    .map((variant) =>
      variant.attributes.find(a => a.name === 'Color').value.toLowerCase()
    );

  const price = variants[0].price;
  const oldPrice = price * 2;

  const img = variants[0].images[0];

  const
    widgetEmptyColors = '#ccc',
    widgetHoverColors = '#FFCC00',
    widgetRatedColors = '#FFCC00',
    widgetDimensions = '20px',
    widgetSpacings = '5px';

  return (
    <div className="catalog-item">
      <Link className="catalog-item__link" to={`/catalog/${id}`}>

        {isNew ? <img className="catalog-item__label" src={newBadge} alt="new"/> : ''}
        {isSale ? <img className="catalog-item__label" src={saleBadge} alt="sale"/> : ''}

        <div className="catalog-item__img-wrap">
          <img className="catalog-item__img" src={img.url} alt={img.description}/>
        </div>

        <div className="catalog-item--rating-widget rating-widget">
          <section className="rating-widget__header">
            <div className="rating-widget__average">
              <div>
                {
                  (rating == null) ? 'No reviews yet.' : <>
                    <Ratings
                      rating={rating == null ? 0 : rating.average}
                      widgetEmptyColors={widgetEmptyColors}
                      widgetHoverColors={widgetHoverColors}
                      widgetRatedColors={widgetRatedColors}
                      widgetDimensions={widgetDimensions}
                      widgetSpacings={widgetSpacings}
                    >
                      <Ratings.Widget/>
                      <Ratings.Widget/>
                      <Ratings.Widget/>
                      <Ratings.Widget/>
                      <Ratings.Widget/>
                    </Ratings>
                  </>
                }
              </div>
            </div>
          </section>
        </div>

        <div className="catalog-item__info">
          <h4 className="catalog-item__title">{name}</h4>
          <em className="catalog-item__price">{money(price, variants[0].currency)}</em>
          {isSale ? <p className="catalog-item__old-price">${oldPrice}</p> : ''}
          {
            colors.map((color, index) => (
              <span
                key={index}
                className="catalog-item__color"
                style={{ background: color }}
              />
            ))
          }
        </div>

      </Link>
    </div>
  );
}
