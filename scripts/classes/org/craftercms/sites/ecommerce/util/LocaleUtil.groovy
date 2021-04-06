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

package org.craftercms.sites.ecommerce.util

import org.apache.commons.configuration2.XMLConfiguration
import org.apache.commons.lang3.LocaleUtils
import org.springframework.context.i18n.LocaleContextHolder
import org.springframework.web.context.request.RequestContextHolder

import static org.springframework.web.context.request.RequestAttributes.SCOPE_SESSION

abstract class LocaleUtil {

  private static String CURRENCY_KEY = "currency";

  static Locale getLocale() {
    LocaleContextHolder.locale
  }

  static void setCurrency(String currencyCode) {
    RequestContextHolder.requestAttributes.setAttribute(CURRENCY_KEY, Currency.getInstance(currencyCode), SCOPE_SESSION)
  }

  static void setCurrency(XMLConfiguration siteConfig) {
    RequestContextHolder.requestAttributes.setAttribute(CURRENCY_KEY,
      Currency.getInstance(LocaleUtils.toLocale(siteConfig.getProperty('defaultLocale'))), SCOPE_SESSION)
  }

  static String getCurrencyCode() {
    RequestContextHolder.requestAttributes.getAttribute(CURRENCY_KEY, SCOPE_SESSION)
  }

}
