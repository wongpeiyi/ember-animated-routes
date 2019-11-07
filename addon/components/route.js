import Component from '@glimmer/component';
import AnimationQueue from 'ember-animated-routes/lib/animation-queue';
import template from 'ember-animated-routes/templates/components/route';
import { setComponentTemplate } from '@ember/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

class RouteComponent extends Component {
  queue;

  @tracked isActive;

  @service router;

  constructor() {
    super(...arguments);

    this.router.on('routeDidChange', (transition) => this.computeIsActive(transition));

    this.queue = this.args.queue || new AnimationQueue();

    this.computeIsActive();
  }

  get componentName() {
    return this.args.component || this.routeName.replace(/\./g, '/');
  }

  get routeName() {
    return this.args.name.replace(/\//g, '.');
  }

  get routeHandler() {
    return this.router.currentRoute.find((handler) => handler.name === this.routeName);
  }

  get renderTask() {
    return this.queue.renderTaskFor(this);
  }

  get shouldPreserve() {
    if (!this.args.preserveOn) {
      return false;
    }

    return this.args.preserveOn.split(' ').some((route) => this.router.isActive(route));
  }

  get inDOM() {
    return (this.renderTask && this.renderTask.inDOM) || this.args.alwaysRendered;
  }

  computeIsActive(transition) {
    const isActive = this.router.isActive(this.routeName);

    if (isActive && !this.isActive) {
      const fromRoute = transition ? transition.from : null;

      this.queue.queueRender(this, fromRoute, this.routeHandler.attributes);

      this.isActive = true;
    } else if (!isActive && this.isActive && !this.shouldPreserve) {
      const toRoute = transition.to;

      this.queue.queueTeardown(this, toRoute);

      this.isActive = false;
    }
  }
}

export default setComponentTemplate(template, RouteComponent);
