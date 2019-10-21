import { setModifierManager, capabilities } from '@ember/modifier';

const AnimateOutManager = {
  capabilities: capabilities('3.13'),

  createModifier() {},

  installModifier(state, element, { positional }) {
    const [component, fn] = positional;

    const renderTask = component.args.__renderTask__;

    if (renderTask) {
      renderTask.registerOutAnimation((opts) => fn(element, opts));
    }
  },

  updateModifier() {},

  destroyModifier() {}
};

export default setModifierManager(() => AnimateOutManager, class AnimateOutModifier {});
