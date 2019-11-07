import { setModifierManager, capabilities } from '@ember/modifier';

const AnimateOutManager = {
  capabilities: capabilities('3.13'),

  createModifier() {
    return { element: null, renderTask: null };
  },

  installModifier(state, element, { positional }) {
    state.element = element;

    this.registerOutAnimation(state, positional);
  },

  updateModifier(state, { positional }) {
    if (!state.renderTask) {
      this.registerOutAnimation(state, positional);
    }
  },

  destroyModifier() {},

  registerOutAnimation(state, [component, fn]) {
    state.renderTask = component.args ? component.args.__renderTask__ : component.__renderTask__;

    if (state.renderTask) {
      state.renderTask.registerOutAnimation(fn, state.element);
    }
  }
};

export default setModifierManager(() => AnimateOutManager, class AnimateOutModifier {});
