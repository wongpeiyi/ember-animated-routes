import { setModifierManager, capabilities } from '@ember/modifier';

const AnimateOutManager = {
  capabilities: capabilities('3.13'),

  createModifier() {},

  installModifier(state, element, { positional }) {
    const [component, fn] = positional;

    component.args.__renderTask__.registerOutAnimation((opts) => fn(element, opts));
  },

  updateModifier() {},

  destroyModifier() {}
};

export default setModifierManager(() => AnimateOutManager, class AnimateOutModifier {});
