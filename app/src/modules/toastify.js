import Toastify from "toastify-js";

/**
 * Show toast
 * @param {String} message 
 * @param {Number} duration in millisecond ## Default: 4000 ## Options: 4000|7000|10000
 * @param {String} className toast class modifiers ## Default: var(--blue);
 * @param {Function} callback Callback on click
 * @param {Array} args [0: gravity = top||bottom, 1: position = left||center||right]
 * @param {String} gravity (optional) top||bottom
 * @param {String} position (optional) left||center||right
 */
export default function toast(
  message,
  duration = 4000,
  className = "",
  callback = () => null,
  ...args
  ) {
  Toastify({
    text: message,
    duration: duration,
    close: true,
    gravity: args[0] || "top", // `top` or `bottom`
    position: args[1] || "right", // `left`, `center` or `right`
    backgroundColor: "var(--blue)",
    className: `emailer-toast ${className}`,
    stopOnFocus: true, // Prevents dismissing of toast on hover
    onClick: callback // Callback after click
  }).showToast();
}