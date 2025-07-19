import _delay from "lodash/delay";
import _debounce from "lodash/debounce";

function confirmReload() {
  const confirmReload = confirm("reload page?\n You will loose the email Template.");

  if (confirmReload) {
    _delay(location.reload(), 700);
  }
}

function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}

function uid(prepend = "__", append = "") {
  return prepend + Math.random().toString(36).substr(2, 9) + append;
}

export {
  confirmReload,
  addClass,
  removeClass,
  uid
};
