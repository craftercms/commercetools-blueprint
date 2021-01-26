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

export function isAuthoring() {
  const html = document.documentElement;
  const attr = html.getAttribute('data-craftercms-preview');
  return (
    // eslint-disable-next-line no-template-curly-in-string
    attr === '${modePreview?c}' || // Otherwise disable/enable if you want to see pencils in dev server.
    attr === 'true'
  );
}
