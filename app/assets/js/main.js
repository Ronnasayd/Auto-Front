"use strict";

var form = document.getElementById("form-subscribe");

form.onsubmit = function (e) {
  e.preventDefault();
}; // teste


for (var i = 0; i < 100; i++) {
  var element = document.createElement("div");
  var elementSize = "".concat(Math.max(20, Math.random() * 50), "px");
  element.style.width = elementSize;
  element.style.height = elementSize;
  element.style.background = "rgba(255,255,255,0.3)";
  element.style.position = "absolute";
  element.style.bottom = "0px";
  element.style.left = "".concat(i / 100 * 100, "%");
  element.style.animation = "trans ".concat(Math.max(2, Math.random() * 8), "s ease-out infinite");
  document.body.appendChild(element);
}