import { setModifierManager, capabilities } from '@ember/modifier';
import { isArray } from '@ember/array';

const AnimateOutManager = {
  capabilities: capabilities('3.13'),

  createModifier() {},

  installModifier(state, element, { positional }) {
    const [component, fn] = isArray(positional[0]) ? positional[0] : positional;

    const renderTask = component.args.__renderTask__;

    if (renderTask) {
      renderTask.registerOutAnimation((opts) => fn(element, opts));
    }
  },

  updateModifier() {},

  destroyModifier() {}
};

export default setModifierManager(() => AnimateOutManager, class AnimateOutModifier {});
