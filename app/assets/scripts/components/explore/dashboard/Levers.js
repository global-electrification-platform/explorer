import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import ReactTooltip from 'react-tooltip';

import { environment } from '../../../config';

import ShadowScrollbars from '../../ShadowScrollbar';

class Levers extends Component {
  constructor (props) {
    super(props);

    this.renderLever = this.renderLever.bind(this);
  }

  componentDidMount () {
    ReactTooltip.rebuild();
  }

  renderLever (lever, leverIdx) {
    const { leversState } = this.props;
    const checkedOptionIdx = leversState[leverIdx];

    return (
      <div className='form__group econtrols__item' key={`${lever.id}`}>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label'>{lever.label}</label>
          </div>
          {lever.description && (
            <div className='form__inner-actions'>
              <button type='button' className='eci-info' data-tip={`lever-${leverIdx}`} data-for='econtrol-popover' data-event='click'><span>Lever info</span></button>
            </div>
          )}
        </div>
        {lever.options.map((option, oIdx) => {
          return (
            <label
              key={`${lever.id}-${oIdx}`}
              className='form__option form__option--custom-radio'
            >
              <input
                type='radio'
                name={`form-radio-${lever.id}`}
                id={`form-radio-${oIdx}`}
                value={oIdx}
                checked={checkedOptionIdx === oIdx}
                onChange={this.props.handleLeverChange.bind(this, leverIdx, oIdx)}
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
    const { leversConfig } = this.props;
    return (
      <section className='econtrols__section' id='econtrols-scenarios'>
        <h1 className='econtrols__title'>Scenarios</h1>
        <form className='form econtrols__block'>
          <div className='econtrols__subblock'>
            <ShadowScrollbars theme='light'>
              {leversConfig.map(this.renderLever)}
            </ShadowScrollbars>
          </div>
        </form>
      </section>
    );
  }
}

if (environment !== 'production') {
  Levers.propTypes = {
    handleLeverChange: T.func,
    leversConfig: T.array,
    leversState: T.array
  };
}

export default Levers;
