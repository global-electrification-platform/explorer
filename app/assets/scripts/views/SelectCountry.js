import React, { Component } from 'react';

import App from './App';

class SelectCountry extends Component {
  render () {
    return (
      <App pageTitle='Select country'>
        <section className='inpage inpage--hub inpage--explore'>
          <header className='inpage__header'>
            <div className='inpage__subheader'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Explore</h1>
                <h2 className='inpage__sectitle'>Select country</h2>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <p>Country list</p>
          </div>
        </section>
      </App>
    );
  }
}

export default SelectCountry;
