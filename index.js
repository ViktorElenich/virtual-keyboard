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
    this.elements.keysContainer = document.createElement('div');

    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    container.appendChild(this.elements.keysContainer);

    this.elements.info = container.appendChild(document.createElement('div'));
    this.elements.info.classList.add('info');
    this.elements.info.textContent = 'Keyboard works properly in Windows. Press Shift + Ctrl to change language.';
    container.appendChild(this.elements.info);

    if (localStorage.capsLock === 'true') {
      this.toggleCapsLock();
      document.getElementById('caps').classList.toggle('keyboard__key-active', this.properties.capsLock);
    }
    this.switchLangShiftCtrl();
    this.physicalInput();
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
          btnKey.classList.add('keyboard__key-wide', 'keyboard__key-backspace');
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
          btnKey.textContent = 'CapsLock';
          btnKey.id = 'caps';
          btnKey.addEventListener('click', () => {
            this.toggleCapsLock();
            btnKey.classList.toggle('keyboard__key-active', this.properties.capsLock);
          });
          break;

        case 'lshift':
          btnKey.classList.add('keyboard__key-wide', 'keyboard__key-shift');
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
          btnKey.classList.add('keyboard__key-wide', 'keyboard__key-shift', 'keyboard__key-shift_right');
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
          btnKey.addEventListener('mousedown', () => {
            this.switchLang();
          });
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
    this.physicalInput();
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
    this.physicalInput();
  },
  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    localStorage.capsLock = this.properties.capsLock;

    this.elements.keys.forEach((key) => {
      const res = key;
      if (key.textContent.length === 1) {
        res.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase();
      }
      return res;
    });
    this.physicalInput();
  },
  switchLang() {
    const {
      ru, ruShifted, en, enShifted,
    } = this.elements.layouts;
    const { capsLock, shift, english } = this.properties;
    const { keys } = this.elements;
    const btnSwitchLang = document.getElementById('lang');

    for (let i = 0; i < keys.length; i++) {
      const btnIsSymbol = en[i].length === 1;
      if (btnIsSymbol) {
        if (english) {
          if (capsLock) {
            keys[i].textContent = shift ? ruShifted[i] : ru[i].toUpperCase();
          } else {
            keys[i].textContent = shift ? ruShifted[i] : ru[i];
          }
        }
        if (!english) {
          if (capsLock) {
            keys[i].textContent = shift ? enShifted[i] : en[i].toUpperCase();
          } else {
            keys[i].textContent = shift ? enShifted[i] : en[i];
          }
        }
      }
    }

    if (btnSwitchLang.textContent === 'EN') {
      btnSwitchLang.textContent = 'RU';
    } else {
      btnSwitchLang.textContent = 'EN';
    }

    localStorage.setItem('lang', !this.properties.english);
    this.properties.english = !this.properties.english;

    this.physicalInput();
  },
  switchLangShiftCtrl() {
    let counter = 0;
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Shift' && (counter === 5 || counter === 0)) {
        counter += 3;
      }
      if (event.key === 'Control' && (counter === 3 || counter === 0)) {
        counter += 5;
      }
      if (counter === 8) {
        this.switchLang();
      }
    });
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Shift' && (counter === 3 || counter === 8)) {
        counter -= 3;
      }
      if (event.key === 'Control' && (counter === 5 || counter === 8)) {
        counter -= 5;
      }
    });
  },
  physicalInput() {
    const { whichCodes } = this.elements.layouts;
    const { capsLock, shift } = this.properties;
    const keyArr = [];

    KEYBOARD.elements.keys.forEach((key) => {
      keyArr.push(key.textContent);
    });
    document.onkeydown = (event) => {
      const code = whichCodes.indexOf(event.which);
      const char = code > -1 ? keyArr[code].toLowerCase() : event.key;
      let counter = -1;

      document.querySelectorAll('.keyboard__key').forEach((key) => {
        counter++;
        if (key.innerHTML === event.code || event.code === key.id || code === counter) {
          key.classList.add('red');
        }
      });

      switch (event.key) {
        case 'Enter':
          break;

        case 'Backspace':
          break;

        case 'CapsLock':
          document.getElementById('caps').classList.toggle('keyboard__key-active', !KEYBOARD.properties.capsLock);
          KEYBOARD.toggleCapsLock();
          break;

        case 'Shift':
          if (KEYBOARD.properties.ctrl === true) {
            KEYBOARD.switchLang();
          }
          KEYBOARD.shiftPress();
          break;

        case 'Tab':
          event.preventDefault();
          textarea.setRangeText('\t', textarea.selectionStart, textarea.selectionEnd, 'end');
          break;

        case 'arrowUp':
          event.preventDefault();
          textarea.setRangeText('↑', textarea.selectionStart, textarea.selectionEnd, 'end');
          break;

        case 'arrowDown':
          event.preventDefault();
          textarea.setRangeText('↓', textarea.selectionStart, textarea.selectionEnd, 'end');
          break;

        case 'rightArrow':
          event.preventDefault();
          textarea.setRangeText('→', textarea.selectionStart, textarea.selectionEnd, 'end');
          break;

        case 'leftArrow':
          event.preventDefault();
          textarea.setRangeText('←', textarea.selectionStart, textarea.selectionEnd, 'end');
          break;

        default:
          event.preventDefault();
          if (event.key.length === 1) {
            switch (capsLock || shift) {
              case true:
                textarea.setRangeText(char.toUpperCase(), textarea.selectionStart, textarea.selectionEnd, 'end');
                break;

              default:
                textarea.setRangeText(char, textarea.selectionStart, textarea.selectionEnd, 'end');
                break;
            }
          }
          break;
      }
    };
    document.onkeyup = (event) => {
      const code = whichCodes.indexOf(event.which);
      let counter = -1;
      document.querySelectorAll('.keyboard__key').forEach((key) => {
        counter++;
        if (key.innerHTML === event.code || event.code === key.id || code === counter) {
          key.classList.remove('red');
        }
        if (event.key === 'Shift') {
          KEYBOARD.shiftUnpressed();
        }
      });
    };
  },
};

window.addEventListener('DOMContentLoaded', () => {
  KEYBOARD.init();
  textarea.focus();
});
