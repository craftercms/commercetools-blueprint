/*
 * Copyright (C) 2007-2021 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
export default `
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
            regex: ".*(landing|post).*"   # TODO: types!
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
  ) {
    post: component_post(
      limit: $postsLimit
      offset: $postsOffset
    ) {
      # ...byUrlQueryPost
      total
      items {
        ...byUrlQueryContentItemFields
        slug_s  # TODO: check this slug filter (filter: {equals: $slug})
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
