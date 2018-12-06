import './bootstrap/rxjsOperators';

// load polyfills
import 'core-js/fn/array/includes';
import 'core-js/fn/array/find';
import 'core-js/fn/object/values';
import 'core-js/fn/object/entries';
import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';

// load some libraries
import ElementQueries from 'css-element-queries/src/ElementQueries';
import AOS from 'aos';
import 'aos/dist/aos.css';
import jQuery from 'jquery';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// initialize libraries
ElementQueries.listen();
AOS.init({
  once: true,
  duration: 300
});

window.$ = jQuery;
require('slick-carousel');
