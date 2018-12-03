import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import InputRange from 'react-input-range';

import { environment } from '../../../config';

import ShadowScrollbars from '../../ShadowScrollbar';

class Filters extends Component {
  constructor (props) {
    super(props);

    this.renderRangeFilter = this.renderRangeFilter.bind(this);
  }

  renderRangeFilter (filter) {
    const filterState = this.props.filtersState[filter.id];
    const { min, max } = filter.range;

    return (
      <div className='form__group econtrols__item' key={`${filter.id}`}>
        <label htmlFor='slider-1' className='form__label'>
          {filter.label}
        </label>
        <InputRange
          minValue={min}
          maxValue={max}
          value={filterState}
          onChange={this.props.handleFilterChange.bind(this, filter.id)}
        />
      </div>
    );
  }

  renderOptionsFilter (filter) {
    const filterState = this.props.filtersState[filter.id];
    return (
      <div className='form__group econtrols__item' key={`${filter.id}`}>
        <label className='form__label'>{filter.label}</label>
        {filter.options &&
          filter.options.map((option, i) => {
            return (
              <label
                key={`${filter.id}-${i}`}
                className='form__option form__option--custom-radio'
              >
                <input
                  type='radio'
                  name={`form-radio-${filter.id}`}
                  id={`form-radio-${i}`}
                  value={i}
                  checked={filterState === i}
                  onChange={this.props.handleFilterChange.bind(
                    this,
                    filter.id,
                    i
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
    return filters.map(filter => {
      if (filter.type === 'range') return this.renderRangeFilter(filter);
      else return this.renderOptionsFilter(filter);
    });
  }

  render () {
    const { filters } = this.props;

    return (
      <section className='econtrols__section' id='econtrols-filters'>
        <h1 className='econtrols__title'>Filters</h1>
        <form className='form econtrols__block' id='#econtrols__scenarios'>
          <div className='econtrols__subblock'>
            <ShadowScrollbars theme='light'>
              {filters && filters.length > 0 && this.renderFilters(filters)}
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

if (environment !== 'production') {
  Filters.propTypes = {
    filters: T.array,
    filtersState: T.array,
    handleFilterChange: T.func
  };
}

export default Filters;
