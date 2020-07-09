import AnimationQueue from 'ember-animated-routes/lib/animation-queue';
import { helper } from '@ember/component/helper';

export default helper(function animationQueue() {
  return new AnimationQueue();
});
