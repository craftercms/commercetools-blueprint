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

import org.craftercms.engine.security.PreAuthenticatedProfile
import org.craftercms.profile.api.Profile
import org.craftercms.security.utils.SecurityUtils
import org.craftercms.sites.ecommerce.util.SessionUtil

def user = SessionUtil.getUser(session)

if (user) {
  logger.debug("User {} authenticated for the current session", user.email)
  def profile = new Profile()
  profile.username = user.email
  profile.email = user.email
  profile.setAttributes([
    id: user.id,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName
  ])
  user.attributes?.collect { key, value -> profile.setAttribute(key, value) }

  SecurityUtils.setAuthentication(request, new PreAuthenticatedProfile(profile))
} else {
  logger.debug("No user authenticated for the current session")
}

filterChain.doFilter(request, response)
