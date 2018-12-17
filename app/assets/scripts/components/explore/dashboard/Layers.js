import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import ShadowScrollbars from '../../ShadowScrollbar';

import { environment } from '../../../config';

class Layers extends Component {
  render () {
    const { layersConfig, layersState, handleLayerChange } = this.props;

    return (
      <section className='econtrols__section' id='econtrols-layers'>
        <h1 className='econtrols__title'>Layers</h1>

        <form className='form econtrols__block' id='#econtrols__scenarios'>
          <div className='econtrols__subblock'>
            <ShadowScrollbars theme='light'>
              {layersConfig.map((l, idx) => (
                <div key={l.id} className='form__group econtrols__item'>
                  <label htmlFor={`layer-${l.label}`} className='form__option form__option--switch' title='Toggle on/off'>
                    <input type='checkbox' name={`layer-${l.label}`} id={`layer-${l.label}`} value='on' checked={layersState[idx]} onChange={() => handleLayerChange(idx)} />
                    <span className='form__option__text'>{l.label}</span>
                    <span className='form__option__ui'></span>
                  </label>
                </div>
              ))}
            </ShadowScrollbars>
          </div>
        </form>
      </section>
    );
  }
}

if (environment !== 'production') {
  Layers.propTypes = {
    layersConfig: T.array,
    layersState: T.array,
    handleLayerChange: T.func
  };
}

export default Layers;
