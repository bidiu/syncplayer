function getTransitionNum(start, end, percentage) {
  return start + (end - start) * percentage;
}

export { getTransitionNum };
