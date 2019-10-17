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

import groovy.util.logging.Slf4j
import io.sphere.sdk.client.BlockingSphereClient
import io.sphere.sdk.customers.CustomerDraftBuilder
import io.sphere.sdk.customers.commands.*
import io.sphere.sdk.customers.commands.updateactions.AddAddress
import io.sphere.sdk.customers.commands.updateactions.ChangeAddress
import io.sphere.sdk.customers.commands.updateactions.ChangeEmail
import io.sphere.sdk.customers.commands.updateactions.RemoveAddress
import io.sphere.sdk.customers.commands.updateactions.SetDefaultBillingAddress
import io.sphere.sdk.customers.commands.updateactions.SetDefaultShippingAddress
import io.sphere.sdk.customers.commands.updateactions.SetFirstName
import io.sphere.sdk.customers.commands.updateactions.SetLastName
import io.sphere.sdk.customers.commands.updateactions.SetMiddleName
import io.sphere.sdk.customers.queries.CustomerByEmailTokenGet
import io.sphere.sdk.customers.queries.CustomerByIdGet
import io.sphere.sdk.models.LocalizedString
import io.sphere.sdk.queries.QueryPredicate
import io.sphere.sdk.types.FieldDefinition
import io.sphere.sdk.types.FieldType
import io.sphere.sdk.types.FieldTypeBase
import io.sphere.sdk.types.ResourceTypeIdsSetBuilder
import io.sphere.sdk.types.StringFieldType
import io.sphere.sdk.types.TypeDraftBuilder
import io.sphere.sdk.types.commands.TypeCreateCommand
import io.sphere.sdk.types.commands.TypeUpdateCommand
import io.sphere.sdk.types.commands.updateactions.AddFieldDefinition
import io.sphere.sdk.types.queries.TypeQuery
import org.craftercms.engine.exception.HttpStatusCodeException
import org.craftercms.sites.ecommerce.service.CustomerService
import org.craftercms.sites.ecommerce.util.LocaleUtil

@Slf4j
class CustomerServiceImpl extends CustomerService {

  BlockingSphereClient client

  MappingService mappingService

  protected def getCustmer(user) {
    def request = CustomerByIdGet.of(user.id)
    return client.executeBlocking(request)
  }

  def doAuthenticate(email, password, uuid) {
    def request = CustomerSignInCommand.of(email, password)
    if (uuid) {
      request = request.withAnonymousId(uuid)
    }
    try {
      def response = client.executeBlocking(request)
      log.debug("Successful authentication for customer {}", email)

      if (verificationEnabled && !response.customer.emailVerified) {
        return null
      } else {
        def user = MappingService.mapUser(response.customer)
        if (response.cart) {
          user.cart = mappingService.mapCart(response.cart)
        }
        return user
      }
    } catch (e) {
      log.error("Error during authentication for customer {}", email, e)
      return null
    }

  }

  def doCreate(user, uuid) {
    def draftBuilder = CustomerDraftBuilder.of(user.email, user.password)
      .firstName(user.firstName)
      .middleName(user.middleName)
      .lastName(user.lastName)
      .emailVerified(!verificationEnabled)
    if (uuid) {
      draftBuilder = draftBuilder.anonymousId(uuid)
    }
    def request = CustomerCreateCommand.of(draftBuilder.build())
    def response = client.executeBlocking(request)
    user.id = response.customer.id
  }

  def doCreateVerificationToken(user) {
    def request = CustomerCreateEmailTokenCommand.ofCustomerId(user.id, verificationTokenTimeout)
    def response = client.executeBlocking(request)
    return response.value
  }

  def doVerifyEmail(token) {
    def request = CustomerByEmailTokenGet.of(token as String)
    def response = client.executeBlocking(request)

    if (response) {
      request = CustomerVerifyEmailCommand.ofTokenValue(token)
      client.executeBlocking(request)
      return true
    }

    return false
  }

  def doChangePassword(user, data) {
    def customer = getCustmer(user)
    def request = CustomerChangePasswordCommand.of(customer, data.currentPassword, data.newPassword)
    try {
      def response = client.executeBlocking(request)
      return MappingService.mapUser(response)
    } catch (e) {
      throw new HttpStatusCodeException(400, "Error changing password for user ${user.email}", e)
    }
  }

  def doUpdate(user, data) {
    def customer = getCustmer(user)

    def actions = []

    if (data.email != null) {
      actions << ChangeEmail.of(data.email)
    }
    if (data.firstName != null) {
      actions << SetFirstName.of(data.firstName)
    }
    if (data.middleName != null) {
      actions << SetMiddleName.of(data.middleName)
    }
    if (data.lastName != null) {
      actions << SetLastName.of(data.lastName)
    }
    if (data.addAddress) {
      [data.addAddress].flatten().each {
        actions << AddAddress.of(MappingService.buildAddress(it))
      }
    }
    if (data.removeAddress) {
      [data.removeAddress].flatten().each {
        actions << RemoveAddress.of(it.id)
      }
    }
    if (data.changeAddress) {
      [data.changeAddress].flatten().each {
        actions << ChangeAddress.of(it.id, MappingService.buildAddress(it))
      }
    }
    if (data.defaultShippingAddress != null) {
      actions << SetDefaultShippingAddress.of(data.defaultShippingAddress)
    }
    if (data.defaultBillingAddress != null) {
      actions << SetDefaultBillingAddress.of(data.defaultBillingAddress)
    }

    def request = CustomerUpdateCommand.of(customer, actions)
    def response = client.executeBlocking(request)

    return MappingService.mapUser(response)
  }

}
