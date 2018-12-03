import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../../config';

import ShadowScrollbars from '../../ShadowScrollbar';

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
      scenario: makeZeroFilledArray(props.model.levers.length)
    };
  }

  componentDidMount () {
    this.props.updateScenario(this.state.scenario.join('_'));
  }

  handleLeverChange (leverId, optionIndex) {
    const { scenario } = this.state;
    scenario[leverId] = optionIndex;

    this.setState({
      scenario
    });
  }

  renderLever (lever) {
    const { scenario } = this.state;
    const checkedOption = scenario[lever.id] ? scenario[lever.id] : 0;

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
                onChange={this.handleLeverChange.bind(this, lever.id, i)}
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
                this.props.updateScenario(this.state.scenario.join('_'));
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
    model: T.object
  };
}

export default Levers;
