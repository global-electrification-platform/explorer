import React, { Component } from 'react';

class Docs extends Component {
  render () {
    return (
      <section className='inpage inpage--horizontal inpage--docs'>
        <header className='inpage__header'>
          <div class='inpage__subheader'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Documentation</h1>
            </div>
          </div>
          <nav className='inpage__nav'>
            <dl className='index-menu'>
              <dt>Global</dt>
              <dd><a href='#' title='Read' className='index-menu__link index-menu__link--active'><span>Input data</span></a></dd>
              <dd><a href='#' title='Read' className='index-menu__link'><span>Lorem ipsum</span></a></dd>
              <dd><a href='#' title='Read' className='index-menu__link'><span>Dolor sit amet</span></a></dd>
              <dt>Models</dt>
              <dd><a href='#' title='Read' className='index-menu__link'><span>OnSETT</span></a></dd>
              <dd><a href='#' title='Read' className='index-menu__link'><span>Model lorem</span></a></dd>
              <dd><a href='#' title='Read' className='index-menu__link'><span>Ipsum model</span></a></dd>
            </dl>
          </nav>
        </header>
        <div className='inpage__body'>
          <div className='prose'>
            <h2>Input data</h2>
            <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
            <p>Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Praesendapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
            <p>Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis.</p>
          </div>
        </div>
      </section>
    );
  }
}

export default Docs;
