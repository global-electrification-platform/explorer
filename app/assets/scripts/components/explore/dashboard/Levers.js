import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import ShadowScrollbars from '../../ShadowScrollbar';

import { environment } from '../../../config';

function makeZeroFilledArray (length) {
  return Array.apply(null, {
    length
  }).map(() => 0);
}

class Levers extends Component {
  constructor (props) {
    super(props);

    this.renderLever = this.renderLever.bind(this);
    this.handleLeverChange = this.handleLeverChange.bind(this);
    this.state = {
      leverStatuses: makeZeroFilledArray(props.model.levers.length)
    };
  }

  handleLeverChange (leverId, optionIndex, e) {
    e.preventDefault();
    const { leverStatuses } = this.state;
    leverStatuses[leverId] = optionIndex;

    this.setState({
      leverStatuses
    });
  }

  renderLever (lever) {
    const { leverStatuses } = this.state;
    const checkedOption = leverStatuses[lever.id] ? leverStatuses[lever.id] : 0;

    return (
      <div className='form__group econtrols__item'>
        <label className='form__label'>{lever.label}</label>
        {lever.options.map((option, i) => {
          return (
            <label
              className='form__option form__option--custom-radio'
              onClick={this.handleLeverChange.bind(this, lever.id, i)}
            >
              <input
                type='radio'
                name={`form-radio-${lever.id}`}
                id={`form-radio-${i}`}
                value={i}
                checked={checkedOption === i}
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
              {model.levers.map(this.renderLever)}
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
