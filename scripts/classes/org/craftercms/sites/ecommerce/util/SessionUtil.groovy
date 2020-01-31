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

package org.craftercms.sites.ecommerce.util

import org.craftercms.engine.exception.HttpStatusCodeException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.context.SecurityContextImpl
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken

abstract class SessionUtil {

  static final def CART_KEY = "cart"
  static final def UUID_KEY = "uuid"

  static def getUUID(session) {
    return get(session, UUID_KEY)
  }

  static def setUUID(session, uuid) {
    return set(session, uuid, UUID_KEY)
  }

  static def checkUser(session) {
    def user = getUser()

    if (!user) {
      throw new HttpStatusCodeException(403, "No user logged in")
    }

    return user
  }

  static def getUser() {
    return SecurityContextHolder.context?.authentication?.principal
  }

  static def setUser(user) {
    def context = SecurityContextHolder.context
    if (!context) {
      context = new SecurityContextImpl()
    }
    context.authentication = new PreAuthenticatedAuthenticationToken(user, "N/A", [])
    SecurityContextHolder.context = context
  }

  static def getCart(session) {
    return get(session, CART_KEY)
  }

  static def setCart(session, cart) {
    set(session, cart, CART_KEY)
  }

  static def get(session, key) {
    return session.getAttribute(key)
  }

  static def set(session, object, key) {
    session.setAttribute(key, object)
  }

}
