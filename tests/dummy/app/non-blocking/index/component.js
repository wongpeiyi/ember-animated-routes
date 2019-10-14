import Component from '@glimmer/component';
import { animate } from 'velocity-animate';
import { log } from 'dummy/lib/log';

export default class IndexComponent extends Component {
  async in(element, { fromRoute, next }) {
    log(element, `<p>[IN] [START] fromRoute:${fromRoute && fromRoute.name}</p>`);

    animate(element, 'stop');

    next();

    await animate(element, { translateY: 200 }, { duration: 500 });

    log(element, `<p>[IN] [END] fromRoute:${fromRoute && fromRoute.name}</p>`);
  }

  async out(element, { toRoute, next }) {
    log(element, `<p>[OUT] [START] toRoute:${toRoute && toRoute.name}</p>`);

    animate(element, 'stop');

    next();

    await animate(element, { translateY: 0 }, { duration: 500 });

    log(element, `<p>[OUT] [END] toRoute:${toRoute && toRoute.name}</p>`);
  }
}
