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

package org.craftercms.sites.ecommerce.service

import org.craftercms.engine.exception.HttpStatusCodeException
import org.craftercms.sites.ecommerce.util.SessionUtil

abstract class ProductService {

  def siteConfig

  def facets
  def attributes

  def init() {
    facets = siteConfig.configurationsAt("ecommerce.search.facets.facet").collectEntries { facetConf ->
      [
        (facetConf.getString("key")): [
          min: facetConf.getString("min"),
          max: facetConf.getString("max"),
          ranges: facetConf.configurationsAt("ranges.range")?.collect { rangeConf ->
            [
              from: rangeConf.getString("from"),
              to: rangeConf.getString("to")
            ]
          }
        ]
      ]
    }
    attributes = siteConfig.configurationsAt("ecommerce.search.attributes.attribute").collectEntries { attrConf ->
      [
        (attrConf.getString("key")) : [
          min: attrConf.getString("min"),
          max: attrConf.getString("max"),
          ranges: attrConf.configurationsAt("ranges.range")?.collect { rangeConf ->
            [
              from: rangeConf.getString("from"),
              to: rangeConf.getString("to")
            ]
          },
          translated: attrConf.getBoolean("translated", false),
          list: attrConf.getBoolean("list", false)
        ]
      ]
    }
  }

  def getProduct(id) {
    def product = doGetProduct(id)

    if(!product) {
      throw new HttpStatusCodeException(404, "Product not found for id $id")
    }

    return [
      item: product
    ]
  }

  abstract def doGetProduct(id)

  abstract def getProducts(keywords, filters, pagination)

  def review(id, review, session) {
    def user = SessionUtil.getUser()
    if (!user) {
      throw new HttpStatusCodeException(403, "No user logged in")
    }
    return doReview(id, review, user)
  }

  abstract def doReview(id, review, user)

}
