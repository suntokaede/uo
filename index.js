import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import App from './modules/App'
import About from './modules/About'
import Works from './modules/Works'
import Blog from './modules/Blog'

render((<Router history={hashHistory}>
           <Route path="/" component={App} />
           <Route path="/about" component={About} />
           <Route path="/works" component={Works} />
           <Route path="/blog" component={Blog} >
            <Route path="/blog/:id" component={Blog} />
            <Route path="/blog/category/:category" component={Blog} />
            <route path="/blog/tag/:tag" component={Blog} />
           </Route>
       </Router>) 
, document.getElementById('app'));

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-90419155-1', 'auto');
ga('send', 'pageview', location.pathname + location.search  + location.hash);

window.addEventListener('hashchange', () => {
  ga('send', 'pageview', location.pathname + location.search  + location.hash);
});