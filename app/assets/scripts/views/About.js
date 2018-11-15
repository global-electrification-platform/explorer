import React, { Component } from 'react';

class About extends Component {
  render () {
    return (
      <article className='inpage inpage--single inpage--about'>
        <header className='inpage__header'>
          <div class='inpage__subheader'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>About</h1>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='prose'>
            <h2>The tool</h2>
            <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
            <p>Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Praesendapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
            <p>Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis.</p>
            <h2>Credits</h2>
            <dl className='logo-list'>
              <dt>Supporters</dt>
              <dd><a href="https://loremipsum.io/21-of-the-best-placeholder-image-generators/" title="Visit placeholder"><img width="640" height="320" alt="Placeholder logo" src="https://fakeimg.pl/640x320" /><span>Placeholder</span></a></dd>
              <dd><a href="https://loremipsum.io/21-of-the-best-placeholder-image-generators/" title="Visit placeholder"><img width="640" height="320" alt="Placeholder logo" src="https://fakeimg.pl/640x320" /><span>Placeholder</span></a></dd>
              <dd><a href="https://loremipsum.io/21-of-the-best-placeholder-image-generators/" title="Visit placeholder"><img width="640" height="320" alt="Placeholder logo" src="https://fakeimg.pl/640x320" /><span>Placeholder</span></a></dd>
              <dd><a href="https://loremipsum.io/21-of-the-best-placeholder-image-generators/" title="Visit placeholder"><img width="640" height="320" alt="Placeholder logo" src="https://fakeimg.pl/640x320" /><span>Placeholder</span></a></dd>
              <dd><a href="https://loremipsum.io/21-of-the-best-placeholder-image-generators/" title="Visit placeholder"><img width="640" height="320" alt="Placeholder logo" src="https://fakeimg.pl/640x320" /><span>Placeholder</span></a></dd>
              <dt>Developed by</dt>
              <dd><a class="logo-devseed" href="http://developmentseed.org/" title="Visit Development Seed"><img width="750" height="128" alt="Development Seed logo" src="/assets/graphics/content/logo-devseed-flat-pos.svg" /><span>Development Seed</span></a></dd>
            </dl>
          </div>
        </div>
      </article>
    );
  }
}

export default About;
