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
    this.inDOMPromise = new Promise((res) => (this.didInsertIntoDOM = res));

    this.tearingdown = false;
    this.teardownPromise = new Promise((res) => (this.resolveTeardown = res));

    this.inPromises = [];
    this.inAnimations.forEach(([fn, element]) => this.performInAnimation(fn, element));
  }

  async perform() {
    this.inDOM = true;

    this.didInsertIntoDOM();

    await Promise.all(this.inPromises);

    await this.teardownPromise;

    await this.animateOut();

    this.reusable = true;
  }

  teardown(toRoute) {
    this.toRoute = toRoute;
    this.tearingdown = true;

    this.resolveTeardown();
  }

  async performInAnimation(fn, element) {
    if (!this.inAnimations.find(([existing]) => existing === fn)) {
      this.inAnimations.push([fn, element]);
    }

    await this.inDOMPromise;

    const promise = new Promise(async (next) => {
      await fn(element, {
        next,
        fromRoute: this.fromRoute
      });

      next();
    });

    this.inPromises.push(promise);
  }

  registerOutAnimation(fn, element) {
    if (!this.outAnimations.find(([existing]) => existing === fn)) {
      this.outAnimations.push([fn, element]);
    }
  }

  async animateOut() {
    const nextPromises = [];
    const fnPromises = [];

    for (let [fn, element] of this.outAnimations) {
      const nextPromise = new Promise(async (next) => {
        const fnPromise = fn(element, {
          next,
          toRoute: this.toRoute
        });

        fnPromises.push(fnPromise);

        await fnPromise;

        next();
      });

      nextPromises.push(nextPromise);
    }

    Promise.all(fnPromises).then(() => this.removeFromDOM());

    return Promise.all(nextPromises);
  }

  removeFromDOM() {
    if (this.tearingdown && !this.component.args.alwaysRendered) {
      this.inDOM = false;
      this.queue.remove(this);
    }
  }
}
