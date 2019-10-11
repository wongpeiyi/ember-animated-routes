import { setModifierManager, capabilities } from '@ember/modifier';

const AnimateInManager = {
  capabilities: capabilities('3.13'),

  createModifier() {},

  installModifier(state, element, { positional }) {
    const [component, fn] = positional;

    component.args.__renderTask__.performInAnimation((opts) => fn(element, opts));
  },

  updateModifier() {},

  destroyModifier() {}
};

export default setModifierManager(() => AnimateInManager, class AnimateInModifier {});
