import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import ReactTooltip from 'react-tooltip';
import c from 'classnames';

import Levers from './Levers';
import Filters from './Filters';
import Dropdown from '../../Dropdown';

import { environment } from '../../../config';

class Dashboard extends Component {
  constructor (props) {
    super(props);

    this.renderTabs = this.renderTabs.bind(this);

    this.state = {
      activeTab: 'scenarios'
    };
  }

  onYearClick (year, e) {
    e.preventDefault();
    this.props.handleYearChange(year);
  }

  renderTabs () {
    const self = this;
    const { activeTab } = this.state;
    return ['scenarios', 'filters'].map((tab, index) => {
      return (
        <li className='nav__tab' role='presentation' key={index}>
          <a
            className={`nav__link ${
              activeTab === tab ? 'nav__link--active' : ''
            }`}
            onClick={event => {
              event.preventDefault();
              self.setState({ activeTab: tab });
            }}
          >
            <span>{tab}</span>
          </a>
        </li>
      );
    });
  }

  renderTabContent () {
    const { activeTab } = this.state;
    if (activeTab === 'scenarios') {
      const { levers } = this.props.model;
      const { leversState } = this.props;
      return (
        <Levers
          handleLeverChange={this.props.handleLeverChange}
          leversConfig={levers}
          leversState={leversState}
        />
      );
    } else if (activeTab === 'filters') {
      const { filters } = this.props.model;
      const { filtersState } = this.props;
      return (
        <Filters
          filtersConfig={filters}
          filtersState={filtersState}
          handleFilterChange={this.props.handleFilterChange}
        />
      );
    }
  }

  popoverRenderFn (code) {
    if (code === null) return;
    // Because of the way that ReactTooltip works, code has to be a string.
    // It has the following format: <type>-<idx>
    // Example: lever-0
    const match = code.match(/^([a-z0-9]+)-(.+)/);
    if (!match) return;

    const [, type, n] = match;
    const idx = parseInt(n);

    let obj;

    if (type === 'lever') {
      obj = this.props.model.levers[idx];
    } else if (type === 'filter') {
      obj = this.props.model.filters[idx];
    } else {
      return;
    }

    if (!obj) return;

    return (
      <div className='popover__contents'>
        <div className='popover__body'>{obj.description}</div>
      </div>
    );
  }

  renderApplyControls () {
    const { model, year } = this.props;
    const hasTimesteps = !!model.timesteps;

    let yearSelectorElement = null;
    if (hasTimesteps) {
      yearSelectorElement = (
        <Dropdown
          triggerClassName='econtrols__time-select'
          triggerActiveClassName='button--active'
          triggerText={year || 'n/a'}
          triggerTitle='Select year'
          direction='up'
          alignment='center'
        >
          <ul className='drop__menu drop__menu--select'>
            {model.timesteps.map(t => {
              const classes = c('drop__menu-item', {
                'drop__menu-item--active': year === t
              });

              return (
                <li key={t}>
                  <a
                    href='#'
                    className={classes}
                    data-hook='dropdown:close'
                    onClick={this.onYearClick.bind(this, t)}
                  >
                    {t}
                  </a>
                </li>
              );
            })}
          </ul>
        </Dropdown>
      );
    }

    return (
      <div className='button-group button-group--horizontal'>
        {yearSelectorElement}
        <button
          type='submit'
          className='econtrols__submit'
          title='Apply'
          onClick={e => {
            e.preventDefault();
            this.props.onApplyClick();
          }}
        >
          <span>Apply</span>
        </button>
      </div>
    );
  }

  render () {
    return (
      <div className='econtrols'>
        <nav className='nav'>
          <ul className='nav__tablist' role='tablist'>
            {this.renderTabs()}
          </ul>
        </nav>
        {this.renderTabContent()}
        <div className='econtrols__actions'>
          <button
            type='reset'
            className='econtrols__reset'
            title='Reset'
            onClick={e => {
              e.preventDefault();
              this.props.onResetClick();
            }}
          >
            <span>Reset</span>
          </button>
          {this.renderApplyControls()}
        </div>
        <ReactTooltip
          id='econtrol-popover'
          effect='solid'
          type='dark'
          className='popover'
          wrapper='article'
          globalEventOff='click'
          place='right'
          getContent={dataTip => this.popoverRenderFn(dataTip)}
          overridePosition={({left,top}, e, target, node, place, desiredPlace, effect, offset) => {
            // off the top of the screen, nudge it on.
            if (top < 0) { top = 10; }
            // e is sometimes the target, and sometimes the event.  -- React-tooltip 3.9
            const tgt = e.target ? e.target : e;
            const {bottom, height} = tgt.getBoundingClientRect();
            if ((window.innerHeight - bottom) < (bottom - top)) {
              // assuming that we're generally positioned with the popup centered.
              // move the top up by what's overhanging the bottom of the anchor,
              // so that we're basically positioned right-bottom rather than right-center.
              // more advanced work would just put this 10px off the bottom of the viewport
              // but next time.
              top = top - (bottom - top - 2*height);
            }
            return {left,top};
          }}
        />
      </div>
    );
  }
}

if (environment !== 'production') {
  Dashboard.propTypes = {
    onApplyClick: T.func,
    onResetClick: T.func,
    handleLeverChange: T.func,
    handleFilterChange: T.func,
    handleYearChange: T.func,
    model: T.object,
    leversState: T.array,
    filtersState: T.array,
    year: T.number
  };
}

export default Dashboard;
