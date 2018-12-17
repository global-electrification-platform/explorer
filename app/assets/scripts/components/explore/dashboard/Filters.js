import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import InputRange from 'react-input-range';
import c from 'classnames';

import { environment } from '../../../config';

import ShadowScrollbars from '../../ShadowScrollbar';

class Filters extends Component {
  constructor (props) {
    super(props);

    this.renderRangeFilter = this.renderRangeFilter.bind(this);
  }

  renderRangeFilter (filter, filterIdx) {
    const filterState = this.props.filtersState[filterIdx];
    const { min, max } = filter.range;

    return (
      <div className='form__group econtrols__item' key={`${filter.id}`}>
        <label htmlFor={`slider-${filter.id}`} className='form__label'>
          {filter.label}
        </label>
        <div className='form__output-group'>
          <output htmlFor={`slider-${filter.id}`} className='form__output'>
            {filterState.min}
          </output>
          <output htmlFor={`slider-${filter.id}`} className='form__output'>
            {filterState.max}
          </output>
        </div>
        <InputRange
          minValue={min}
          maxValue={max}
          name={`slider-${filter.id}`}
          id={`slider-${filter.id}`}
          value={filterState}
          onChange={this.props.handleFilterChange.bind(this, filterIdx)}
        />
      </div>
    );
  }

  renderOptionsFilter (filter, filterIdx) {
    const filterState = this.props.filtersState[filterIdx];

    return (
      <div className='form__group econtrols__item' key={`${filter.id}`}>
        <label className='form__label'>{filter.label}</label>
        {filter.options &&
          filter.options.map(option => {
            return (
              <label
                key={option.id}
                className={c('form__option form__option--custom-checkbox', {
                  disabled:
                    filterState.length === 1 &&
                    filterState.indexOf(option.value) > -1
                })}
              >
                <input
                  type='checkbox'
                  name={`form-radio-${filter.id}`}
                  id={`form-radio-${option.id}`}
                  value={option.id}
                  checked={filterState.indexOf(option.value) > -1}
                  onChange={this.props.handleFilterChange.bind(
                    this,
                    filterIdx,
                    option.value
                  )}
                />
                <span className='form__option__ui' />
                <span className='form__option__text'>
                  {option.label || option.value}
                </span>
              </label>
            );
          })}
      </div>
    );
  }

  renderFilters (filters) {
    return filters.map((filter, filterIdx) => {
      if (filter.type === 'range') {
        return this.renderRangeFilter(filter, filterIdx);
      } else return this.renderOptionsFilter(filter, filterIdx);
    });
  }

  render () {
    const { filtersConfig, updateScenario, filtersState } = this.props;

    return (
      <section className='econtrols__section' id='econtrols-filters'>
        <h1 className='econtrols__title'>Filters</h1>
        <form className='form econtrols__block' id='#econtrols__scenarios'>
          <div className='econtrols__subblock'>
            <ShadowScrollbars theme='light'>
              {filtersConfig &&
                filtersConfig.length > 0 &&
                this.renderFilters(filtersConfig)}
            </ShadowScrollbars>
          </div>
          <div className='form__actions econtrols__actions'>
            <button
              type='submit'
              className='econtrols__submit'
              title='Apply'
              onClick={e => {
                e.preventDefault();
                updateScenario({ filters: filtersState });
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
  Filters.propTypes = {
    updateScenario: T.func,
    filtersConfig: T.array,
    filtersState: T.array,
    handleFilterChange: T.func
  };
}

export default Filters;
