// Setup the mobile navigation burger menu
document.addEventListener('DOMContentLoaded', function(event) {
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
    let counter = 0;
    const time = window.setInterval( function () {
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
  let state = 0;
  function slideToggle () {
    const elem = document.getElementById("navigation-list");
    if (state === 0) {
      state = 1;
      slideDown(elem);
    } else {
      state = 0;
      slideUp(elem);
    }
  }

  document.getElementById('burger').addEventListener("click", slideToggle)
});
