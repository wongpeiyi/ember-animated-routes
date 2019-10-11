import Component from '@ember/component';
import AnimationQueue from 'ember-animated-routes/lib/animation-queue';
import template from 'ember-animated-routes/templates/components/route-container';
import { setComponentTemplate } from '@ember/component';

class RouteContainerComponent extends Component {
  queue = new AnimationQueue();
}

export default setComponentTemplate(template, RouteContainerComponent);
