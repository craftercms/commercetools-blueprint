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

export function isAuthoring() {
  const html = document.documentElement;
  const attr = html.getAttribute('data-craftercms-preview');
  return (
    // eslint-disable-next-line no-template-curly-in-string
    attr === '${modePreview?c}' || // Otherwise disable/enable if you want to see pencils in dev server.
    attr === 'true'
  );
}

export function createResource(factory) {
  let result;
  let status = "pending";
  let suspender = factory().then(
    response => {
      status = "success";
      result = response;
    },
    error => {
      status = "error";
      result = error;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}

export const siteName =
  document.getElementById('2fb5164e').innerHTML ||
  process.env.REACT_APP_CRAFTERCMS_SITE_ID ||
  Cookies.get('crafterSite');
if (!siteName) {
  throw new Error('Site not set.');
}

export const crafterConfig = {
  baseUrl: process.env.REACT_APP_CRAFTERCMS_BASE_URL ?? '',
  site: siteName
};

crafterConf.configure(crafterConfig);
