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

import org.craftercms.commons.http.RequestContext
import org.craftercms.engine.exception.HttpStatusCodeException
import org.craftercms.engine.service.UrlTransformationService
import org.craftercms.engine.service.context.SiteContext
import org.craftercms.sites.ecommerce.util.SessionUtil

import groovy.util.logging.Slf4j

@Slf4j
abstract class CustomerService {

  boolean verificationEnabled
  int verificationTokenTimeout
  String verificationAddress
  String verificationSubject
  String verificationUrl
  String verificationTemplate

  UrlTransformationService urlTransformationService
  StoreService storeService

  def authenticate(session, email, password) {
    def user = SessionUtil.getUser()
    if (user) {
      log.info("Customer {} already logged in", user.email)
      return true
    }
    log.info("Starting authentication for customer {}", email)
    user = doAuthenticate(email, password, SessionUtil.getUUID(session))
    if (user) {
      SessionUtil.setUser(user)
      if (user.cart) {
        SessionUtil.setCart(session, user.cart)
      }
      SessionUtil.setUUID(session, null)
      return user
    } else {
      throw new HttpStatusCodeException(401, "Wrong email or password")
    }
  }

  abstract def doAuthenticate(emailF, password, uuid)

  String getCurrent() {
    def user = SessionUtil.getUser(RequestContext.current.request.session)
    return user? user as String : "null"
  }

  def create(session, user) {
    log.info("Starting customer creation for {}", user.email)
    doCreate(user, SessionUtil.getUUID(session))
    SessionUtil.setUUID(session, null)
    if (verificationEnabled) {
      sendVerificationEmail(user)
    }
    return user
  }

  abstract def doCreate(user, uuid)

  def sendVerificationEmail(user) {
    log.info("Sending email verification for customer {}", user.email)
    def token = doCreateVerificationToken(user)
    log.debug("Verification token for user {}: {}", user.email, token)
    def emailService = EmailService.create()
    emailService.sendEmail(verificationAddress, user.email, verificationSubject, verificationTemplate, [
      siteName: SiteContext.current.siteName,
      storeName: storeService.getName(),
      user: user,
      token: token,
      url: urlTransformationService.transform("toFullUrl", verificationUrl)
    ])
  }

  abstract def doCreateVerificationToken(user)

  def verifyEmail(token) {
    log.debug("Verifying email token {}", token)
    return doVerifyEmail(token)
  }

  abstract def doVerifyEmail(token)

  def changePassword(session, data) {
    def user = SessionUtil.checkUser(session)

    log.debug("Changing password for user {}", user.email)
    return doChangePassword(user, data)
  }

  abstract def doChangePassword(user, data)

  def update(session, data) {
    def user = SessionUtil.checkUser(session)

    log.debug("Updating user {}", user.email)
    user = doUpdate(user, data)
    SessionUtil.setUser(user)

    return user
  }

  abstract def doUpdate(user, data)

}
