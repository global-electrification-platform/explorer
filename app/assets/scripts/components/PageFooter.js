'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';

export default class PageFooter extends React.PureComponent {
  render () {
    return <footer className="page__footer" role="contentinfo" />;
  }
}

if (environment !== 'production') {
  PageFooter.propTypes = {
    location: T.object
  };
}
