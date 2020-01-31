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

import io.sphere.sdk.carts.CartDraft
import io.sphere.sdk.carts.commands.CartCreateCommand
import io.sphere.sdk.carts.commands.CartUpdateCommand
import io.sphere.sdk.carts.commands.updateactions.AddLineItem
import io.sphere.sdk.carts.commands.updateactions.AddPayment
import io.sphere.sdk.carts.commands.updateactions.ChangeLineItemQuantity
import io.sphere.sdk.carts.commands.updateactions.Recalculate
import io.sphere.sdk.carts.commands.updateactions.SetBillingAddress
import io.sphere.sdk.carts.commands.updateactions.SetShippingAddress
import io.sphere.sdk.carts.commands.updateactions.SetShippingMethod
import io.sphere.sdk.carts.queries.CartByIdGet
import io.sphere.sdk.client.BlockingSphereClient
import io.sphere.sdk.orders.commands.OrderFromCartCreateCommand
import io.sphere.sdk.payments.queries.PaymentByIdGet
import io.sphere.sdk.shippingmethods.queries.ShippingMethodsByCartGet
import org.craftercms.engine.exception.HttpStatusCodeException
import org.craftercms.sites.ecommerce.service.CartService
import org.craftercms.sites.ecommerce.util.LocaleUtil
import org.craftercms.sites.ecommerce.util.SessionUtil

import javax.money.Monetary
import groovy.util.logging.Slf4j

@Slf4j
class CartServiceImpl extends CartService {

  BlockingSphereClient client

  MappingService mappingService

  def createCart(session) {
    def user = SessionUtil.getUser()
    def cartDraft = CartDraft.of(Monetary.getCurrency(LocaleUtil.currencyCode))
    if (user) {
      cartDraft = cartDraft.withCustomerId(user.id).withCustomerEmail(user.email)
    } else {
      def uuid = SessionUtil.getUUID(session)
      if (!uuid) {
        uuid = UUID.randomUUID() as String
        SessionUtil.setUUID(session, uuid)
      }
      cartDraft = cartDraft.withAnonymousId(uuid)
    }
    def request = CartCreateCommand.of(cartDraft)
    def response = client.executeBlocking(request)

    def cart = mappingService.mapCart(response)

    SessionUtil.setCart(session, cart)
    return cart
  }

  protected def getCartById(cartId) {
    def request = CartByIdGet.of(cartId)
    def cart = client.executeBlocking(request)

    def action = Recalculate.of().withUpdateProductData(true)
    request = CartUpdateCommand.of(cart, action)

    return client.executeBlocking(request)
  }

  def doAddItem(cart, productId, variantId, quantity) {
    def currentCart = getCartById(cart.id)
    def action = AddLineItem.of(productId as String, variantId as int, quantity as long)
    def request = CartUpdateCommand.of(currentCart, action)
    def response = client.executeBlocking(request)

    return mappingService.mapCart(response)
  }

  def doChangeItem(cart, itemId, quantity) {
    def currentCart = getCartById(cart.id)
    def action = ChangeLineItemQuantity.of(itemId, quantity)
    def request = CartUpdateCommand.of(currentCart, action)
    def response = client.executeBlocking(request)

    return mappingService.mapCart(response)
  }

  def doUpdate(user, cart, info) {
    def currentCart = getCartById(cart.id)
    def actions = []

    if (user && info.shippingAddress) {
      def address = user.addresses?.find { it.id == info.shippingAddress }
      if (address) {
        actions << SetShippingAddress.of(MappingService.buildAddress(address))
      }
    }
    if (user && info.billingAddress) {
      def address = user.addresses?.find { it.id == info.billingAddress }
      if (address) {
        actions << SetBillingAddress.of(MappingService.buildAddress(address))
      }
    }
    if (info.shippingMethod) {
      actions << SetShippingMethod.ofId(info.shippingMethod)
    }

    def request = CartUpdateCommand.of(currentCart, actions)

    try {
      def response = client.executeBlocking(request)
      return mappingService.mapCart(response)
    } catch (e) {
      throw new HttpStatusCodeException(400, "The requested update can't be applied in the current shopping cart", e)
    }
  }

  def doGetShippingMethods(cart) {
    def request = ShippingMethodsByCartGet.of(cart.id)
    def response = client.executeBlocking(request)
    return response.collect{ MappingService.mapShippingMethod(it) }
  }

  def doCheckout(user, cart, info) {
    def currentCart = getCartById(cart.id)

    def payment = paymentService.create(user, cart, info)

    def request = PaymentByIdGet.of(payment.id)
    def response = client.executeBlocking(request)

    def action = AddPayment.of(response)
    request = CartUpdateCommand.of(currentCart, action)
    currentCart = client.executeBlocking(request)

    request = OrderFromCartCreateCommand.of(currentCart)
    response = client.executeBlocking(request)

    return MappingService.mapOrder(response, true)
  }

}
