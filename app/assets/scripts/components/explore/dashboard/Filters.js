import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import InputRange from 'react-input-range';
import ReactTooltip from 'react-tooltip';
import c from 'classnames';

import { environment } from '../../../config';

import ShadowScrollbars from '../../ShadowScrollbar';

class Filters extends Component {
  constructor (props) {
    super(props);

    this.renderRangeFilter = this.renderRangeFilter.bind(this);
  }

  componentDidMount () {
    ReactTooltip.rebuild();
  }

  renderRangeFilter (filter, filterIdx) {
    const filterState = this.props.filtersState[filterIdx];
    const { min, max } = filter.range;

    return (
      <div className='form__group econtrols__item' key={`${filter.id}`}>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label' htmlFor={`slider-${filter.id}`}>
              {filter.label}
            </label>
          </div>
          {filter.description && (
            <div className='form__inner-actions'>
              <button
                type='button'
                className='eci-info'
                data-tip={`filter-${filterIdx}`}
                data-for='econtrol-popover'
                data-event='click'
              >
                <span>Lever info</span>
              </button>
            </div>
          )}
        </div>
        <div className='form__slider-group'>
          <ManualInput
            id={`slider-input-min-${filter.id}`}
            label='Min value'
            value={filterState.min}
            min={min}
            max={filterState.max}
            onChange={v =>
              this.props.handleFilterChange(filterIdx, {
                ...filterState,
                min: v
              })
            }
          />
          <InputRange
            minValue={min}
            maxValue={max}
            name={`slider-${filter.id}`}
            id={`slider-${filter.id}`}
            value={filterState}
            onChange={this.props.handleFilterChange.bind(this, filterIdx)}
          />
          <ManualInput
            id={`slider-input-max-${filter.id}`}
            label='Max value'
            value={filterState.max}
            min={filterState.min}
            max={max}
            onChange={v =>
              this.props.handleFilterChange(filterIdx, {
                ...filterState,
                max: v
              })
            }
          />
        </div>
      </div>
    );
  }

  renderOptionsFilter (filter, filterIdx) {
    const filterState = this.props.filtersState[filterIdx];

    return (
      <div className='form__group econtrols__item' key={`${filter.id}`}>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label'>{filter.label}</label>
          </div>
          {filter.description && (
            <div className='form__inner-actions'>
              <button
                type='button'
                className='eci-info'
                data-tip={`filter-${filterIdx}`}
                data-for='econtrol-popover'
                data-event='click'
              >
                <span>Lever info</span>
              </button>
            </div>
          )}
        </div>
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
    const { filtersConfig } = this.props;

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
        </form>
      </section>
    );
  }
}

if (environment !== 'production') {
  Filters.propTypes = {
    filtersConfig: T.array,
    filtersState: T.array,
    handleFilterChange: T.func
  };
}

export default Filters;

/**
 * Input field for numeric values that errors when the value is not
 * a number or is outside the min/max range
 */
class ManualInput extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      originalVal: props.value,
      value: props.value,
      errored: false
    };

    this.onValueChange = this.onValueChange.bind(this);
    this.onFieldBlur = this.onFieldBlur.bind(this);
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (prevState.value !== nextProps.value) {
      return { value: nextProps.value };
    } else return null;
  }

  onValueChange (e) {
    this.setState({ value: e.target.value });
  }

  onFieldBlur (e) {
    const { value, originalVal } = this.state;
    const { min, max, onChange } = this.props;

    if (isNaN(value) || value === '' || value < min || value > max) {
      this.setState({
        value: originalVal,
        errored: true
      });
      // We have to clear the error state after the animation so it can
      // error again.
      setTimeout(() => {
        this.setState({ errored: false });
      }, 550);
    } else {
      // all good.
      this.setState({ errored: false, originalVal: Number(value) });
      onChange(Number(value));
    }
  }

  render () {
    const { id, label } = this.props;

    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input
          type='number'
          name={id}
          id={id}
          className={c('form__control form__control--small', {
            'form__control--invalid': this.state.errored
          })}
          value={this.state.value}
          onBlur={this.onFieldBlur}
          onChange={this.onValueChange}
        />
      </div>
    );
  }
}

if (environment !== 'production') {
  ManualInput.propTypes = {
    id: T.string,
    label: T.string,
    value: T.number,
    min: T.number,
    max: T.number,
    onChange: T.func
  };
}
