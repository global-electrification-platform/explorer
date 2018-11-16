import React, { Component } from 'react';

class Levers extends Component {
  render () {
    return (
      <section className='econtrols__section econtrols__section--active' id='econtrols-scenarios'>
        <h1 className='econtrols__title'>Scenarios</h1>
        <form className='form econtrols__block' id='#econtrols__scenarios'>
          <div className='econtrols__subblock'>
            <div className='form__group econtrols__item'>
              <label className='form__label'>Electricity demand profile</label>
              <label className='form__option form__option--custom-radio'>
                <input type='radio' name='form-radio' id='form-radio-1' value='Radio 1' checked='checked' />
                <span className='form__option__ui'></span>
                <span className='form__option__text'>Radio 1</span>
              </label>
              <label className='form__option form__option--custom-radio'>
                <input type='radio' name='form-radio' id='form-radio-2' value='Radio 2' />
                <span className='form__option__ui'></span>
                <span className='form__option__text'>Radio 2</span>
              </label>
            </div>
          </div>
          <div className='form__actions econtrols__actions'>
            <button type='submit' className='econtrols__submit' title='Apply'><span>Apply changes</span></button>
          </div>
        </form>
      </section>
    );
  }
}

export default Levers;
