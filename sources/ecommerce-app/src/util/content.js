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

import { crafterConf } from '@craftercms/classes';
import Cookies from 'js-cookie';

export const siteName =
  document.getElementById('2fb5164e').innerHTML ||
  process.env.REACT_APP_SITE_ID ||
  Cookies.get('crafterSite');
if (!siteName) {
  throw new Error('Site not set.');
}

let graphqlServer = process.env.REACT_APP_GRAPHQL_SERVER;
if (!graphqlServer.includes(siteName)) {
  graphqlServer += `?crafterSite=${siteName}`;
}

export function fetchQuery(
  operation,
  variables
) {
  return fetch(graphqlServer, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  }).then(response => response.json());
}
