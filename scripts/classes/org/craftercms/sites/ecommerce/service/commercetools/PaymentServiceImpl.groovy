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
import io.sphere.sdk.customers.queries.CustomerByIdGet
import io.sphere.sdk.payments.PaymentDraftBuilder
import io.sphere.sdk.payments.commands.PaymentCreateCommand
import org.craftercms.sites.ecommerce.model.Payment
import org.craftercms.sites.ecommerce.service.PaymentService
import org.javamoney.moneta.FastMoney

class PaymentServiceImpl extends PaymentService {

  BlockingSphereClient client

  //TODO: Use payment info with a real service
  def create(user, cart, paymentInfo) {
    def request = CustomerByIdGet.of(user.id)
    def customer = client.executeBlocking(request)

    def draft = PaymentDraftBuilder.of(FastMoney.of(cart.taxedPrice, cart.currency))
                .customer(customer)
                .build()
    request = PaymentCreateCommand.of(draft)
    def response = client.executeBlocking(request)

    return MappingService.mapPayment(response)
  }

}
