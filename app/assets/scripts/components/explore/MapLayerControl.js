'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';

import Dropdown from '../Dropdown';

// React component for the layer control.
// It is disconnected from the global state because it needs to be included
// via the mapbox code.
export default class LayerControlDropdown extends React.Component {
  render () {
    const { layersConfig, layersState, handleLayerChange } = this.props;

    return (
      <Dropdown
        className='exp-map-layers-menu'
        triggerClassName='exp-map-layers-menu__trigger'
        triggerActiveClassName='button--active'
        triggerText='Map layers'
        triggerTitle='Toggle map layers'
        direction='up'
        alignment='left' >
        <h6 className='drop__title'>Toggle layers</h6>
        {layersConfig.map((l, idx) => (
          <div key={l.id} className='form__group econtrols__item'>
            <Toggle
              text={l.label}
              name={`switch-${l.id}`}
              title='Toggle on/off'
              checked={layersState[idx]}
              onChange={() => handleLayerChange(idx)}
            />
          </div>
        ))}
      </Dropdown>
    );
  }
}

if (environment !== 'production') {
  LayerControlDropdown.propTypes = {
    layersConfig: T.array,
    layersState: T.array,
    handleLayerChange: T.func
  };
}

const Toggle = (props) => {
  const {
    text,
    name,
    title,
    checked,
    onChange
  } = props;

  return (
    <label htmlFor={name} className='form__option form__option--switch' title={title}>
      <input type='checkbox' name={name} id={name} value='on' checked={checked} onChange={onChange}/>
      <span className='form__option__text'>{text}</span>
      <span className='form__option__ui'></span>
    </label>
  );
};

if (environment !== 'production') {
  Toggle.propTypes = {
    text: T.string,
    name: T.string,
    title: T.string,
    checked: T.bool,
    onChange: T.func
  };
}

LayerControlDropdown.propTypes = {
  layers: T.array,
  onLayerChange: T.func
};
