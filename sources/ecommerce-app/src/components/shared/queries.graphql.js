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

// language=GraphQL
const commonFragments = `
  fragment byUrlQueryContentItemFields on ContentItem {
    guid: objectId
    path: localId(filter: {not: [{equals: $exclude}]})
    contentTypeId: content__type
    dateCreated: createdDate_dt
    dateModified: lastModifiedDate_dt
    label: internal__name
  }
`

// language=GraphQL
const main = `
  ${commonFragments}

  fragment byUrlQueryBlogTeaser on component_blog_teaser {
    ...byUrlQueryContentItemFields
    title_s
  }

  fragment byUrlQueryFeatureList on component_feature__list {
    ...byUrlQueryContentItemFields
    closingContent_html
    closingContent_html_raw
    features_o {
      item {
        description_t
        title_s
        icon_s
      }
    }
    openingContent_html
    openingContent_html_raw
    title_s
  }

  fragment byUrlQueryFooter on component_footer {
    ...byUrlQueryContentItemFields
    logo_s
    logo_alt_t
    logo_url_s
  }

  fragment byUrlQueryHeader on component_header {
    ...byUrlQueryContentItemFields
    logo_s
    logo_alt_t
    logo_url_s
    buttons_o {
      item {
        label_s
        link_s
      }
    }
  }

  fragment byUrlQueryHero on component_hero {
    ...byUrlQueryContentItemFields
    title_t
    content_html
    content_html_raw
    buttons_o {
      item {
        label_s
        link_s
      }
    }
    image_s
    section_background_image_s
  }

  fragment byUrlQueryPost on component_post {
    ...byUrlQueryContentItemFields
  }

  fragment byUrlQueryProductTeaser on component_product__teaser {
    ...byUrlQueryContentItemFields
    title_s
    numOfProducts_i
  }

  fragment byUrlQueryTestimonials on component_testimonials {
    ...byUrlQueryContentItemFields
    title_s
    testimonials_o {
      item {
        customer_s
        description_html
        description_html_raw
        link_s
        stars_i
      }
    }
  }

  fragment byUrlQueryTwoColumn on component_two__column {
    ...byUrlQueryContentItemFields
    image_s
    title_s
    content_html
    content_html_raw
    contentAlignment_s
    section_background_image_s
  }

  fragment byUrlQueryHomepage on page_landing {
    internal__name
    sections_o {
      item {
        component {
          internal__name
          ...on component_blog_teaser {
            ...byUrlQueryBlogTeaser
          }
          ...on component_feature__list {
            ...byUrlQueryFeatureList
          }
          ...on component_footer {
            ...byUrlQueryFooter
          }
          ...on component_header {
            ...byUrlQueryHeader
          }
          ...on component_hero {
            ...byUrlQueryHero
          }
          ...on component_post {
            ...byUrlQueryPost
          }
          ...on component_product__teaser {
            ...byUrlQueryProductTeaser
          }
          ...on component_testimonials {
            ...byUrlQueryTestimonials
          }
          ...on component_two__column {
            ...byUrlQueryTwoColumn
          }
        }
      }
    }
  }
  
  query byUrlQuery(
    $url: String
    $skipContentType: Boolean = false
    $exclude: String = ""
  ) {
    content: contentItems {
      total
      items {
        ...byUrlQueryContentItemFields
        url: localId(
          transform: "storeUrlToRenderUrl",
          filter:{ regex: $url }
        )
        content__type(
          filter:{
            regex: ".*(landing|post|blog_roll|catalog).*"   # TODO: types!
          }
        ) @skip (if: $skipContentType)
        ...on page_landing {
          ...byUrlQueryHomepage
        }
      }
    }
  }
`

//language=GraphQL
export const postsQuery = `
  ${commonFragments}
  
  query postsQuery(
    $postsLimit: Int = 3
    $postsOffset: Int = 0
    $exclude: String = ""
    $slug: String = ".*.*"
  ) {
    post: component_post(
      limit: $postsLimit
      offset: $postsOffset
    ) {
      total
      items {
        ...byUrlQueryContentItemFields
        slug_s(filter: { regex: $slug })
        localId
        title_s
        image_s
        author_s
        subtitle_s
        content_html_raw
        summary_html_raw
        categories_o {
          item {
            key
            value_smv
          }
        }
      }
    }
  }
`

//language=GraphQL
export const navQuery = `
  query Nav {
    pages(sortBy: "orderDefault_f") {
      items {
        placeInNav(filter: { equals:true }) @skip(if: true)
        url: localId(transform: "storeUrlToRenderUrl")
        label: internal__name
        localId: localId
      }
    }
  }
`

//language=GraphQL
export const footerQuery = `
  query Footer {
    component_footer {
      items {
        localId
        objectId
        logo_s
        logo_url_s
        logo_alt_t
      }
    }
  }
`

//language=GraphQL
export const headerQuery = `  
  query Header {
    component_header {
      items {
        localId
        objectId
        logo_s
        logo_url_s
        logo_alt_t
        buttons_o {
          item {
            label_s
            link_s
          }
        }
      }
    }
  }
`

//language=GraphQL
export const storeSettingsQuery = `
  query StoreSettings {
    store {
      settings {
        name
        locales
        currencies
      }
    }
  }
`

export default main;
