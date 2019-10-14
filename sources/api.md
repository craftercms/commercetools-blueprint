# eCommerce Blueprint API

## Security

### `/api/1/security/login.json`

Method: `POST`

Request: 
```
{
  username*,
  password*
}
```
Response:
```
{
  id,
  username,
  email,
  password,
  firstName,
  middleName,
  lastName,
  attribues {
    key: value
  }
  addresses [
    id,
    addressName,
    isShippingDefault,
    isBillingDefault,
    country*,
    region,
    state,
    city,
    streetName,
    streetNumber,
    postalCode,
    firstName,
    lastName,
    phone,
    mobile,
    fax
  ],
  cart {
    id,
    uuid,
    total,
    items [
      id,
      productId,
      productName,
      variantId,
      price,
      quantity
    ],
    shippingAddress,
    billingAddress,
    shippingMethod,
    shippingMethods [
      id,
      name,
      description,
      price,
      currency
    ]
  }
}
```

### `/api/1/security/logout.json`

Method: `POST`

## Products

### `/api/1/product/all.json`

Method: `GET`

Params: 
  - offset
  - limit
  - q: keywords to perform full text search
  - filter
    - Formats: for single values `{name}:{value}`, for ranges `{name}:{min};{max}`
    - Supported Fields: `categories`, `rating`, `price` and any attribute defined in the site config

Response:
```
{
  items [
    id,
    name,
    description,
    categories [
      id,
      name
    ],
    rating {
      average,
      reviews
    },
    variants [
      id,
      sku,
      attributes [
        name,
        value
      ],
      price,
      currency,
      onStock,
      quantity,
      images [
        url,
        description
      ]
    ]
  ],
  facets [
      type,
      name,
      value,
      items: [
        name,
        value,
        count
      ],
      items: [
        from,
        to,
        count
      ]
  ],
  offset,
  limit,
  total
]
```

### `/api/1/product/{id}.json`

Method: `GET`

Params:
  - `id`

Response:
```
item {
  id,
  name,
  description,
  categories [
    id,
    name
  ],
  rating {
    average,
    reviews
  },
  variants [
    id,
    sku,
    attributes [
      name,
      value
    ],
    price,
    currency,
    onStock,
    quantity,
    images [
      url,
      description
    ]
  ]
}
```

### `/api/1/product/{id}/review.json`

Method: `POST`

Request:
```
{
  rating*,
  text
}
```

Response:
```
true
```

## Customers

### `/api/1/customer/signup.json`

Method: `POST`

Request:
```
{
  email*,
  password*,
  firstName*,
  middleName,
  lastName*
}
```

Response:
```
{
  id,
  email,
  password,
  firstName,
  middleName,
  lastName
}
```

### `/api/1/customer/update.json`

Method: `POST`

Request:
```
{
  email,
  firstName,
  middleName,
  lastName,
  attribues {
    key: value
  }
  addAddress [
    id,
    addressName,
    country*,
    region,
    state,
    city,
    streetName,
    streetNumber,
    postalCode,
    firstName,
    lastName,
    phone,
    mobile,
    fax
  ],
  changeAddress[
    id,
    addressName,
    country*,
    region,
    state,
    city,
    streetName,
    streetNumber,
    postalCode,
    firstName,
    lastName,
    phone,
    mobile,
    fax
  ],
  removeAddress[
    id
  ],
  defaultShippingAddress,
  defaultBillingAddress
}
```

Response:
```
{
  id,
  email,
  password,
  firstName,
  middleName,
  lastName,
  addresses [
    id,
    addressName,
    isShippingDefault,
    isBillingDefault,
    country*,
    region,
    state,
    city,
    streetName,
    streetNumber,
    postalCode,
    firstName,
    lastName,
    phone,
    mobile,
    fax
  ],
}
```

### `/api/1/customer/change-password.json`

Method: `POST`

Request:
```
{
  currentPassword*,
  newPassword*
}
```

Response:
```
{
  id,
  email,
  password,
  firstName,
  middleName,
  lastName
}
```

### `/api/1/customer/orders.json`

Method: `GET`

Params:
  - offset
  - limit

Response:
```
{
  items [
    id,
    createdAt,
    modifiedAt,
    orderStatus,
    paymentStatus,
    shippingStatus,
    currency,
    totalPrice,
    shippingPrice,
    taxedPrice
  ],
  offset,
  limit,
  total
}
```

### `/api/1/customer/orders/{id}`

Method: `GET`

Params:
  - id

Response:
```
{
  id,
  createdAt,
  modifiedAt,
  orderStatus,
  paymentStatus,
  shippingStatus,
  currency,
  totalPrice,
  shippingPrice,
  taxedPrice
  items [
    {
      id,
      productId,
      productName,
      variantId,
      images [
        url,
        description
      ]
      currency,
      unitPrice,
      totalPrice
      quantity
    }
  ]
}
```

## Cart

### `/api/1/cart/current.json`

Method: `GET`

Response:
```
{
  id,
  uuid,
  totalPrice,
  shippingPrice,
  taxedPrice
  items [
    id,
    productId,
    productName,
    variantId,
    images [
      url,
      description
    ]
    currency,
    unitPrice,
    totalPrice
    quantity
  ],
  shippingAddress,
  billingAddress,
  shippingMethod,
  shippingMethods [
    id,
    name,
    description,
    price,
    currency
  ]
}
```

### `/api/1/cart/item/add.json`

Method: `POST`

Request:
```
{
  productId*,
  variantId*,
  quantity*
}
```

Response:
```
{
  id,
  uuid,
  totalPrice,
  shippingPrice,
  taxedPrice
  items [
    id,
    productId,
    productName,
    variantId,
    images [
      url,
      description
    ]
    currency,
    unitPrice,
    totalPrice
    quantity
  ],
  shippingAddress,
  billingAddress,
  shippingMethod,
  shippingMethods [
    id,
    name,
    description,
    price,
    currency
  ]
}
```

### `/api/1/cart/item/change.json`

Method: `POST`

Request:
```
{
  itemId*,
  quantity*
}
```

Response:
```
{
  id,
  uuid,
  totalPrice,
  shippingPrice,
  taxedPrice
  items [
    id,
    productId,
    productName,
    variantId,
    images [
      url,
      description
    ]
    currency,
    unitPrice,
    totalPrice
    quantity
  ],
  shippingAddress,
  billingAddress,
  shippingMethod,
  shippingMethods [
    id,
    name,
    description,
    price,
    currency
  ]
}
```

### `/api/1/cart/update.json`

Add/change address (billing/shipping) and/or set shipping method

Method: `POST`

Request:
```
{
  shippingAddress,
  billingAddress,
  shippingMethod
}
```

Response:
```
{
  id,
  uuid,
  totalPrice,
  shippingPrice,
  taxedPrice
  items [
    id,
    productId,
    productName,
    variantId,
    images [
      url,
      description
    ]
    currency,
    unitPrice,
    totalPrice
    quantity
  ],
  shippingAddress,
  billingAddress,
  shippingMethod,
  shippingMethods [
    id,
    name,
    description,
    price,
    currency
  ]
}
```

### `/api/1/cart/shipping-methods.json`

Method: `GET`

Response:

```
[
  {
    id,
    name,
    description,
    price,
    currency
  }
]
```

### `/api/1/cart/checkout.json`

Converts the cart to an order

Method: `POST`

Request:
```typescript
interface Request {
  cvc: string;
  nameOnCard: string;
  cardNumber: string;
  expirationDate: string;
}
```

Response:
```
{
  id,
  createdAt,
  modifiedAt,
  orderStatus,
  paymentStatus,
  shippingStatus,
  currency,
  totalPrice,
  shippingPrice,
  taxedPrice
}
```
