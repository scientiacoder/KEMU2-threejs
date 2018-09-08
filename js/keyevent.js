// if (typeof x != 'undefined') {
//     alert('Use Event constructor');
  
//   } else if (document.createEvent) {
//     evt = document.createEvent('KeyboardEvent');
  
//     if (evt && evt.initKeyboardEvent) {
//       alert('Use initKeyboardEvent');
  
//     } else if (evt && evt.initKeyEvent) {
//       alert('Use initKeyEvent');
//     }
//   }

document.addEventListener("keydown", function(event){
    console.log(event);
    console.log("--keydown captured--");
});

// var canvas = document.getElementById("canvas-frame");
// var events = document.createEvent("KeyboardEvent");
// events.initKeyboardEvent("keydown", true, false, window, 'U+0038',38,false,false,true,false,false);
// // canvas.dispatchEvent(events);
// // setTimeout(canvas.dispatchEvent(events), 5000);
// setInterval("canvas.dispatchEvent(events)", 2000);



event2 = new KeyboardEvent("event2", {bubbles : true, cancelable : true, key : "ArrowUp", code:"ArrowUp", composed:true, keyCode:38, isTrusted: true});
event2.initKeyboardEvent("keydown", true, true, window, 'U+0038');
setInterval("document.body.dispatchEvent(event2)", 2000);