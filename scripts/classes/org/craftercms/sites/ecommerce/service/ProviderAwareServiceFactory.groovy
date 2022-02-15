/*
 * MIT License
 *
 * Copyright (c) 2022 Crafter Software Corporation. All Rights Reserved.
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

import org.springframework.context.ApplicationContext
import org.springframework.context.ApplicationContextAware

class ProviderAwareServiceFactory implements ApplicationContextAware {

  def context
  def provider

  void setApplicationContext(ApplicationContext context) {
    this.context = context
  }

  def getBean(name) {
    return context.getBean("$name-$provider")
  }

  def getCustomerService() {
    return getBean("customerService")
  }

  def getOrderService() {
    return getBean("orderService")
  }

  def getProductService() {
    return getBean("productService")
  }

  def getCartService() {
    return getBean("cartService")
  }

  def getPaymentService() {
    return getBean("paymentService")
  }

  def getStoreService() {
    return getBean("storeService")
  }

}
