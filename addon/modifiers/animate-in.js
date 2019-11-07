import { setModifierManager, capabilities } from '@ember/modifier';

const AnimateInManager = {
  capabilities: capabilities('3.13'),

  createModifier() {
    return { element: null, renderTask: null };
  },

  installModifier(state, element, { positional }) {
    state.element = element;

    this.animateIn(state, positional);
  },

  updateModifier(state, { positional }) {
    if (!state.renderTask) {
      this.animateIn(state, positional);
    }
  },

  destroyModifier() {},

  animateIn(state, [component, fn]) {
    state.renderTask = component.args ? component.args.__renderTask__ : component.__renderTask__;

    if (state.renderTask) {
      state.renderTask.performInAnimation(fn, state.element);
    }
  }
};

export default setModifierManager(() => AnimateInManager, class AnimateInModifier {});
