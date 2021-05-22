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


document.addEventListener('DOMContentLoaded', function(event) {
    const htmlTag = document.querySelector('html');

    // Checks the OS settings for preferred color scheme.
    const matchMediaPrefDark = window.matchMedia('(prefers-color-scheme: dark)');
    function startListeningToOSTheme() {
        matchMediaPrefDark.addEventListener('change', onSystemThemeChange);
    }

    function stopListeningToOSTheme() {
        matchMediaPrefDark.removeEventListener('change', onSystemThemeChange);
    }

    /**
     * Called function if the media query defined in @{matchMediaPrefDark} changes.
     * @param e The media query itself
     */
    function onSystemThemeChange(e) {
        const isDark = e.matches;
        htmlTag.dataset.theme = `${isDark ? 'dark' : 'light'}`;
    }
    startListeningToOSTheme();

    /**
     * Switches the data-theme attribute on the html tag.
     * @param theme
     */
    function switchTheme(theme) {
        htmlTag.dataset.theme = `${theme}`;
    }

    let today;
    /*
    today = new Date(); //outputs date in 24hrs format
    if (today.getHours() > 7 && today.getHours() < 19) {
        // its day, use preferred setting
    } else {
        //its night, enforce dark mode.
        switchTheme('dark')
    }
     */

    /**
     * Toggles the current state of the dark/night mode.
     */
    document.getElementById('dark-light-switch').addEventListener('click', function () {
        stopListeningToOSTheme();
        var theme = htmlTag.dataset.theme;
        if (theme === "light") {
            switchTheme("dark");
        } else {
            switchTheme("light");
        }
    });

});
