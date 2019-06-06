import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import { Redirect, Route, Switch, NavLink } from 'react-router-dom';

import App from './App';
import ShadowScrollbars from '../components/ShadowScrollbar';
import MarkdownPageViewer from '../components/connected/MarkdownPageViewer';

import { environment } from '../config';

const layout = [
  {
    name: 'Global',
    pages: [
      {
        name: 'Overview',
        url: '/',
        fileUrl: 'https://raw.githubusercontent.com/global-electrification-platform/User_Guide/master/user-manual/source/Overview.md'
      },
      {
        name: 'GEP Explorer',
        url: '/gep-explorer',
        fileUrl: 'https://raw.githubusercontent.com/global-electrification-platform/User_Guide/master/user-manual/source/GEP Explorer.md'
      },
      {
        name: 'GEP Generator',
        url: '/gep-generator',
        fileUrl: 'https://raw.githubusercontent.com/global-electrification-platform/User_Guide/master/user-manual/source/GEP Generator.md'
      },
      {
        name: 'GEP Toolbox',
        url: '/gep-toolbox',
        fileUrl: 'https://raw.githubusercontent.com/global-electrification-platform/User_Guide/master/user-manual/source/GEP Toolbox.md'
      },
      {
        name: 'Interoperability',
        url: '/interoperability',
        fileUrl: 'https://raw.githubusercontent.com/global-electrification-platform/User_Guide/master/user-manual/source/Interoperability.md'
      },
      {
        name: 'Contact',
        url: '/contact',
        fileUrl: 'https://raw.githubusercontent.com/global-electrification-platform/User_Guide/master/user-manual/source/Contact.md'
      }
    ]
  }
];

class Docs extends Component {
  render () {
    const url = this.props.match.url;

    return (
      <App pageTitle='Documentation'>
        <section className='inpage inpage--horizontal inpage--docs'>
          <header className='inpage__header'>
            <div className='inpage__subheader'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Documentation</h1>
              </div>
            </div>
            <nav className='inpage__nav'>
              <ShadowScrollbars theme='light'>
                <dl className='index-menu'>
                  {layout.map(section => (
                    <React.Fragment key={section.name}>
                      <dt>{section.name}</dt>
                      {section.pages.map(page => (
                        <dd key={page.name}>
                          <NavLink
                            exact
                            to={`${url}${page.url}`}
                            title='View page'
                            activeClassName='index-menu__link--active'
                            className='index-menu__link'
                          >
                            <span>{page.name}</span>
                          </NavLink>
                        </dd>
                      ))}
                    </React.Fragment>
                  ))}
                </dl>
              </ShadowScrollbars>
            </nav>
          </header>
          <div className='inpage__body'>
            <div className='prose'>
              <Switch>
                {layout.map(s =>
                  s.pages.map(page => (
                    <Route
                      exact
                      key={page.name}
                      path={`${url}${page.url}`}
                      render={props => (
                        <MarkdownPageViewer
                          fileUrl={page.fileUrl}
                          title={page.name}
                          {...props}
                        />
                      )}
                    />
                  ))
                )}
                <Redirect from='*' to='/documentation' />
              </Switch>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  Docs.propTypes = {
    match: T.object
  };
}

export default Docs;
