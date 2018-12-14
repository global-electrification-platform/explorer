import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../../config';

import ShadowScrollbars from '../../ShadowScrollbar';

class Levers extends Component {
  constructor (props) {
    super(props);

    this.renderLever = this.renderLever.bind(this);
  }

  renderLever (lever) {
    const { leversState } = this.props;
    const checkedOption = leversState[lever.id];

    return (
      <div className='form__group econtrols__item' key={`${lever.id}`}>
        <label className='form__label'>{lever.label}</label>
        {lever.options.map((option, i) => {
          return (
            <label
              key={`${lever.id}-${i}`}
              className='form__option form__option--custom-radio'
            >
              <input
                type='radio'
                name={`form-radio-${lever.id}`}
                id={`form-radio-${i}`}
                value={i}
                checked={checkedOption === i}
                onChange={this.props.handleLeverChange.bind(this, lever.id, i)}
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
    const { leversConfig, updateScenario, leversState } = this.props;
    return (
      <section className='econtrols__section' id='econtrols-scenarios'>
        <h1 className='econtrols__title'>Scenarios</h1>
        <form className='form econtrols__block' id='#econtrols__scenarios'>
          <div className='econtrols__subblock'>
            <ShadowScrollbars theme='light'>
              {leversConfig.map(this.renderLever)}
            </ShadowScrollbars>
          </div>
          <div className='form__actions econtrols__actions'>
            <button
              type='submit'
              className='econtrols__submit'
              title='Apply'
              onClick={e => {
                e.preventDefault();
                updateScenario({ levers: leversState });
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
    updateScenario: T.func,
    handleLeverChange: T.func,
    leversConfig: T.array,
    leversState: T.array
  };
}

export default Levers;
