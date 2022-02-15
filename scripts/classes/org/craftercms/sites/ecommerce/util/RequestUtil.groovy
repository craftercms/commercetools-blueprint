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

package org.craftercms.sites.ecommerce.util

import org.craftercms.engine.exception.HttpStatusCodeException

import groovy.json.JsonSlurper

abstract class RequestUtil {

  static def getPagination(params) {
    return [
      offset: params.offset ?: 0,
      limit: params.limit ?: 10
    ]
  }

  static def getFilters(params) {
    def filters = params.filter? [params.filter].flatten() : []
    return filters.findAll { it }.collect { filter ->
      def values = filter.split(":")
      if (values.length != 2) {
        throw new HttpStatusCodeException(400, "Invalid filter parameter: $filter")
      }
      if (values[1].contains(";")) {
        def range = values[1].split(";")
        if (range.length != 2) {
          throw new HttpStatusCodeException(400, "Invalid filter parameter: $filter")
        }
        return [
          name: values[0],
          from: range[0],
          to: range[1]
        ]
      } else {
        return [
          name: values[0],
          value: values[1]
        ]
      }
    }
  }

  static def parse(request, requiredFields = null) {
    def object
    try {
      object = new JsonSlurper().parseText(request.reader.text)
    } catch (e) {
      throw new HttpStatusCodeException(400, "Error parsing request", e)
    }
    checkRequiredFields(object, requiredFields)
    return object
  }

  static def checkRequiredFields(object, requiredFields) {
    if (requiredFields instanceof Map) {
      requiredFields?.each { key, value ->
        if (object[key] == null) {
          throw new HttpStatusCodeException(400, "Missing required parameter '$key'")
        }
        checkRequiredFields(object[key], value)
      }
    } else if (requiredFields instanceof List) {
      requiredFields?.each {
        if (object[it] == null) {
          throw new HttpStatusCodeException(400, "Missing required parameter '$it'")
        }
      }
    }
  }

}
