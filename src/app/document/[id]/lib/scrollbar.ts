// A scrollbar click targets the scroll container itself, outside its client area.
export const isScrollbarPointerDown = (event: PointerEvent): boolean => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return false;
  const rect = target.getBoundingClientRect();
  return (
    event.clientX > rect.left + target.clientLeft + target.clientWidth ||
    event.clientY > rect.top + target.clientTop + target.clientHeight
  );
};
