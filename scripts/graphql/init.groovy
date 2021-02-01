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

import static graphql.schema.GraphQLFieldDefinition.newFieldDefinition
import static graphql.schema.GraphQLObjectType.newObject
import static graphql.schema.GraphQLList.list
import static graphql.schema.GraphQLNonNull.nonNull

import static graphql.Scalars.GraphQLString

def storeSettings = newObject()
  .name('StoreSettings')
  .field(newFieldDefinition()
    .name('name')
    .description('The name of the store')
    .type(nonNull(GraphQLString))
  )
  .field(newFieldDefinition()
    .name('locales')
    .description('The supported locales of the store')
    .type(list(nonNull(GraphQLString)))
  )
  .field(newFieldDefinition()
    .name('currencies')
    .description('The supported currencies of the store')
    .type(list(nonNull(GraphQLString)))
  )

schema.field(newFieldDefinition()
  .name('store')
  .description('Store integration')
  .type(newObject()
    .name('Store')
    .field(newFieldDefinition()
      .name("settings")
      .description('Provides store settings')
      .type(storeSettings)
    )
  )
)

schema.fetcher('Store', 'settings', { env -> [:] }) // needed so GraphQL doesn't skip the sub-fields

schema.fetcher('StoreSettings', 'name', { env -> applicationContext.storeService.name })
schema.fetcher('StoreSettings', 'locales', { env -> applicationContext.storeService.locales })
schema.fetcher('StoreSettings', 'currencies', { env -> applicationContext.storeService.currencies })
