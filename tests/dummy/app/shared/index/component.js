import Component from '@glimmer/component';
import { animate } from 'velocity-animate';
import { log } from 'dummy/lib/log';

export default class IndexComponent extends Component {
  async in(element, { fromRoute }) {
    log(element, `<p>[IN] [START] fromRoute:${fromRoute && fromRoute.name}</p>`);

    if (!element.style.opacity) {
      element.style.opacity = 0;
    }

    await animate(element, { opacity: 1 }, { duration: 500 });

    log(element, `<p>[IN] [END] fromRoute:${fromRoute && fromRoute.name}</p>`);
  }

  async out(element, { toRoute }) {
    log(element, `<p>[OUT] [START] toRoute:${toRoute && toRoute.name}</p>`);

    await animate(element, { opacity: 0 }, { duration: 500 });

    log(element, `<p>[OUT] [END] toRoute:${toRoute && toRoute.name}</p>`);
  }
}
