/* eslint-disable no-async-promise-executor */

import RenderTask from './render-task';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class AnimationQueue {
  promise = new Promise((res) => res());

  @tracked tasks = A();

  renderTaskFor(component) {
    return this.tasks.find((task) => task.component === component);
  }

  queueRender(component, fromRoute, attributes) {
    const existing = this.tasks.find((task) => task.component === component && task.reusable);

    if (existing) {
      existing.reset();
      existing.fromRoute = fromRoute;
      existing.attributes = attributes;

      this.chainPromise(existing);

      return;
    }

    const task = new RenderTask(this, component, fromRoute, attributes);

    this.tasks.pushObject(task);

    this.chainPromise(task);
  }

  queueTeardown(component, toRoute) {
    this.tasks.find((task) => task.component === component && !task.tearingdown).teardown(toRoute);
  }

  chainPromise(task) {
    this.promise = new Promise(async (res) => {
      await this.promise;

      await task.perform();

      res();
    });
  }

  remove(task) {
    this.tasks.removeObject(task);
  }

  hasInDOM(routeName) {
    return this.tasks.some((task) => task.inDOM && task.component.args.name === routeName);
  }
}
