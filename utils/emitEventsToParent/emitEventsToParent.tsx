export function emitEventToParent(type: 'FRONT_END_ACTION' | 'HEADER_BUTTON_PRESS' | 'MESSAGE_CLICK', data: any) {
  const eventData = {
    type,
    data,
  };
  window?.parent?.postMessage(eventData, "*");
}
