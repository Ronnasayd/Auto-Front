$(function () {
  $('[data-toggle="popover"]').popover();
});

setInterval(() => {
  console.log("Isso é um teste ES6");
}, 5000);

const generalkey = "er3452345234534fwef24f";

const testKey = (key) => {
  if (key === generalkey) {
    console.log("pass");
  }
  else {
    console.log("error");
  }
};

testKey("wrewrwe");