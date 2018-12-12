import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';

export default class DeviceMessage extends React.PureComponent {
  render () {
    return (
      <section className='device-message'>
        <div className='inner'>
          <h2>We're sorry</h2>
          <p>This section of the tool is optimized for desktop and tablets in landscape mode.</p>
          <p>If your device is smaller than <strong>1024x768 pixels</strong>, please try exploring this section on your desktop or tablet in landscape mode.</p>
        </div>
      </section>
    );
  }
}

if (environment !== 'production') {
  DeviceMessage.propTypes = {
    location: T.object
  };
}
