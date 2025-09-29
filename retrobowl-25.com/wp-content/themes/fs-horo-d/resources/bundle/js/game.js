/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./node_modules/.pnpm/screenfull@6.0.2/node_modules/screenfull/index.js
/* eslint-disable promise/prefer-await-to-then */

const methodMap = [
	[
		'requestFullscreen',
		'exitFullscreen',
		'fullscreenElement',
		'fullscreenEnabled',
		'fullscreenchange',
		'fullscreenerror',
	],
	// New WebKit
	[
		'webkitRequestFullscreen',
		'webkitExitFullscreen',
		'webkitFullscreenElement',
		'webkitFullscreenEnabled',
		'webkitfullscreenchange',
		'webkitfullscreenerror',

	],
	// Old WebKit
	[
		'webkitRequestFullScreen',
		'webkitCancelFullScreen',
		'webkitCurrentFullScreenElement',
		'webkitCancelFullScreen',
		'webkitfullscreenchange',
		'webkitfullscreenerror',

	],
	[
		'mozRequestFullScreen',
		'mozCancelFullScreen',
		'mozFullScreenElement',
		'mozFullScreenEnabled',
		'mozfullscreenchange',
		'mozfullscreenerror',
	],
	[
		'msRequestFullscreen',
		'msExitFullscreen',
		'msFullscreenElement',
		'msFullscreenEnabled',
		'MSFullscreenChange',
		'MSFullscreenError',
	],
];

const nativeAPI = (() => {
	if (typeof document === 'undefined') {
		return false;
	}

	const unprefixedMethods = methodMap[0];
	const returnValue = {};

	for (const methodList of methodMap) {
		const exitFullscreenMethod = methodList?.[1];
		if (exitFullscreenMethod in document) {
			for (const [index, method] of methodList.entries()) {
				returnValue[unprefixedMethods[index]] = method;
			}

			return returnValue;
		}
	}

	return false;
})();

const eventNameMap = {
	change: nativeAPI.fullscreenchange,
	error: nativeAPI.fullscreenerror,
};

// eslint-disable-next-line import/no-mutable-exports
let screenfull = {
	// eslint-disable-next-line default-param-last
	request(element = document.documentElement, options) {
		return new Promise((resolve, reject) => {
			const onFullScreenEntered = () => {
				screenfull.off('change', onFullScreenEntered);
				resolve();
			};

			screenfull.on('change', onFullScreenEntered);

			const returnPromise = element[nativeAPI.requestFullscreen](options);

			if (returnPromise instanceof Promise) {
				returnPromise.then(onFullScreenEntered).catch(reject);
			}
		});
	},
	exit() {
		return new Promise((resolve, reject) => {
			if (!screenfull.isFullscreen) {
				resolve();
				return;
			}

			const onFullScreenExit = () => {
				screenfull.off('change', onFullScreenExit);
				resolve();
			};

			screenfull.on('change', onFullScreenExit);

			const returnPromise = document[nativeAPI.exitFullscreen]();

			if (returnPromise instanceof Promise) {
				returnPromise.then(onFullScreenExit).catch(reject);
			}
		});
	},
	toggle(element, options) {
		return screenfull.isFullscreen ? screenfull.exit() : screenfull.request(element, options);
	},
	onchange(callback) {
		screenfull.on('change', callback);
	},
	onerror(callback) {
		screenfull.on('error', callback);
	},
	on(event, callback) {
		const eventName = eventNameMap[event];
		if (eventName) {
			document.addEventListener(eventName, callback, false);
		}
	},
	off(event, callback) {
		const eventName = eventNameMap[event];
		if (eventName) {
			document.removeEventListener(eventName, callback, false);
		}
	},
	raw: nativeAPI,
};

Object.defineProperties(screenfull, {
	isFullscreen: {
		get: () => Boolean(document[nativeAPI.fullscreenElement]),
	},
	element: {
		enumerable: true,
		get: () => document[nativeAPI.fullscreenElement] ?? undefined,
	},
	isEnabled: {
		enumerable: true,
		// Coerce to boolean in case of old WebKit.
		get: () => Boolean(document[nativeAPI.fullscreenEnabled]),
	},
});

if (!nativeAPI) {
	screenfull = {isEnabled: false};
}

/* harmony default export */ const node_modules_screenfull = (screenfull);

;// CONCATENATED MODULE: ./resources/source/game.js

var isGameInitialized = false;
(function ($) {
  if (document.readyState === "interactive") {
    console.log('completed');
    addGameScrollListeners();
  } else {
    console.log('incompleted');
    window.addEventListener('DOMContentLoaded', addGameScrollListeners, {
      passive: true
    });
  }
  function addGameScrollListeners() {
    window.addEventListener('scroll', gameInit, {
      passive: true
    });
    window.addEventListener('click', gameInit, {
      passive: true
    });
    window.addEventListener('mousemove', gameInit, {
      passive: true
    });
    window.addEventListener('touchstart', gameInit, {
      passive: true
    });
    window.addEventListener('keydown', gameInit, {
      passive: true
    });
    setTimeout(gameInit, 7000);
  }
  function removeGameScrollListeners() {
    window.removeEventListener('scroll', gameInit, false);
    window.removeEventListener('click', gameInit, false);
    window.removeEventListener('mousemove', gameInit, false);
    window.removeEventListener('touchstart', gameInit, false);
    window.removeEventListener('keydown', gameInit, false);
  }
  function gameInit(event) {
    if (isGameInitialized === false) {
      isGameInitialized = true;
      gameLoader();
      setTimeout(function () {
        removeGameScrollListeners();
      }, 100);
    }
  }
  function gameLoader() {
    var flash = document.getElementById('flash-container');
    var btnStart = document.getElementById('js-player-start');
    if (flash == null) {
      return;
    }
    if (btnStart == null) {
      gameInitialize();
      gameRecalc();
    } else {
      btnStart.addEventListener("click", function (event) {
        event.preventDefault();
        playerStart(btnStart, flash);
      });
    }
    if (canFullscreen) {
      $('.js-fullscreen').on('click', function (e) {
        e.preventDefault();
        if (node_modules_screenfull.isEnabled) {
          node_modules_screenfull.request(flash);
        }
      });
      $('.js-close-fullscreen').on('click', function (e) {
        e.preventDefault();
        if (node_modules_screenfull.isEnabled) {
          node_modules_screenfull.exit(flash);
        }
      });
      node_modules_screenfull.on('change', function () {
        changeFullscreen(flash);
      });
    } else {
      $('.js-stop').addClass("hidden");
      $('.js-play').addClass("hidden");
    }
    $(window).on('resize', function () {
      if (!node_modules_screenfull.isFullscreen) {
        gameRecalc();
      }
    });
  }
  function playerStart(btnStart, flash) {
    var iframe_code = btnStart.dataset.code;
    var overlay = document.getElementById('js-overlay');
    flash.innerHTML = iframe_code;
    flash.classList.remove('hidden');
    overlay.classList.add('hidden');
    gameRecalc();
  }
  var canFullscreen = function () {
    for (var _i = 0, _arr = ['exitFullscreen', 'webkitExitFullscreen', 'webkitCancelFullScreen', 'mozCancelFullScreen', 'msExitFullscreen']; _i < _arr.length; _i++) {
      var key = _arr[_i];
      if (key in document) {
        return true;
      }
    }
    return false;
  }();
  function changeFullscreen(flash) {
    if (node_modules_screenfull.isFullscreen) {
      $('.js-stop').removeClass("hidden");
      $('.js-play').addClass("hidden");
      flash.classList.add('fullscreen');
      gameReload();
    } else {
      $('.js-play').removeClass("hidden");
      $('.js-stop').addClass("hidden");
      flash.classList.remove('fullscreen');
      gameReload();
    }
  }
  function gameInitialize() {
    var flashContainer = $('.flash-container');
    $('[external_src]', flashContainer).each(function () {
      var external_src = $(this).attr("external_src");
      $(this).attr("src", external_src); // now it starts to load
      $(this).removeAttr("external_src"); // keep your DOM clean
    });
  }
  function gameReload() {
    var flashContainer = $('.flash-container');
    var iframe = $('.flash-container').find('iframe');
    if (iframe.length) {
      iframe.attr('src', function (i, val) {
        return val;
      });
    }
  }

  /**
   * Recalc Game
   */
  function gameRecalc() {
    var fullwidth = $('.flash-container').data('fullwidth');
    if (!fullwidth) {
      $('.flash-container.iframe').each(function () {
        recalcIframe();
      });
    } else {
      var exampleContainer = document.querySelector('header .area');
      var containerWidth = exampleContainer.clientWidth;
      var gameContainer = document.querySelector('.flash-container');
      var game = document.querySelector('.flash-container iframe');
      var gameWidth = game.getAttribute('width');
      game.classList.add('hidden');
      var gameWidthRendered = gameContainer.clientWidth;
      var differentWidth = gameWidth - gameWidthRendered;
      var fullwidthContent = containerWidth + differentWidth;
      var heading = document.querySelector('.area--content');
      if (heading !== null && differentWidth > 0) {
        heading.style.width = fullwidthContent + 'px';
        heading.style.maxWidth = fullwidthContent + 'px';
      }
      $('body, html').css('min-width', fullwidthContent + 'px');
      game.classList.remove('hidden');
    }
  }
  function recalcIframe() {
    var layout = $('.flash-container');
    var game = $('.flash-container iframe');
    var wWidth = window.innerWidth;
    var wHeight = window.innerHeight;
    var initWidth = game.attr('width');
    var initHeight = game.attr('height');
    var newWidth,
      newHeight,
      ratio = 0;
    game.hide();
    newWidth = layout.innerWidth();
    ratio = parseInt(initWidth) / parseInt(initHeight);
    newHeight = newWidth / ratio;

    // if result height object > height window
    if (newHeight > wHeight) {
      newHeight = wHeight;
      newWidth = newHeight * ratio;
    }
    if (newHeight > 730 && !layout.hasClass('fullscreen')) {
      newHeight = 730;
      newWidth = newHeight * ratio;
    }
    game.attr('width', newWidth);
    game.attr('height', newHeight);
    game.show();
  }
})(jQuery);
/******/ })()
;