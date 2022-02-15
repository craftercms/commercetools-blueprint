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

import org.craftercms.commons.mail.impl.EmailFactoryImpl
import org.craftercms.engine.service.context.SiteContext
import org.springframework.mail.javamail.JavaMailSenderImpl

class EmailService {

  static def create() {
    def siteContext = SiteContext.current
    return new EmailService(siteContext.config, siteContext.freeMarkerConfig.configuration)
  }

  def emailFactory

  EmailService(siteConfig, freeMarkerConfig) {
    def props = new Properties()
    props["mail.smtp.auth"] = "false"
    props["mail.smtp.starttls.enable"] = "false"

    def mailSender = new JavaMailSenderImpl()
    mailSender.host = siteConfig.getString("ecommerce.email.sender.host")
    mailSender.port = siteConfig.getInt("ecommerce.email.sender.port")
    mailSender.protocol = siteConfig.getString("ecommerce.email.sender.protocol")
    mailSender.defaultEncoding = siteConfig.getString("ecommerce.email.sender.encoding")
    mailSender.javaMailProperties = props

    emailFactory = new EmailFactoryImpl()
    emailFactory.mailSender = mailSender
    emailFactory.freeMarkerConfig = freeMarkerConfig
  }

  def sendEmail(from, to, subject, templateName, templateModel) {
    emailFactory.getEmail(from, (String[])[ to ], null, null, subject, templateName, templateModel, true).send()
  }

}
