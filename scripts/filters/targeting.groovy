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

// Temp filter to set targeting attributes from the query string

def age = params.age
def gender = params.gender

def updateProfile = { attr, value ->
  profile.attributes[attr] = value
}

if (profile) {
  // update the user currently authenticated
  if (age) {
    updateProfile("age", age)
  }
  if (gender) {
    updateProfile("gender", gender)
  }
} else {
  // create a fake user
  def profile = new Profile()
  profile.setAttributes([
    age: age,
    gender: gender
  ])

  SecurityUtils.setAuthentication(request, new PreAuthenticatedProfile(profile))
}

filterChain.doFilter(request, response)
