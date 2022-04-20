export function selectArea(selector, options = {}) {
  const selectAreaElement = createSelectAreaElement();
  let x1 = 0;
  let y1 = 0;
  let x2 = 0;
  let y2 = 0;
  let isShiftPressed = false;
  let isCtrlPressed = false;
  let defaultOptions = {
    onSelect: async (selectedElements) => {},
    onAddSelect: async (selectedElements) => {},
  };

  init();

  function init() {
    Object.assign(defaultOptions, options);
    const rootElement = document.getElementById('application');
    rootElement.style.position = 'relative';
    selectAreaElement.hidden = 1;
    rootElement.append(selectAreaElement);
    createListeners();
  }

  function createListeners() {
    document.body.onmousedown = startSelection;
    document.body.onmouseup = stopSelection;
    document.body.onmousemove = moveSelection;
    document.body.onkeydown = keysListener;
    document.body.onkeyup = keysListener;
  }

  function keysListener(e) {
    if (e.key === 'Control' && e.type === 'keydown') {
      e.preventDefault();
      document.body.style.cursor = 'copy';
      isCtrlPressed = true;
    } else if (e.key === 'Control' && e.type === 'keyup') {
      e.preventDefault();
      document.body.style.cursor = '';
      isCtrlPressed = false;
    }
    if (e.key === 'Shift' && e.type === 'keydown') {
      e.preventDefault();
      isShiftPressed = true;
    } else if (e.key === 'Shift' && e.type === 'keyup') {
      e.preventDefault();
      isShiftPressed = false;
      selectAreaElement.hidden = 1;
    }
  }

  function createSelectAreaElement() {
    let selectAreaElement = document.createElement('div');
    selectAreaElement.classList.add('absolute');
    selectAreaElement.classList.add('z-50');
    selectAreaElement.classList.add('bg-indigo-500');
    selectAreaElement.classList.add('opacity-30');
    selectAreaElement.classList.add('border');
    selectAreaElement.classList.add('border-indigo-600');
    return selectAreaElement;
  }

  async function stopSelection(e) {
    if (!isShiftPressed) return;
    e.preventDefault();
    const { left, top, right, bottom } = selectAreaElement.getBoundingClientRect();
    const selectableElements = document.body.querySelectorAll(selector);
    let elementsInSelection = [];
    for (let selectable of selectableElements) {
      const {
        left: elementLeft,
        top: elementTop,
        right: elementRight,
        bottom: elementBottom,
      } = selectable.getBoundingClientRect();
      if (
        left <= elementLeft &&
        top <= elementTop &&
        right >= elementRight &&
        bottom >= elementBottom
      ) {
        elementsInSelection.push(selectable);
      }
    }
    if (isCtrlPressed) {
      defaultOptions.onAddSelect && (await defaultOptions.onAddSelect(elementsInSelection));
    } else {
      defaultOptions.onSelect && (await defaultOptions.onSelect(elementsInSelection));
    }

    selectAreaElement.hidden = 1;
  }

  function startSelection(e) {
    if (!isShiftPressed) return;
    e.preventDefault();
    selectAreaElement.hidden = 0;
    x1 = e.clientX;
    y1 = e.clientY;
    calculate();
  }

  function moveSelection(e) {
    x2 = e.clientX;
    y2 = e.clientY;
    calculate();
  }

  function calculate() {
    let x3 = Math.min(x1, x2);
    let x4 = Math.max(x1, x2);
    let y3 = Math.min(y1, y2);
    let y4 = Math.max(y1, y2);
    selectAreaElement.style.left = x3 + 'px';
    selectAreaElement.style.top = y3 + 'px';
    selectAreaElement.style.width = x4 - x3 + 'px';
    selectAreaElement.style.height = y4 - y3 + 'px';
  }

  return selector;
}
