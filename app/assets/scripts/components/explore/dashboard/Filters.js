import React, { Component } from 'react';

class Filters extends Component {
  render () {
    return (
      <section className='econtrols__section econtrols__section--active' id='econtrols-filters'>
        <h1 className='econtrols__title'>Scenarios</h1>
        <div className='filter'>
          <h4>Population</h4>
          <input
            type='range'
            id='start'
            name='filter1'
            min='0'
            max='11'
            value='5'
          />
        </div>
        <br />
        <div className='filter'>
          <h4>Electrification Technology</h4>

          <div>
            <input type='radio' id='option2' name='filter2' value='option2' />
            <label htmlFor='option2'>Grid</label>
          </div>
          <div>
            <input type='radio' id='option3' name='filter2' value='option3' />
            <label htmlFor='option3'>PV MG</label>
          </div>
          <div>
            <input type='radio' id='option3' name='filter2' value='option3' />
            <label htmlFor='option3'>PV SA</label>
          </div>
        </div>
      </section>
    );
  }
}

export default Filters;
