import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('concurrent', function() {
    this.route('index');
    this.route('other');
  });
  this.route('non-blocking', function() {
    this.route('index');
    this.route('other');
  });
  this.route('shared', function() {
    this.route('index');
    this.route('other');
  });
});

export default Router;
