import React, { Component } from 'react';

class Layers extends Component {
  render () {
    return (
      <section className='econtrols__section econtrols__section--active' id='econtrols-layers'>
        <h1 className='econtrols__title'>Layers</h1>

        <form className='form econtrols__block' id='#econtrols__scenarios'>
          <div className='econtrols__subblock'>
            <div className='form__group econtrols__item'>
              <label htmlFor='switch1' className='form__option form__option--switch' title='Toggle on/off'>
                <input type='checkbox' name='switch1' id='switch1' value='on' />
                <span className='form__option__text'>HV Grid</span>
                <span className='form__option__ui'></span>
              </label>
            </div>
            <div className='form__group econtrols__item'>
              <label htmlFor='switch2' className='form__option form__option--switch' title='Toggle on/off'>
                <input type='checkbox' name='switch2' id='switch2' value='on' />
                <span className='form__option__text'>Schools</span>
                <span className='form__option__ui'></span>
              </label>
            </div>
            <div className='form__group econtrols__item'>
              <label htmlFor='switch3' className='form__option form__option--switch' title='Toggle on/off'>
                <input type='checkbox' name='switch3' id='switch3' value='on' />
                <span className='form__option__text'>Transformers</span>
                <span className='form__option__ui'></span>
              </label>
            </div>
          </div>
        </form>
      </section>
    );
  }
}

export default Layers;
