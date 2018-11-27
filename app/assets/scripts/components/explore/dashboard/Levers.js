import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import ShadowScrollbars from '../../ShadowScrollbar';

import { environment } from '../../../config';

class Levers extends Component {
  constructor (props) {
    super(props);

    this.renderLever = this.renderLever.bind(this);
  }

  renderLever (lever) {
    return (
      <div>
        <label className='form__label'>{lever.label}</label>
        {lever.options.map((option, i) => {
          return (
            <label className='form__option form__option--custom-radio'>
              <input
                type='radio'
                name={`form-radio-${lever.id}`}
                id={`form-radio-${i}`}
                value={i}
                checked={i === 0}
              />
              <span className='form__option__ui' />
              <span className='form__option__text'>{option.value}</span>
            </label>
          );
        })}
      </div>
    );
  }

  render () {
    const { model } = this.props;

    return (
      <section className='econtrols__section' id='econtrols-scenarios'>
        <h1 className='econtrols__title'>Scenarios</h1>
        <form className='form econtrols__block' id='#econtrols__scenarios'>
          <div className='econtrols__subblock'>
            <ShadowScrollbars theme='light'>
              <div className='form__group econtrols__item'>
                {model.levers.map(this.renderLever)}
              </div>
            </ShadowScrollbars>
          </div>
          <div className='form__actions econtrols__actions'>
            <button
              type='submit'
              className='econtrols__submit'
              title='Apply'
              onClick={e => {
                e.preventDefault();
                this.props.updateMap();
              }}
            >
              <span>Apply changes</span>
            </button>
          </div>
        </form>
      </section>
    );
  }
}

if (environment !== 'production') {
  Levers.propTypes = {
    updateMap: T.function,
    model: T.object
  };
}

export default Levers;
