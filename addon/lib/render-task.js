import { tracked } from '@glimmer/tracking';

export default class RenderTask {
  fromRoute;
  toRoute;
  tearingdown;
  resolveTeardown;
  reusable;

  inPromises = [];
  inAnimations = [];
  outAnimations = [];

  @tracked inDOM = false;
  @tracked attributes;

  constructor(queue, component, fromRoute, attributes) {
    this.queue = queue;
    this.component = component;
    this.fromRoute = fromRoute;
    this.attributes = attributes;

    this.reset();
  }

  reset() {
    this.tearingdown = false;
    this.teardownPromise = new Promise((res) => (this.resolveTeardown = res));

    this.inPromises = [];
    this.inAnimations.forEach((fn) => this.performInAnimation(fn));
  }

  async perform() {
    this.inDOM = true;

    await Promise.all(this.inPromises);

    await this.teardownPromise;

    await this.transitionOut();

    this.reusable = true;
  }

  teardown(toRoute) {
    this.toRoute = toRoute;
    this.tearingdown = true;

    this.resolveTeardown();
  }

  performInAnimation(fn) {
    if (!this.inAnimations.includes(fn)) {
      this.inAnimations.push(fn);
    }

    const promise = new Promise(async (next) => {
      await fn({
        next,
        fromRoute: this.fromRoute
      });

      next();
    });

    this.inPromises.push(promise);
  }

  registerOutAnimation(fn) {
    this.outAnimations.push(fn);
  }

  async transitionOut() {
    const nextPromises = [];
    const fnPromises = [];

    for (let fn of this.outAnimations) {
      const nextPromise = new Promise(async (next) => {
        const fnPromise = fn({
          next,
          toRoute: this.toRoute
        });

        fnPromises.push(fnPromise);

        await fnPromise;

        next();
      });

      nextPromises.push(nextPromise);
    }

    Promise.all(fnPromises).then(() => {
      if (this.tearingdown) {
        this.inDOM = false;
        this.queue.remove(this);
      }
    });

    return Promise.all(nextPromises);
  }
}
