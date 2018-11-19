import React, { Component } from 'react';

class Filters extends Component {
  render () {
    return (
      <section className='econtrols__section econtrols__section--active' id='econtrols-filters'>
        <h1 className='econtrols__title'>Filters</h1>
        <form className='form econtrols__block' id='#econtrols__scenarios'>
          <div className='econtrols__subblock'>
            <div className='form__group econtrols__item'>
              <label className='form__label'>Population</label>
              <input
                type='range'
                id='start'
                name='filter1'
                min='0'
                max='11'
                value='5'
                className='form__control'
              />
            </div>
            <div className='form__group econtrols__item'>
              <label className='form__label'>Electrification Technology</label>
              <label className='form__option form__option--custom-radio'>
                <input
                  type='radio'
                  name='form-radio-b'
                  id='form-radio-1'
                  value='Grid'
                  checked='checked'
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
