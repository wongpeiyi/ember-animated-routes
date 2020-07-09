import { helper } from '@ember/component/helper';

export default helper(function inDom([queue, routeName]) {
  return queue.hasInDOM(routeName);
});
