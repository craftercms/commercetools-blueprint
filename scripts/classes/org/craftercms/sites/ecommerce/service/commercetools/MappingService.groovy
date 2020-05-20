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

import com.neovisionaries.i18n.CountryCode
import io.sphere.sdk.models.AddressBuilder
import io.sphere.sdk.products.attributes.LocalizedStringAttributeType
import org.craftercms.sites.ecommerce.model.Address
import org.craftercms.sites.ecommerce.model.Cart
import org.craftercms.sites.ecommerce.model.CartItem
import org.craftercms.sites.ecommerce.model.Order
import org.craftercms.sites.ecommerce.model.Payment
import org.craftercms.sites.ecommerce.model.Product
import org.craftercms.sites.ecommerce.model.ShippingMethod
import org.craftercms.sites.ecommerce.model.User
import org.craftercms.sites.ecommerce.model.Variant
import org.craftercms.sites.ecommerce.util.LocaleUtil
import org.springframework.context.ApplicationContext
import org.springframework.context.ApplicationContextAware

class MappingService implements ApplicationContextAware {

  def context

  void setApplicationContext(ApplicationContext context) {
    this.context = context
  }

  static def buildAddress(address) {
    return AddressBuilder.of(CountryCode.findByName(address.country).first())
      .id(address.id)
      .title(address.addressName)
      .region(address.region)
      .state(address.state)
      .city(address.city)
      .additionalStreetInfo(address.streetAddressLineOne)
      .additionalAddressInfo(address.streetAddressLineTwo)
      .postalCode(address.postalCode)
      .firstName(address.firstName)
      .lastName(address.lastName)
      .phone(address.phone)
      .mobile(address.mobile)
      .fax(address.fax)
      .build()
  }

  static def mapAddress(result) {
    def address = new Address()
    address.with {
      id = result.id
      addressName = result.title
      country = result.country.name
      region = result.region
      state = result.state
      city = result.city
      streetAddressLineOne = result.additionalStreetInfo
      streetAddressLineTwo = result.additionalAddressInfo
      postalCode = result.postalCode
      firstName = result.firstName
      lastName = result.lastName
      phone = result.phone
      mobile = result.mobile
      fax = result.fax
    }
    return address
  }

  static def mapUser(customer) {
    def user = new User()
    user.with {
      id = customer.id
      email = customer.email
      firstName = customer.firstName
      middleName = customer.middleName
      lastName = customer.lastName
      addresses = customer.addresses?.collect { mapAddress(it) }
      if (customer.defaultShippingAddressId) {
        addresses?.find { it.id == customer.defaultShippingAddressId }?.isShippingDefault = true
      }
      if (customer.defaultBillingAddressId) {
        addresses?.find { it.id == customer.defaultBillingAddressId }?.isBillingDefault = true
      }
      if (customer.custom) {
        attributes = customer.custom.fields.collectEntries { key, value -> [ (key): value.asText() ] }
      }
    }
    return user
  }

  static def mapProduct(result, Locale locale) {
    def productType = result.productType.obj
    def product = new Product()
    product.id = result.id
    product.name = result.name?.get(locale)
    product.description = result.description?.get(locale)
    product.categories = result.categories.collect { category ->
      [
        id: category.obj.id,
        key: category.obj.key,
        name: category.obj.name.get(locale)
      ]
    }
    if (result.reviewRatingStatistics) {
      product.rating = [
        average: result.reviewRatingStatistics.averageRating,
        reviews: result.reviewRatingStatistics.count
      ]
    }
    product.variants = result.allVariants.collect { resultVariant ->
      def variant = new Variant()
      variant.id = resultVariant.id
      variant.sku = resultVariant.sku
      variant.onStock = resultVariant.availability?.onStock ?: false
      variant.quantity = resultVariant.availability?.availableQuantity ?: 0
      variant.price = resultVariant.price?.value?.number ?: 0
      variant.currency = resultVariant.price?.value?.currency as String
      variant.images = resultVariant.images.collect { image ->
        [
          url: image.url,
          description: image.label
        ]
      }
      variant.attributes = resultVariant.attributes.collect { attr ->
        def attrDef = productType.attributes.find { it.name == attr.name }
        [
          name: attrDef.label.get(locale),
          value:
            attrDef.attributeType instanceof LocalizedStringAttributeType?
              attr.value."${locale.toLanguageTag()}" : attr.value
        ]
      }
      return variant
    }

    return product
  }

  def mapCart(response) {
    def locale = LocaleUtil.locale
    Cart cart = new Cart()
    cart.with {
      id = response.id
      uuid = response.anonymousId
      totalPrice = response.totalPrice.number
      shippingPrice = response.shippingInfo?.price?.number
      taxedPrice = response.taxedPrice?.totalGross?.number
      currency = response.totalPrice.currency as String
      shippingMethod = response.shippingInfo?.shippingMethod?.id
      items = response.lineItems.collect { lineItem -> mapCartItem(lineItem, locale) }
      if (response.shippingAddress) {
        shippingAddress = mapAddress(response.shippingAddress)
        cart.shippingMethods = context.getBean("cartService").doGetShippingMethods(cart)
      }
      if (response.billingAddress) {
        billingAddress = mapAddress(response.billingAddress)
      }
    }
    return cart
  }

  static def mapCartItem(lineItem, locale) {
    def item = new CartItem()
    item.with {
      id = lineItem.id
      productId = lineItem.productId
      productName = lineItem.name.get(locale)
      variantId = lineItem.variant.id
      quantity = lineItem.quantity
      taxedPrice = lineItem.taxedPrice?.totalGross?.number
      totalPrice = lineItem.totalPrice.number
      unitPrice = lineItem.price.value.number
      currency = lineItem.totalPrice.currency as String
      images = lineItem.variant.images.collect { image ->
        [
          url        : image.url,
          description: image.label
        ]
      }
    }
    return item
  }

  static def mapShippingMethod(result) {
    def rate = result.zoneRates?.collect { rate -> rate.shippingRates?.find { it.matching } }?.first()
    def shippingMethod = new ShippingMethod()
    shippingMethod.with {
      id = result.id
      name = result.name
      description = result.description
      price = rate.price.number
      currency = rate.price.currency as String
    }
    return shippingMethod
  }

  static def mapOrder(result, includeItems = false) {
    def locale = LocaleUtil.locale
    def order = new Order()
    order.with {
      id = result.id
      created = result.createdAt as String
      modified = result.lastModifiedAt as String
      orderStatus = result.orderState
      paymentStatus = result.paymentState
      shippingStatus = result.shipmentState
      currency = result.taxedPrice.totalGross.currency as String
      totalPrice = result.totalPrice.number
      shippingPrice = result.shippingInfo?.price?.number
      taxedPrice = result.taxedPrice.totalGross.number
      if (includeItems) {
        items = result.lineItems.collect { lineItem -> mapCartItem(lineItem, locale) }
      }
    }
    return order
  }

  static def mapPayment(result) {
    def payment = new Payment()
    payment.with {
      id = result.id
    }
    return payment
  }

}
