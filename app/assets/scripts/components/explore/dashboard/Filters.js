import React, { Component } from 'react';

import ShadowScrollbars from '../../ShadowScrollbar';

class Filters extends Component {
  render () {
    return (
      <section className='econtrols__section' id='econtrols-filters'>
        <h1 className='econtrols__title'>Filters</h1>
        <form className='form econtrols__block' id='#econtrols__scenarios'>
          <div className='econtrols__subblock'>
            <ShadowScrollbars theme='light'>
              <div className='form__group econtrols__item'>
                <label className='form__label'>Population</label>
                <div className='form__input-group'>
                  <input
                    type='range'
                    min='0'
                    max='5'
                    step='1'
                    id='slider-1'
                    className='form__range'
                    />
                  <output for='range-criticality' id='range-criticality-output' className='form__input-output'>3</output>
                </div>
              </div>
              <div className='form__group econtrols__item'>
                <label className='form__label'>Electrification Technology</label>
                <label className='form__option form__option--custom-radio'>
                  <input
                    type='radio'
                    name='form-radio-b'
                    id='form-radio-1'
                    value='Grid'
                  />
                  <span className='form__option__ui' />
                  <span className='form__option__text'>Grid</span>
                </label>
                <label className='form__option form__option--custom-radio'>
                  <input
                    type='radio'
                    name='form-radio-b'
                    id='form-radio-2'
                    value='PV MG'
                  />
                  <span className='form__option__ui' />
                  <span className='form__option__text'>PV MG</span>
                </label>
                <label className='form__option form__option--custom-radio'>
                  <input
                    type='radio'
                    name='form-radio-b'
                    id='form-radio-3'
                    value='PV SA'
                  />
                  <span className='form__option__ui' />
                  <span className='form__option__text'>PV SA</span>
                </label>
              </div>
            </ShadowScrollbars>
          </div>
          <div className='form__actions econtrols__actions'>
            <button type='submit' className='econtrols__submit' title='Apply'>
              <span>Apply changes</span>
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default Filters;
