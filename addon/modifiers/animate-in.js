import { setModifierManager, capabilities } from '@ember/modifier';
import { isArray } from '@ember/array';

const AnimateInManager = {
  capabilities: capabilities('3.13'),

  createModifier() {},

  installModifier(state, element, { positional }) {
    const [component, fn] = isArray(positional[0]) ? positional[0] : positional;

    const renderTask = component.args.__renderTask__;

    if (renderTask) {
      renderTask.performInAnimation((opts) => fn(element, opts));
    }
  },

  updateModifier() {},

  destroyModifier() {}
};

export default setModifierManager(() => AnimateInManager, class AnimateInModifier {});
