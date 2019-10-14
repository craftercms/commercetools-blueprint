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

import React, { Fragment } from 'react';
import { CheckBox } from '../shared/form/CheckBox';
import renderRadioButtonField from '../shared/form/RadioButton';
import Range from '../shared/range_slider/Range';

const SAMPLE = [
  { label: 'Dresses', value: 'dresses' },
  {
    label: 'Cardigans & Sweaters',
    value: 'cardigans_n_sweaters',
    children: [
      { label: 'Sweaters', value: 'sweaters' },
      { label: 'Cardigans', value: 'cardigans' },
      { label: 'Sweatshirts', value: 'sweatshirts' }
    ]
  },
  { label: 'Jumpsuits', value: 'jumpsuits' },
  { label: 'T-shirts', value: 't-shirts' },
  { label: 'Jackets', value: 'jackets' }
];

export function HierarchicalFacets(props) {
  const {
    title,
    facets,
    checked,
    onSelection
  } = props;
  return (
    <nav className="hierarchical-facets">
      {title && <h2 className="facet-list-title">Clothing</h2>}
      {
        facets.map((facet) =>
          <Fragment key={facet.value}>
            <a
              href="javascript:"
              className={`hierarchical-facets__item ${checked[facet.value] ? 'hierarchical-facets__item--checked' : ''}`}
              onClick={() => onSelection(facet)}
            >{facet.label}</a>
            {
              facet.children &&
              facet.children.length &&
              checked[facet.value] &&
              <HierarchicalFacets
                {...props}
                title={null}
                facets={facet.children}
              />
            }
          </Fragment>
        )
      }
    </nav>
  )
}

export function MultipleSelectionFacet(props) {
  const {
    title,
    facets,
    checked,
    onSelection
  } = props;
  return (
    <nav className="multiple-selection-facets">
      {title && <h2 className="facet-list-title">{title}</h2>}
      <div className="form__form-group">
        {
          facets.map((facet) =>
            <div key={facet.value} className="form__form-group-field">
              <CheckBox
                name="categories"
                label={facet.label}
                value={facet.value}
                checked={checked.includes(facet.value)}
                onChange={(e) => onSelection(e.target.checked, facet)}
              />
            </div>
          )
        }
      </div>
    </nav>
  );
}

export function SingleSelectionFacet(props) {
  const {
    title,
    facets,
    onSelection
  } = props;
  return (
    <nav className="single-selection-facets">
      {title && <h2 className="facet-list-title">{title}</h2>}
      <div className="form__form-group">
        {
          facets.map((facet) =>
            <div key={facet.value} className="form__form-group-field">
              {
                renderRadioButtonField({
                  label: facet.label,
                  radioValue: facet.value,
                  input: {
                    value: facets[0].value,
                    name: 'singleGroupName',
                    onChange: () => void null
                  }
                })
              }
            </div>
          )
        }
      </div>
    </nav>
  );
}

export function RangeFacet(props) {
  const {
    min,
    max,
    value,
    title,
    onChange,
    tipFormatter
  } = props;
  return (
    <nav className="range-selection-facet">
      <h2 className="facet-list-title">{title}</h2>
      <Range
        min={min}
        max={max}
        value={value}
        tipOptions={{ visible: false }}
        onAfterChange={onChange}
        tipFormatter={tipFormatter}
      />
    </nav>
  )
}

SingleSelectionFacet.defaultProps =
  MultipleSelectionFacet.defaultProps =
    HierarchicalFacets.defaultProps = {
      title: 'Clothing',
      facets: SAMPLE,
      checked: { cardigans_n_sweaters: true },
      onSelection: (facet) => void null
    };


