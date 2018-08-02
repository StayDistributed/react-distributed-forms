/**
 * Get state based on props and current internal state
 * @param {*} { name, type, value, context: { values } }
 * @param {*} state
 *
 * @returns { __initialized, __binding_value, name, type, value }
 */
export default function getDerivedStateFromProps(
  { name, type, value, context: { values } },
  state
) {
  let newState = state;

  if (!state.__initialized) {
    newState = {
      ...newState,
      __initialized: true,
      value: (values && name in values ? values[name] : value) || ""
    };
  }

  if (state.didchanged) {
    newState = {
      ...newState
    };
  }

  if (name !== state.name || type !== state.type) {
    newState = {
      ...newState,
      name,
      type
    };
  }

  if (
    values &&
    values !== state.values &&
    name in values &&
    values[name] !== state.__binding_value
  ) {
    newState = {
      ...newState,
      __binding_value: values[name],
      value: values[name]
    };
  }

  if (newState !== state) {
    return newState;
  }

  return null;
}
