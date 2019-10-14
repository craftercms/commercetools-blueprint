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

package org.craftercms.sites.ecommerce.service.commercetools

import io.sphere.sdk.categories.queries.CategoryQuery
import io.sphere.sdk.client.BlockingSphereClient
import io.sphere.sdk.expansion.ExpansionPath
import io.sphere.sdk.models.ResourceIdentifier
import io.sphere.sdk.products.queries.ProductProjectionByIdGet
import io.sphere.sdk.products.search.PriceSelection
import io.sphere.sdk.products.search.ProductProjectionSearch
import io.sphere.sdk.queries.QueryPredicate
import io.sphere.sdk.reviews.ReviewDraftBuilder
import io.sphere.sdk.reviews.commands.ReviewCreateCommand
import io.sphere.sdk.search.FilterExpression
import io.sphere.sdk.search.RangeFacetExpression
import io.sphere.sdk.search.RangeFacetResult
import io.sphere.sdk.search.TermFacetExpression
import io.sphere.sdk.search.TermFacetResult
import org.craftercms.sites.ecommerce.model.Page
import org.craftercms.sites.ecommerce.service.ProductService
import org.craftercms.sites.ecommerce.util.LocaleUtil

import groovy.util.logging.Slf4j

@Slf4j
class ProductServiceImpl extends ProductService {

  BlockingSphereClient client

  def doGetProduct(id) {
    Locale locale = LocaleUtil.locale
    def query = ProductProjectionByIdGet.ofCurrent(id)
                  .withPriceSelection(PriceSelection.ofCurrencyCode(LocaleUtil.currencyCode))
                  .plusExpansionPaths(ExpansionPath.of("categories[*]"))
                  .plusExpansionPaths(ExpansionPath.of("productType"))
    def response = client.executeBlocking(query)

    return response? MappingService.mapProduct(response, locale) : response
  }

  def getProducts(keywords, filters, pagination) {
    def locale = LocaleUtil.locale
    def counting = "counting products"

    // Built-in facets
    def queryFacets = facets?.collect { name, facet ->
      if (name == "categories") {
        return TermFacetExpression.of("categories.id as categories $counting")
      } else {
        def field = ""
        def ranges = facet.ranges
        if (name == "price") {
          field = "variants.price.centAmount"
          ranges = ranges.collect { [ from: getPriceFilter(it.from), to: getPriceFilter(it.to) ] }
        } else if (name == "rating") {
          field = "reviewRatingStatistics.averageRating"
        }
        return RangeFacetExpression.of(
          "$field:range ${ranges.collect {"(${it.from ?: "*"} to ${it.to ?: "*"})"}.join(",")} as $name $counting"
        )
      }
    }?.findAll { it }

    // Store specific facets
    attributes?.each { name, attr ->
        def expression = "variants.attributes."
        if (attr.ranges) {
          def ranges = attr.ranges.collect { "(${it.from ?: "*"} to ${it.to ?: "*"})" }.join(",")
          facets << RangeFacetExpression.of("${expression}${name}:range $ranges as $name $counting")
        } else {
          expression += name
          if (attr.list) {
            expression += ".label"
          }
          if (attr.translated) {
            expression += ".${locale.toLanguageTag()}"
          }
          queryFacets << TermFacetExpression.of("$expression as $name $counting")
        }
    }

    def queryFilters = filters?.collect { filter ->
      def path = filter.name
      if (attributes.containsKey(filter.name)) {
        path = "variants.attributes.${filter.name}"
        if (attributes[filter.name].list) {
          path += ".label"
        }
        if (attributes[filter.name].translated) {
          path += ".${locale.toLanguageTag()}"
        }
      } else if (filter.name == "rating") {
        path = "reviewRatingStatistics.averageRating"
      } else if (filter.name == "categories") {
        def categories = filter.value.split(",")
        return FilterExpression.of("categories.id: ${categories.collect{ "subtree(\"$it\")" }.join(",")}")
      }
      if (filter.from || filter.to) {
        if (filter.from == filter.to || (filter.from == facets[filter.name].min && filter.to == facets[filter.name].max)) {
          return null
        }
        if (filter.name == "price") {
          if (filter.from.toDouble() == facets.price.min && filter.to.toDouble() * 100 == facets.price.max) {
            return null
          }
          def from = filter.from? getPriceFilter(filter.from as int) : "*"
          def to = filter.to? getPriceFilter(filter.to as int) : "*"
          return FilterExpression.of("variants.price.centAmount:range (${from} to ${to})")
        } else {
          return FilterExpression.of("$path:range (${filter.from ?: '*'} to ${filter.to ?: '*'})")
        }
      } else if(filter.value.isNumber()) {
        return FilterExpression.of("$path:${filter.value}")
      } else {
        return FilterExpression.of("$path:\"${filter.value}\"")
      }
    }?.findAll { it }

    def currencyFilter =  []
    currencyFilter += FilterExpression.of("variants.prices.value.currencyCode:\"${LocaleUtil.currencyCode}\"")

    def query = ProductProjectionSearch.ofCurrent()
                  .withOffset(pagination.offset as long)
                  .withLimit(pagination.limit as long)
                  .withPriceSelection(PriceSelection.ofCurrencyCode(LocaleUtil.currencyCode))
                  .plusExpansionPaths(ExpansionPath.of("categories[*]"))
                  .plusExpansionPaths(ExpansionPath.of("productType"))
                  .plusFacets(queryFacets)
                  .plusQueryFilters(queryFilters ?: [])
                  .plusResultFilters(currencyFilter)

    if (keywords) {
      query = query.withText(locale, keywords)
                    .withFuzzy(true)
    }

    def response = client.executeBlocking(query)

    def page = new Page()
    page.offset = response.offset
    page.limit = response.limit
    page.total = response.total

    page.items = response.results.collect { result -> MappingService.mapProduct(result, locale) }

    page.facets = response.facetsResults.collect { name, facet ->
      if (facet instanceof TermFacetResult) {
        [
          type: "multiple",
          name: name.capitalize().tr('-', ' '),
          value: name,
          items: getTerms(name, facet, locale)
        ]
      } else if (facet instanceof RangeFacetResult) {
        [
          type: "range",
          name: name.capitalize().tr('-', ' '),
          value: name,
          min: getRangeMin(name),
          max: getRangeMax(name),
          items: facet.ranges.collect { range -> [
            from: getRangeFacet(name, range.lowerEndpoint),
            to: getRangeFacet(name, range.upperEndpoint),
            count: range.productCount
          ] }
        ]
      } else {
        // should never happen...
      }
    }

    return page
  }

  protected def getRangeMin(name) {
    if (name == "rating") {
      return 0
    } else if (name == "price") {
      return facets.price.min.isNumber()? facets.price.min.toDouble() : facets.price.min
    } else {
      return attributes[name].min.isNumber()? attributes[name].min.toDouble() : attributes[name].min
    }
  }

  protected def getRangeMax(name) {
    if (name == "rating") {
      return 5
    } else if (name == "price") {
      return facets.price.max.isNumber()? facets.price.max.toDouble() : facets.price.max
    } else {
      return attributes[name].max.isNumber()? attributes[name].max.toDouble() : attributes[name].max
    }
  }

  protected def getTerms(name, facet, locale) {
    if (name == "categories") {
      def ids = facet.terms.collect { it.term }
      def cats = [:]
      if (ids) {
        def request = CategoryQuery.of()
          .withLimit(ids.size())
          .withPredicates(QueryPredicate.of("id in (${ids.collect{ "\"$it\"" }.join(",")})" as String))
        cats = client.executeBlocking(request)
      }

      return facet.terms.collect {
        term -> [
          key: cats.results.find { it.id == term.term }.key,
          value: term.term,
          count: term.productCount,
          name: cats.results.find { it.id == term.term }.name.get(locale)
        ]
      }
    } else {
      return facet.terms.collect { term -> [value: term.term, name: term.term.capitalize(), count: term.productCount] }
    }
  }

  // This is needed because the price facet only supports cents
  protected def getRangeFacet(name, limit) {
    return limit? name == "price"? (limit as double) / 100 : (limit as double) : null
  }

  protected def getPriceFilter(limit) {
    return limit? (limit as int) * 100 : "*"
  }

  def doReview(id, review, user) {
    def draft = ReviewDraftBuilder.ofRating(review.rating as int)
                  .title(review.title as String)
                  .text(review.text as String)
                  .target(ResourceIdentifier.ofId(id as String, "product"))
                  .customer(ResourceIdentifier.ofId(user.id as String))
                  .uniquenessValue("${id}_${user.id}")
                  .build()
    def request = ReviewCreateCommand.of(draft)
    try {
      client.executeBlocking(request)
      return true
    } catch (e) {
      log.warn("Review of product {} failed", id, e)
      return false
    }
  }

}
