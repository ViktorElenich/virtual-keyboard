const body = document.querySelector('body');
const container = document.createElement('div');
container.className = 'container';
body.appendChild(container);
container.appendChild(document.createElement('textarea'));
const textarea = document.querySelector('textarea');
textarea.classList.add('use__keyboard');
textarea.setAttribute('placeholder', 'Type your text here...');

const KEYBOARD = {
  elements: {
    info: '',
    main: null,
    keysContainer: null,
    keys: [],
    layouts: {
      ru: [
        'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
        'tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\',
        'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
        'lshift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'uarr', 'shift',
        'lctrl', 'lang', 'lalt', ' ', 'alt', 'ctrl', 'larr', 'darr', 'rarr',
      ],
      en: [
        '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
        'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
        'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter',
        'lshift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'uarr', 'shift',
        'lctrl', 'lang', 'lalt', ' ', 'alt', 'ctrl', 'larr', 'darr', 'rarr',
      ],
      ruShifted: [
        'Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', 'backspace',
        'tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', '/',
        'caps', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'enter',
        'lshift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',', 'uarr', 'shift',
        'lctrl', 'lang', 'lalt', ' ', 'alt', 'ctrl', 'larr', 'darr', 'rarr',
      ],
      enShifted: [
        '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'backspace',
        'tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|',
        'caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'enter',
        'lshift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'uarr', 'shift',
        'lctrl', 'lang', 'lalt', ' ', 'alt', 'ctrl', 'larr', 'darr', 'rarr',
      ],
      whichCodes: [
        192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8,
        9, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220,
        20, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 13,
        999, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191,
      ],
    },
  },
  properties: {
    value: '',
    capsLock: null,
    shift: false,
    english: null,
  },
  init() {
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keysContainer);
    container.appendChild(this.elements.main);

    this.elements.info = container.appendChild(document.createElement('div'));
    this.elements.info.classList.add('info');
    this.elements.info.textContent = 'Keyboard works properly in Windows. Press Shift + Ctrl to change language.';
    container.appendChild(this.elements.info);
  },
  createKeys() {
    const fragment = document.createDocumentFragment();
    let keyArr = [];

    // Load stored language
    if (localStorage.english === 'false') {
      this.properties.english = false;
      keyArr = this.elements.layouts.ru;
    } else {
      this.properties.english = true;
      keyArr = this.elements.layouts.en;
    }

    keyArr.forEach((key) => {
      const btnKey = document.createElement('button');
      const insertLineBreak = ['backspace', '\\', 'enter', 'shift'].indexOf(key) !== -1;

      btnKey.setAttribute('type', 'button');
      btnKey.classList.add('keyboard__key');
      btnKey.addEventListener('click', () => {
        textarea.focus();
      });

      switch (key) {
        case 'backspace':
          btnKey.classList.add('keyboard__key-wide');
          btnKey.textContent = 'Backspace';
          btnKey.addEventListener('click', () => {
            if (textarea.selectionStart === 0
              && textarea.selectionEnd === textarea.selectionStart) {
              return;
            }
            if (textarea.selectionEnd === textarea.selectionStart) {
              textarea.setRangeText('', textarea.selectionStart - 1, textarea.selectionEnd, 'end');
            } else {
              textarea.setRangeText('', textarea.selectionStart, textarea.selectionEnd, 'end');
            }
          });
          break;

        case 'tab':
          btnKey.classList.add('keyboard__key-wide');
          btnKey.textContent = 'Tab';
          btnKey.addEventListener('click', (event) => {
            event.preventDefault();
            textarea.setRangeText('\t', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case 'caps':
          btnKey.classList.add('keyboard__key-wide', 'keyboard__key-caps');
          btnKey.textContent = 'Caps Lock';
          btnKey.id = 'caps';
          btnKey.addEventListener('click', () => {
            btnKey.classList.toggle('keyboard__key-active', this.properties.capsLock);
          });
          break;

        case 'lshift':
          btnKey.classList.add('keyboard__key-wide');
          btnKey.textContent = 'Shift';
          btnKey.id = 'shiftLeft';
          btnKey.addEventListener('mousedown', () => {
            this.shiftPress();
          });
          btnKey.addEventListener('mouseup', () => {
            this.shiftUnpressed();
          });
          break;

        case 'shift':
          btnKey.classList.add('keyboard__key-wide');
          btnKey.textContent = 'Shift';
          btnKey.id = 'shiftRight';
          btnKey.addEventListener('mousedown', () => {
            this.shiftPress();
          });
          btnKey.addEventListener('mouseup', () => {
            this.shiftUnpressed();
          });
          break;

        case 'ctrl':
          btnKey.textContent = 'Ctrl';
          btnKey.id = 'controlRight';
          break;

        case 'lctrl':
          btnKey.textContent = 'Ctrl';
          btnKey.id = 'controlLeft';
          break;

        case 'lang':
          btnKey.classList.add('keyboard__key-lang');
          btnKey.textContent = this.properties.english ? 'EN' : 'RU';
          btnKey.id = 'lang';
          break;

        case 'lalt':
          btnKey.textContent = 'Alt';
          btnKey.id = 'altLeft';
          break;

        case 'alt':
          btnKey.textContent = 'Alt';
          btnKey.id = 'altRight';
          break;

        case 'enter':
          btnKey.classList.add('keyboard__key-wide');
          btnKey.textContent = 'Enter';
          btnKey.addEventListener('click', () => {
            textarea.setRangeText('\n', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case ' ':
          btnKey.classList.add('keyboard__key-space');
          btnKey.textContent = ' ';
          btnKey.id = 'space';
          btnKey.addEventListener('click', () => {
            textarea.setRangeText(' ', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case 'darr':
          btnKey.textContent = '↓';
          btnKey.id = 'arrowDown';
          btnKey.addEventListener('click', () => {
            textarea.setRangeText('↓', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case 'uarr':
          btnKey.textContent = '↑';
          btnKey.id = 'arrowUp';
          btnKey.addEventListener('click', () => {
            textarea.setRangeText('↑', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case 'larr':
          btnKey.textContent = '←';
          btnKey.id = 'leftArrow';
          btnKey.addEventListener('click', () => {
            textarea.setRangeText('←', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case 'rarr':
          btnKey.textContent = '→';
          btnKey.id = 'rightArrow';
          btnKey.addEventListener('click', () => {
            textarea.setRangeText('→', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        default:
          btnKey.textContent = key.toLowerCase();
          btnKey.addEventListener('click', () => {
            textarea.setRangeText(btnKey.textContent, textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;
      }

      fragment.appendChild(btnKey);
      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });
    return fragment;
  },
  shiftPress() {
    const { en, ruShifted, enShifted } = this.elements.layouts;
    const { keys } = this.elements;
    const { english } = this.properties;

    for (let i = 0; i < keys.length; i++) {
      const btnIsSymbol = en[i].length === 1;
      if (btnIsSymbol) {
        if (english) {
          keys[i].textContent = enShifted[i];
        } else {
          keys[i].textContent = ruShifted[i];
        }
      }
    }
    this.properties.shift = true;
  },
  shiftUnpressed() {
    const { ru, en } = this.elements.layouts;
    const { keys } = this.elements;
    const { capsLock, english } = this.properties;

    for (let i = 0; i < keys.length; i++) {
      const btnIsSymbol = en[i].length === 1;
      if (btnIsSymbol) {
        if (english) {
          keys[i].textContent = capsLock ? en[i].toUpperCase() : en[i];
        } else {
          keys[i].textContent = capsLock ? ru[i].toUpperCase() : ru[i];
        }
      }
    }
    this.properties.shift = false;
  },
};

window.addEventListener('DOMContentLoaded', () => {
  KEYBOARD.init();
  textarea.focus();
});
