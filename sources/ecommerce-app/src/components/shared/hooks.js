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

import { useEffect, useState } from 'react';
import { fetchQuery } from '../../util/content';
import { postsQuery } from './queries.graphql';
import { parseDescriptor } from '@craftercms/content';

const defaultPaginationData = {
  itemsPerPage: 3,
  currentPage: 0
};

export function usePosts(paginationData = defaultPaginationData) {
  const [posts, setPosts] = useState();

  useEffect(() => {
    fetchQuery(
      { text: postsQuery },
      {
        postsLimit: paginationData.itemsPerPage,
        postsOffset: (paginationData.currentPage * paginationData.itemsPerPage)
      }
    ).then(({ data }) => {
      setPosts({
        items: parseDescriptor(data.post.items),
        total: data.post.total,
        pageCount: Math.ceil(data.post.total/paginationData.itemsPerPage)
      });
    });
  }, [paginationData]);

  return posts;
}
