/**
 * @param {string} type 
 * @param {*} argNames 
 */
const genActionCreator = (type, ...argNames) => {
  return function (...args) {
    let action = { type };

    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    });
    return action;
  }
};

/**
 * @param {*} prefixes
 *    It can be (do NOT add leading/trailing forward slash):
 *    ```
 *    'app/worspace'
 *    ```
 *    or:
 *    ```
 *    'app', 'workspace'
 *    ```
 *    or:
 *    ```
 *    ['app', 'workspace']
 *    ```
 */
const genActionTypeCreator = (...prefixes) => {
  if (prefixes[0] instanceof Array) {
    prefixes = prefixes[0];
  }
  let prefix = prefixes.join('/').replace('//', '/');
  return function (...suffixes) {
    if (suffixes[0] instanceof Array) {
      suffixes = suffixes[0];
    }
    let suffix = suffixes.join('/').replace('//', '/');
    return `${prefix}/${suffix}`;
  };
};

export { genActionCreator, genActionTypeCreator };
