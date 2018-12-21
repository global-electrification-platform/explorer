'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';

import ShadowScrollbars from '../ShadowScrollbar';
import Dropdown from '../Dropdown';

// React component for the layer control.
// It is disconnected from the global state because it needs to be included
// via the mapbox code.
export default class LayerControlDropdown extends React.Component {
  render () {
    const { layersConfig, layersState, handleLayerChange } = this.props;

    return (
      <Dropdown
        className='layers-menu'
        triggerClassName='layers-menu-trigger'
        triggerActiveClassName='button--active'
        triggerText='Map layers'
        triggerTitle='Toggle map layers'
        direction='up'
        alignment='left'
      >
        <ShadowScrollbars theme='light'>
          <h6 className='drop__title'>Toggle layers</h6>
          <ul className='layers-list'>
            {layersConfig.map((l, idx) => (
              <li className='layers-list__item' key={l.id}>
                <div className='form__group'>
                  <Toggle
                    text={l.label}
                    name={`switch-${l.id}`}
                    title='Toggle on/off'
                    checked={layersState[idx]}
                    onChange={() => handleLayerChange(idx)}
                  />
                </div>
                {l.source && (
                  <div className='form__help'>
                    <p>
                      Source:{' '}
                      <a target='_blank' href={l.source.url} title='View'>
                        {l.source.description}
                      </a>
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </ShadowScrollbars>
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

const Toggle = props => {
  const { text, name, title, checked, onChange } = props;

  return (
    <label
      htmlFor={name}
      className='form__option form__option--switch'
      title={title}
    >
      <input
        type='checkbox'
        name={name}
        id={name}
        value='on'
        checked={checked}
        onChange={onChange}
      />
      <span className='form__option__text'>{text}</span>
      <span className='form__option__ui' />
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
