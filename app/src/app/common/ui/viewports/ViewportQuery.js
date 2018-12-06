import React, { Fragment } from 'react';
import Media from 'react-media';
import Viewport from './Viewport';
import { VIEWPORT_MOBILE, VIEWPORT_IPAD, VIEWPORT_DESKTOP } from '../../state/ui/reducer';

import './ViewportQuery.css';

/**
 * this component should be used only once in the app
 */
const ViewportQuery = () => {
  return (
    <Fragment>
      <Media query="(min-width: 0) and (max-width: 768px)">
        <Viewport nextViewportType={VIEWPORT_MOBILE} />
      </Media>
      <Media query="(min-width: 769px) and (max-width: 1024px)">
        <Viewport nextViewportType={VIEWPORT_IPAD} />
      </Media>
      <Media query="(min-width: 1025px)">
        <Viewport nextViewportType={VIEWPORT_DESKTOP} />
      </Media>
    </Fragment>
  );
};

export default ViewportQuery;
