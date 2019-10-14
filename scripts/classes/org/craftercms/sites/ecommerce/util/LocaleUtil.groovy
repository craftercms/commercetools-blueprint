package org.craftercms.sites.ecommerce.util

import org.springframework.context.i18n.LocaleContextHolder

/**
 *
 * @author joseross
 */
abstract class LocaleUtil {

  static Locale getLocale() {
    Locale.forLanguageTag(LocaleContextHolder.locale.language)
  }

  static String getCurrencyCode() {
    Currency.getInstance(LocaleContextHolder.locale).currencyCode
  }

}
