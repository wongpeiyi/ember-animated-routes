import { setModifierManager, capabilities } from '@ember/modifier';
import { isArray } from '@ember/array';

const AnimateOutManager = {
  capabilities: capabilities('3.13'),

  createModifier() {
    return { element: null };
  },

  installModifier(state, element, { positional }) {
    state.element = element;
    state.position = positional;
    this.registerOutAnimation(element, positional);
  },

  updateModifier(state, { positional }) {
    this.registerOutAnimation(state.element, positional);
  },

  destroyModifier() {},

  registerOutAnimation(element, args) {
    const [component, fn] = isArray(args[0]) ? args[0] : args;

    const renderTask = component.args ? component.args.__renderTask__ : component.__renderTask__;

    if (renderTask) {
      renderTask.registerOutAnimation(fn, element);
    }
  }
};

export default setModifierManager(() => AnimateOutManager, class AnimateOutModifier {});
