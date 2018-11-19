import React, { Component } from 'react';

import App from './App';

class SelectCountry extends Component {
  render () {
    return (
      <App pageTitle='Select country'>
        <div>
          <h1>Select Country:</h1>
          <ul>
            <li>Ghana</li>
            <li>Malawi</li>
            <li>Nigeria</li>
          </ul>
        </div>
      </App>
    );
  }
}

export default SelectCountry;
