import { setModifierManager, capabilities } from '@ember/modifier';
import { isArray } from '@ember/array';

const AnimateInManager = {
  capabilities: capabilities('3.13'),

  createModifier() {
    return { element: null };
  },

  installModifier(state, element, { positional }) {
    state.element = element;

    this.animateIn(element, positional);
  },

  updateModifier(state, { positional }) {
    this.animateIn(state.element, positional);
  },

  destroyModifier() {},

  animateIn(element, args) {
    const [component, fn] = isArray(args[0]) ? args[0] : args;

    const renderTask = component.args.__renderTask__;

    if (renderTask) {
      renderTask.performInAnimation(fn, element);
    }
  }
};

export default setModifierManager(() => AnimateInManager, class AnimateInModifier {});
