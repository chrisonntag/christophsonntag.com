/**
 * Slide element down.
 * @param  {Node} elem Element to show and hide
 */
function slideDown(elem) {
  elem.style.maxHeight = '1000px';
  elem.style.opacity   = '1';
}

/**
 * Slide element up.
 * @param  {Node} elem Element
 */
function slideUp(elem) {
  elem.style.maxHeight = '0';
  once( 1, function () {
    elem.style.opacity = '0';
  });
}

/**
 * Fired once.
 * @param seconds
 * @param callback
 */
function once (seconds, callback) {
  var counter = 0;
  var time = window.setInterval( function () {
    counter++;
    if ( counter >= seconds ) {
      callback();
      window.clearInterval( time );
    }
  }, 900 );
}


/**
 * Slide toggle for a given id.
 * @param id
 */
var state = 0;
function slideToggle (id) {
  var elem = document.getElementById(id);
  if (state === 0) {
    state = 1;
    slideDown(elem);
  } else {
    state = 0;
    slideUp(elem);
  }
}
