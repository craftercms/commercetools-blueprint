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

package org.craftercms.sites.ecommerce.service

import org.craftercms.engine.exception.HttpStatusCodeException
import org.craftercms.sites.ecommerce.util.SessionUtil

abstract class CartService {

  CustomerService customerService
  PaymentService paymentService

  def getCart(session) {
    return SessionUtil.getCart(session)
  }

  abstract def createCart(session)

  def deleteCart(session) {
    def cart = getCart(session)
    if (cart) {
      doDeleteCart(cart)
      SessionUtil.setCart(session, null)
    }
  }

  abstract def doDeleteCart(cart)

  def addItem(session, productId, variantId, quantity) {
    def cart = getCart(session) ?: createCart(session)
    cart = doAddItem(cart, productId, variantId, quantity)
    SessionUtil.setCart(session, cart)
    return cart
  }

  abstract def doAddItem(cart, productId, variantId, quantity)

  def changeItem(session, itemId, quantity) {
    def cart = doChangeItem(getCart(session), itemId, quantity)
    SessionUtil.setCart(session, cart)
    return cart
  }

  abstract def doChangeItem(cart, itemId, quantity)

  def update(session, info) {
    def cart = getCart(session)
    def user = SessionUtil.getUser()
    cart = doUpdate(user, cart, info)
    SessionUtil.setCart(session, cart)
    return cart
  }

  abstract def doUpdate(user, cart, info)

  def getShippingMethods(session) {
    def cart = getCart(session)
    return doGetShippingMethods(cart)
  }

  abstract def doGetShippingMethods(cart)

  def checkout(session, info) {
    def user = SessionUtil.checkUser(session)
    def cart = SessionUtil.getCart(session)
    if (!cart.shippingAddress || !cart.billingAddress || !cart.shippingPrice) {
      throw new HttpStatusCodeException(400, "Complete all requirements before checkout")
    }
    def order = doCheckout(user, cart, info)
    user.cart = null
    SessionUtil.setUser(user)
    SessionUtil.setCart(session, null)
    return order
  }

  abstract def doCheckout(user, cart, info)

}
