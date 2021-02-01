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

package org.craftercms.sites.ecommerce.service.commercetools

import io.sphere.sdk.client.BlockingSphereClient
import io.sphere.sdk.orders.queries.OrderQuery
import io.sphere.sdk.queries.QueryPredicate
import io.sphere.sdk.queries.QuerySort
import org.craftercms.engine.exception.HttpStatusCodeException
import org.craftercms.sites.ecommerce.model.Page
import org.craftercms.sites.ecommerce.service.OrderService

class OrderServiceImpl extends OrderService {

  BlockingSphereClient client

  def doGetOrder(user, id) {
    def request = OrderQuery.of()
                  .withPredicates([
                    QueryPredicate.of("id = \"$id\""),
                    QueryPredicate.of("customerId = \"${user.id}\"")
                  ])
    try {
      def response = client.executeBlocking(request)
      if (response.total != 1) {
        throw new HttpStatusCodeException(404, "Order not found for id $id")
      }
      return MappingService.mapOrder(response.results.first(), true)
    } catch (e) {
      throw new HttpStatusCodeException(500, "Error fetching order for id $id")
    }

  }

  def doGetOrders(user, pagination) {
    def request = OrderQuery.of()
                  .plusPredicates(QueryPredicate.of("customerId = \"$user.id\"" as String))
                  .withOffset(pagination.offset as long)
                  .withLimit(pagination.limit as long)
                  .withSort(QuerySort.of("lastModifiedAt DESC"))
    def response = client.executeBlocking(request)

    def page = new Page()
    page.total = response.total
    page.offset = response.offset
    page.limit = response.limit
    page.items = response.results.collect { MappingService.mapOrder(it) }

    return page
  }

}
