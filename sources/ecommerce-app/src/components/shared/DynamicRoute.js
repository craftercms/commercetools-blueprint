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

import React, { useEffect, useState } from 'react';
import Home from '../app/Home';
import { fetchQuery } from '../../util/content';
import byUrlQuery from './queries.graphql';
import { parseDescriptor } from '@craftercms/content';
import { reportNavigation } from '@craftercms/ice';
// import { Guest, ContentType } from '@craftercms/studio-guest';
import { isAuthoring } from './utils';

export default function DynamicRoute(props) {
  const { match, location } = props;
  const [ state, setState ] = useState(null);
  let url = match.url;

  useEffect(() => {
    let destroyed = false;
    reportNavigation(url);
    fetchQuery(
      { text: byUrlQuery },
      {
        url: `.*${url === '/' ? 'website/index' : url}.*`
      }
    ).then(({data}) => {
      if (!destroyed) {
        const model = parseDescriptor(data.content.items?.[0]);

        setState({
          model,
          meta: {}
        });
      }
    });
    return () => {
      destroyed = true;
    };
  }, [url, location.search]);

  useEffect(() => {
    window.scroll(0, 0);
  }, [url]);


  // if (state === null) {
  //   return <></>; // TODO: spinner component
  // } else {
  //   return <Guest
  //     modelId={state.model?.craftercms.id}
  //     isAuthoring={isAuthoring()}
  //     path={state.model?.craftercms.path}
  //   >
  //     <Home {...state} {...props} />
  //   </Guest>
  // }


  return <Home {...state} {...props} />
}
