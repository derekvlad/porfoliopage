/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 229:
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! picturefill - v3.0.2 - 2016-02-12
 * https://scottjehl.github.io/picturefill/
 * Copyright (c) 2016 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */
/*! Gecko-Picture - v1.0
 * https://github.com/scottjehl/picturefill/tree/3.0/src/plugins/gecko-picture
 * Firefox's early picture implementation (prior to FF41) is static and does
 * not react to viewport changes. This tiny module fixes this.
 */
(function(window) {
	/*jshint eqnull:true */
	var ua = navigator.userAgent;

	if ( window.HTMLPictureElement && ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 < 45) ) {
		addEventListener("resize", (function() {
			var timer;

			var dummySrc = document.createElement("source");

			var fixRespimg = function(img) {
				var source, sizes;
				var picture = img.parentNode;

				if (picture.nodeName.toUpperCase() === "PICTURE") {
					source = dummySrc.cloneNode();

					picture.insertBefore(source, picture.firstElementChild);
					setTimeout(function() {
						picture.removeChild(source);
					});
				} else if (!img._pfLastSize || img.offsetWidth > img._pfLastSize) {
					img._pfLastSize = img.offsetWidth;
					sizes = img.sizes;
					img.sizes += ",100vw";
					setTimeout(function() {
						img.sizes = sizes;
					});
				}
			};

			var findPictureImgs = function() {
				var i;
				var imgs = document.querySelectorAll("picture > img, img[srcset][sizes]");
				for (i = 0; i < imgs.length; i++) {
					fixRespimg(imgs[i]);
				}
			};
			var onResize = function() {
				clearTimeout(timer);
				timer = setTimeout(findPictureImgs, 99);
			};
			var mq = window.matchMedia && matchMedia("(orientation: landscape)");
			var init = function() {
				onResize();

				if (mq && mq.addListener) {
					mq.addListener(onResize);
				}
			};

			dummySrc.srcset = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

			if (/^[c|i]|d$/.test(document.readyState || "")) {
				init();
			} else {
				document.addEventListener("DOMContentLoaded", init);
			}

			return onResize;
		})());
	}
})(window);

/*! Picturefill - v3.0.2
 * http://scottjehl.github.io/picturefill
 * Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt;
 *  License: MIT
 */

(function( window, document, undefined ) {
	// Enable strict mode
	"use strict";

	// HTML shim|v it for old IE (IE9 will still need the HTML video tag workaround)
	document.createElement( "picture" );

	var warn, eminpx, alwaysCheckWDescriptor, evalId;
	// local object for method references and testing exposure
	var pf = {};
	var isSupportTestReady = false;
	var noop = function() {};
	var image = document.createElement( "img" );
	var getImgAttr = image.getAttribute;
	var setImgAttr = image.setAttribute;
	var removeImgAttr = image.removeAttribute;
	var docElem = document.documentElement;
	var types = {};
	var cfg = {
		//resource selection:
		algorithm: ""
	};
	var srcAttr = "data-pfsrc";
	var srcsetAttr = srcAttr + "set";
	// ua sniffing is done for undetectable img loading features,
	// to do some non crucial perf optimizations
	var ua = navigator.userAgent;
	var supportAbort = (/rident/).test(ua) || ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 > 35 );
	var curSrcProp = "currentSrc";
	var regWDesc = /\s+\+?\d+(e\d+)?w/;
	var regSize = /(\([^)]+\))?\s*(.+)/;
	var setOptions = window.picturefillCFG;
	/**
	 * Shortcut property for https://w3c.github.io/webappsec/specs/mixedcontent/#restricts-mixed-content ( for easy overriding in tests )
	 */
	// baseStyle also used by getEmValue (i.e.: width: 1em is important)
	var baseStyle = "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)";
	var fsCss = "font-size:100%!important;";
	var isVwDirty = true;

	var cssCache = {};
	var sizeLengthCache = {};
	var DPR = window.devicePixelRatio;
	var units = {
		px: 1,
		"in": 96
	};
	var anchor = document.createElement( "a" );
	/**
	 * alreadyRun flag used for setOptions. is it true setOptions will reevaluate
	 * @type {boolean}
	 */
	var alreadyRun = false;

	// Reusable, non-"g" Regexes

	// (Don't use \s, to avoid matching non-breaking space.)
	var regexLeadingSpaces = /^[ \t\n\r\u000c]+/,
	    regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/,
	    regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/,
	    regexTrailingCommas = /[,]+$/,
	    regexNonNegativeInteger = /^\d+$/,

	    // ( Positive or negative or unsigned integers or decimals, without or without exponents.
	    // Must include at least one digit.
	    // According to spec tests any decimal point must be followed by a digit.
	    // No leading plus sign is allowed.)
	    // https://html.spec.whatwg.org/multipage/infrastructure.html#valid-floating-point-number
	    regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;

	var on = function(obj, evt, fn, capture) {
		if ( obj.addEventListener ) {
			obj.addEventListener(evt, fn, capture || false);
		} else if ( obj.attachEvent ) {
			obj.attachEvent( "on" + evt, fn);
		}
	};

	/**
	 * simple memoize function:
	 */

	var memoize = function(fn) {
		var cache = {};
		return function(input) {
			if ( !(input in cache) ) {
				cache[ input ] = fn(input);
			}
			return cache[ input ];
		};
	};

	// UTILITY FUNCTIONS

	// Manual is faster than RegEx
	// http://jsperf.com/whitespace-character/5
	function isSpace(c) {
		return (c === "\u0020" || // space
		        c === "\u0009" || // horizontal tab
		        c === "\u000A" || // new line
		        c === "\u000C" || // form feed
		        c === "\u000D");  // carriage return
	}

	/**
	 * gets a mediaquery and returns a boolean or gets a css length and returns a number
	 * @param css mediaqueries or css length
	 * @returns {boolean|number}
	 *
	 * based on: https://gist.github.com/jonathantneal/db4f77009b155f083738
	 */
	var evalCSS = (function() {

		var regLength = /^([\d\.]+)(em|vw|px)$/;
		var replace = function() {
			var args = arguments, index = 0, string = args[0];
			while (++index in args) {
				string = string.replace(args[index], args[++index]);
			}
			return string;
		};

		var buildStr = memoize(function(css) {

			return "return " + replace((css || "").toLowerCase(),
				// interpret `and`
				/\band\b/g, "&&",

				// interpret `,`
				/,/g, "||",

				// interpret `min-` as >=
				/min-([a-z-\s]+):/g, "e.$1>=",

				// interpret `max-` as <=
				/max-([a-z-\s]+):/g, "e.$1<=",

				//calc value
				/calc([^)]+)/g, "($1)",

				// interpret css values
				/(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)",
				//make eval less evil
				/^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/ig, ""
			) + ";";
		});

		return function(css, length) {
			var parsedLength;
			if (!(css in cssCache)) {
				cssCache[css] = false;
				if (length && (parsedLength = css.match( regLength ))) {
					cssCache[css] = parsedLength[ 1 ] * units[parsedLength[ 2 ]];
				} else {
					/*jshint evil:true */
					try{
						cssCache[css] = new Function("e", buildStr(css))(units);
					} catch(e) {}
					/*jshint evil:false */
				}
			}
			return cssCache[css];
		};
	})();

	var setResolution = function( candidate, sizesattr ) {
		if ( candidate.w ) { // h = means height: || descriptor.type === 'h' do not handle yet...
			candidate.cWidth = pf.calcListLength( sizesattr || "100vw" );
			candidate.res = candidate.w / candidate.cWidth ;
		} else {
			candidate.res = candidate.d;
		}
		return candidate;
	};

	/**
	 *
	 * @param opt
	 */
	var picturefill = function( opt ) {

		if (!isSupportTestReady) {return;}

		var elements, i, plen;

		var options = opt || {};

		if ( options.elements && options.elements.nodeType === 1 ) {
			if ( options.elements.nodeName.toUpperCase() === "IMG" ) {
				options.elements =  [ options.elements ];
			} else {
				options.context = options.elements;
				options.elements =  null;
			}
		}

		elements = options.elements || pf.qsa( (options.context || document), ( options.reevaluate || options.reselect ) ? pf.sel : pf.selShort );

		if ( (plen = elements.length) ) {

			pf.setupRun( options );
			alreadyRun = true;

			// Loop through all elements
			for ( i = 0; i < plen; i++ ) {
				pf.fillImg(elements[ i ], options);
			}

			pf.teardownRun( options );
		}
	};

	/**
	 * outputs a warning for the developer
	 * @param {message}
	 * @type {Function}
	 */
	warn = ( window.console && console.warn ) ?
		function( message ) {
			console.warn( message );
		} :
		noop
	;

	if ( !(curSrcProp in image) ) {
		curSrcProp = "src";
	}

	// Add support for standard mime types.
	types[ "image/jpeg" ] = true;
	types[ "image/gif" ] = true;
	types[ "image/png" ] = true;

	function detectTypeSupport( type, typeUri ) {
		// based on Modernizr's lossless img-webp test
		// note: asynchronous
		var image = new window.Image();
		image.onerror = function() {
			types[ type ] = false;
			picturefill();
		};
		image.onload = function() {
			types[ type ] = image.width === 1;
			picturefill();
		};
		image.src = typeUri;
		return "pending";
	}

	// test svg support
	types[ "image/svg+xml" ] = document.implementation.hasFeature( "http://www.w3.org/TR/SVG11/feature#Image", "1.1" );

	/**
	 * updates the internal vW property with the current viewport width in px
	 */
	function updateMetrics() {

		isVwDirty = false;
		DPR = window.devicePixelRatio;
		cssCache = {};
		sizeLengthCache = {};

		pf.DPR = DPR || 1;

		units.width = Math.max(window.innerWidth || 0, docElem.clientWidth);
		units.height = Math.max(window.innerHeight || 0, docElem.clientHeight);

		units.vw = units.width / 100;
		units.vh = units.height / 100;

		evalId = [ units.height, units.width, DPR ].join("-");

		units.em = pf.getEmValue();
		units.rem = units.em;
	}

	function chooseLowRes( lowerValue, higherValue, dprValue, isCached ) {
		var bonusFactor, tooMuch, bonus, meanDensity;

		//experimental
		if (cfg.algorithm === "saveData" ){
			if ( lowerValue > 2.7 ) {
				meanDensity = dprValue + 1;
			} else {
				tooMuch = higherValue - dprValue;
				bonusFactor = Math.pow(lowerValue - 0.6, 1.5);

				bonus = tooMuch * bonusFactor;

				if (isCached) {
					bonus += 0.1 * bonusFactor;
				}

				meanDensity = lowerValue + bonus;
			}
		} else {
			meanDensity = (dprValue > 1) ?
				Math.sqrt(lowerValue * higherValue) :
				lowerValue;
		}

		return meanDensity > dprValue;
	}

	function applyBestCandidate( img ) {
		var srcSetCandidates;
		var matchingSet = pf.getSet( img );
		var evaluated = false;
		if ( matchingSet !== "pending" ) {
			evaluated = evalId;
			if ( matchingSet ) {
				srcSetCandidates = pf.setRes( matchingSet );
				pf.applySetCandidate( srcSetCandidates, img );
			}
		}
		img[ pf.ns ].evaled = evaluated;
	}

	function ascendingSort( a, b ) {
		return a.res - b.res;
	}

	function setSrcToCur( img, src, set ) {
		var candidate;
		if ( !set && src ) {
			set = img[ pf.ns ].sets;
			set = set && set[set.length - 1];
		}

		candidate = getCandidateForSrc(src, set);

		if ( candidate ) {
			src = pf.makeUrl(src);
			img[ pf.ns ].curSrc = src;
			img[ pf.ns ].curCan = candidate;

			if ( !candidate.res ) {
				setResolution( candidate, candidate.set.sizes );
			}
		}
		return candidate;
	}

	function getCandidateForSrc( src, set ) {
		var i, candidate, candidates;
		if ( src && set ) {
			candidates = pf.parseSet( set );
			src = pf.makeUrl(src);
			for ( i = 0; i < candidates.length; i++ ) {
				if ( src === pf.makeUrl(candidates[ i ].url) ) {
					candidate = candidates[ i ];
					break;
				}
			}
		}
		return candidate;
	}

	function getAllSourceElements( picture, candidates ) {
		var i, len, source, srcset;

		// SPEC mismatch intended for size and perf:
		// actually only source elements preceding the img should be used
		// also note: don't use qsa here, because IE8 sometimes doesn't like source as the key part in a selector
		var sources = picture.getElementsByTagName( "source" );

		for ( i = 0, len = sources.length; i < len; i++ ) {
			source = sources[ i ];
			source[ pf.ns ] = true;
			srcset = source.getAttribute( "srcset" );

			// if source does not have a srcset attribute, skip
			if ( srcset ) {
				candidates.push( {
					srcset: srcset,
					media: source.getAttribute( "media" ),
					type: source.getAttribute( "type" ),
					sizes: source.getAttribute( "sizes" )
				} );
			}
		}
	}

	/**
	 * Srcset Parser
	 * By Alex Bell |  MIT License
	 *
	 * @returns Array [{url: _, d: _, w: _, h:_, set:_(????)}, ...]
	 *
	 * Based super duper closely on the reference algorithm at:
	 * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-srcset-attribute
	 */

	// 1. Let input be the value passed to this algorithm.
	// (TO-DO : Explain what "set" argument is here. Maybe choose a more
	// descriptive & more searchable name.  Since passing the "set" in really has
	// nothing to do with parsing proper, I would prefer this assignment eventually
	// go in an external fn.)
	function parseSrcset(input, set) {

		function collectCharacters(regEx) {
			var chars,
			    match = regEx.exec(input.substring(pos));
			if (match) {
				chars = match[ 0 ];
				pos += chars.length;
				return chars;
			}
		}

		var inputLength = input.length,
		    url,
		    descriptors,
		    currentDescriptor,
		    state,
		    c,

		    // 2. Let position be a pointer into input, initially pointing at the start
		    //    of the string.
		    pos = 0,

		    // 3. Let candidates be an initially empty source set.
		    candidates = [];

		/**
		* Adds descriptor properties to a candidate, pushes to the candidates array
		* @return undefined
		*/
		// (Declared outside of the while loop so that it's only created once.
		// (This fn is defined before it is used, in order to pass JSHINT.
		// Unfortunately this breaks the sequencing of the spec comments. :/ )
		function parseDescriptors() {

			// 9. Descriptor parser: Let error be no.
			var pError = false,

			// 10. Let width be absent.
			// 11. Let density be absent.
			// 12. Let future-compat-h be absent. (We're implementing it now as h)
			    w, d, h, i,
			    candidate = {},
			    desc, lastChar, value, intVal, floatVal;

			// 13. For each descriptor in descriptors, run the appropriate set of steps
			// from the following list:
			for (i = 0 ; i < descriptors.length; i++) {
				desc = descriptors[ i ];

				lastChar = desc[ desc.length - 1 ];
				value = desc.substring(0, desc.length - 1);
				intVal = parseInt(value, 10);
				floatVal = parseFloat(value);

				// If the descriptor consists of a valid non-negative integer followed by
				// a U+0077 LATIN SMALL LETTER W character
				if (regexNonNegativeInteger.test(value) && (lastChar === "w")) {

					// If width and density are not both absent, then let error be yes.
					if (w || d) {pError = true;}

					// Apply the rules for parsing non-negative integers to the descriptor.
					// If the result is zero, let error be yes.
					// Otherwise, let width be the result.
					if (intVal === 0) {pError = true;} else {w = intVal;}

				// If the descriptor consists of a valid floating-point number followed by
				// a U+0078 LATIN SMALL LETTER X character
				} else if (regexFloatingPoint.test(value) && (lastChar === "x")) {

					// If width, density and future-compat-h are not all absent, then let error
					// be yes.
					if (w || d || h) {pError = true;}

					// Apply the rules for parsing floating-point number values to the descriptor.
					// If the result is less than zero, let error be yes. Otherwise, let density
					// be the result.
					if (floatVal < 0) {pError = true;} else {d = floatVal;}

				// If the descriptor consists of a valid non-negative integer followed by
				// a U+0068 LATIN SMALL LETTER H character
				} else if (regexNonNegativeInteger.test(value) && (lastChar === "h")) {

					// If height and density are not both absent, then let error be yes.
					if (h || d) {pError = true;}

					// Apply the rules for parsing non-negative integers to the descriptor.
					// If the result is zero, let error be yes. Otherwise, let future-compat-h
					// be the result.
					if (intVal === 0) {pError = true;} else {h = intVal;}

				// Anything else, Let error be yes.
				} else {pError = true;}
			} // (close step 13 for loop)

			// 15. If error is still no, then append a new image source to candidates whose
			// URL is url, associated with a width width if not absent and a pixel
			// density density if not absent. Otherwise, there is a parse error.
			if (!pError) {
				candidate.url = url;

				if (w) { candidate.w = w;}
				if (d) { candidate.d = d;}
				if (h) { candidate.h = h;}
				if (!h && !d && !w) {candidate.d = 1;}
				if (candidate.d === 1) {set.has1x = true;}
				candidate.set = set;

				candidates.push(candidate);
			}
		} // (close parseDescriptors fn)

		/**
		* Tokenizes descriptor properties prior to parsing
		* Returns undefined.
		* (Again, this fn is defined before it is used, in order to pass JSHINT.
		* Unfortunately this breaks the logical sequencing of the spec comments. :/ )
		*/
		function tokenize() {

			// 8.1. Descriptor tokeniser: Skip whitespace
			collectCharacters(regexLeadingSpaces);

			// 8.2. Let current descriptor be the empty string.
			currentDescriptor = "";

			// 8.3. Let state be in descriptor.
			state = "in descriptor";

			while (true) {

				// 8.4. Let c be the character at position.
				c = input.charAt(pos);

				//  Do the following depending on the value of state.
				//  For the purpose of this step, "EOF" is a special character representing
				//  that position is past the end of input.

				// In descriptor
				if (state === "in descriptor") {
					// Do the following, depending on the value of c:

				  // Space character
				  // If current descriptor is not empty, append current descriptor to
				  // descriptors and let current descriptor be the empty string.
				  // Set state to after descriptor.
					if (isSpace(c)) {
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
							currentDescriptor = "";
							state = "after descriptor";
						}

					// U+002C COMMA (,)
					// Advance position to the next character in input. If current descriptor
					// is not empty, append current descriptor to descriptors. Jump to the step
					// labeled descriptor parser.
					} else if (c === ",") {
						pos += 1;
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
						}
						parseDescriptors();
						return;

					// U+0028 LEFT PARENTHESIS (()
					// Append c to current descriptor. Set state to in parens.
					} else if (c === "\u0028") {
						currentDescriptor = currentDescriptor + c;
						state = "in parens";

					// EOF
					// If current descriptor is not empty, append current descriptor to
					// descriptors. Jump to the step labeled descriptor parser.
					} else if (c === "") {
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
						}
						parseDescriptors();
						return;

					// Anything else
					// Append c to current descriptor.
					} else {
						currentDescriptor = currentDescriptor + c;
					}
				// (end "in descriptor"

				// In parens
				} else if (state === "in parens") {

					// U+0029 RIGHT PARENTHESIS ())
					// Append c to current descriptor. Set state to in descriptor.
					if (c === ")") {
						currentDescriptor = currentDescriptor + c;
						state = "in descriptor";

					// EOF
					// Append current descriptor to descriptors. Jump to the step labeled
					// descriptor parser.
					} else if (c === "") {
						descriptors.push(currentDescriptor);
						parseDescriptors();
						return;

					// Anything else
					// Append c to current descriptor.
					} else {
						currentDescriptor = currentDescriptor + c;
					}

				// After descriptor
				} else if (state === "after descriptor") {

					// Do the following, depending on the value of c:
					// Space character: Stay in this state.
					if (isSpace(c)) {

					// EOF: Jump to the step labeled descriptor parser.
					} else if (c === "") {
						parseDescriptors();
						return;

					// Anything else
					// Set state to in descriptor. Set position to the previous character in input.
					} else {
						state = "in descriptor";
						pos -= 1;

					}
				}

				// Advance position to the next character in input.
				pos += 1;

			// Repeat this step.
			} // (close while true loop)
		}

		// 4. Splitting loop: Collect a sequence of characters that are space
		//    characters or U+002C COMMA characters. If any U+002C COMMA characters
		//    were collected, that is a parse error.
		while (true) {
			collectCharacters(regexLeadingCommasOrSpaces);

			// 5. If position is past the end of input, return candidates and abort these steps.
			if (pos >= inputLength) {
				return candidates; // (we're done, this is the sole return path)
			}

			// 6. Collect a sequence of characters that are not space characters,
			//    and let that be url.
			url = collectCharacters(regexLeadingNotSpaces);

			// 7. Let descriptors be a new empty list.
			descriptors = [];

			// 8. If url ends with a U+002C COMMA character (,), follow these substeps:
			//		(1). Remove all trailing U+002C COMMA characters from url. If this removed
			//         more than one character, that is a parse error.
			if (url.slice(-1) === ",") {
				url = url.replace(regexTrailingCommas, "");
				// (Jump ahead to step 9 to skip tokenization and just push the candidate).
				parseDescriptors();

			//	Otherwise, follow these substeps:
			} else {
				tokenize();
			} // (close else of step 8)

		// 16. Return to the step labeled splitting loop.
		} // (Close of big while loop.)
	}

	/*
	 * Sizes Parser
	 *
	 * By Alex Bell |  MIT License
	 *
	 * Non-strict but accurate and lightweight JS Parser for the string value <img sizes="here">
	 *
	 * Reference algorithm at:
	 * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-sizes-attribute
	 *
	 * Most comments are copied in directly from the spec
	 * (except for comments in parens).
	 *
	 * Grammar is:
	 * <source-size-list> = <source-size># [ , <source-size-value> ]? | <source-size-value>
	 * <source-size> = <media-condition> <source-size-value>
	 * <source-size-value> = <length>
	 * http://www.w3.org/html/wg/drafts/html/master/embedded-content.html#attr-img-sizes
	 *
	 * E.g. "(max-width: 30em) 100vw, (max-width: 50em) 70vw, 100vw"
	 * or "(min-width: 30em), calc(30vw - 15px)" or just "30vw"
	 *
	 * Returns the first valid <css-length> with a media condition that evaluates to true,
	 * or "100vw" if all valid media conditions evaluate to false.
	 *
	 */

	function parseSizes(strValue) {

		// (Percentage CSS lengths are not allowed in this case, to avoid confusion:
		// https://html.spec.whatwg.org/multipage/embedded-content.html#valid-source-size-list
		// CSS allows a single optional plus or minus sign:
		// http://www.w3.org/TR/CSS2/syndata.html#numbers
		// CSS is ASCII case-insensitive:
		// http://www.w3.org/TR/CSS2/syndata.html#characters )
		// Spec allows exponential notation for <number> type:
		// http://dev.w3.org/csswg/css-values/#numbers
		var regexCssLengthWithUnits = /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i;

		// (This is a quick and lenient test. Because of optional unlimited-depth internal
		// grouping parens and strict spacing rules, this could get very complicated.)
		var regexCssCalc = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;

		var i;
		var unparsedSizesList;
		var unparsedSizesListLength;
		var unparsedSize;
		var lastComponentValue;
		var size;

		// UTILITY FUNCTIONS

		//  (Toy CSS parser. The goals here are:
		//  1) expansive test coverage without the weight of a full CSS parser.
		//  2) Avoiding regex wherever convenient.
		//  Quick tests: http://jsfiddle.net/gtntL4gr/3/
		//  Returns an array of arrays.)
		function parseComponentValues(str) {
			var chrctr;
			var component = "";
			var componentArray = [];
			var listArray = [];
			var parenDepth = 0;
			var pos = 0;
			var inComment = false;

			function pushComponent() {
				if (component) {
					componentArray.push(component);
					component = "";
				}
			}

			function pushComponentArray() {
				if (componentArray[0]) {
					listArray.push(componentArray);
					componentArray = [];
				}
			}

			// (Loop forwards from the beginning of the string.)
			while (true) {
				chrctr = str.charAt(pos);

				if (chrctr === "") { // ( End of string reached.)
					pushComponent();
					pushComponentArray();
					return listArray;
				} else if (inComment) {
					if ((chrctr === "*") && (str[pos + 1] === "/")) { // (At end of a comment.)
						inComment = false;
						pos += 2;
						pushComponent();
						continue;
					} else {
						pos += 1; // (Skip all characters inside comments.)
						continue;
					}
				} else if (isSpace(chrctr)) {
					// (If previous character in loop was also a space, or if
					// at the beginning of the string, do not add space char to
					// component.)
					if ( (str.charAt(pos - 1) && isSpace( str.charAt(pos - 1) ) ) || !component ) {
						pos += 1;
						continue;
					} else if (parenDepth === 0) {
						pushComponent();
						pos +=1;
						continue;
					} else {
						// (Replace any space character with a plain space for legibility.)
						chrctr = " ";
					}
				} else if (chrctr === "(") {
					parenDepth += 1;
				} else if (chrctr === ")") {
					parenDepth -= 1;
				} else if (chrctr === ",") {
					pushComponent();
					pushComponentArray();
					pos += 1;
					continue;
				} else if ( (chrctr === "/") && (str.charAt(pos + 1) === "*") ) {
					inComment = true;
					pos += 2;
					continue;
				}

				component = component + chrctr;
				pos += 1;
			}
		}

		function isValidNonNegativeSourceSizeValue(s) {
			if (regexCssLengthWithUnits.test(s) && (parseFloat(s) >= 0)) {return true;}
			if (regexCssCalc.test(s)) {return true;}
			// ( http://www.w3.org/TR/CSS2/syndata.html#numbers says:
			// "-0 is equivalent to 0 and is not a negative number." which means that
			// unitless zero and unitless negative zero must be accepted as special cases.)
			if ((s === "0") || (s === "-0") || (s === "+0")) {return true;}
			return false;
		}

		// When asked to parse a sizes attribute from an element, parse a
		// comma-separated list of component values from the value of the element's
		// sizes attribute (or the empty string, if the attribute is absent), and let
		// unparsed sizes list be the result.
		// http://dev.w3.org/csswg/css-syntax/#parse-comma-separated-list-of-component-values

		unparsedSizesList = parseComponentValues(strValue);
		unparsedSizesListLength = unparsedSizesList.length;

		// For each unparsed size in unparsed sizes list:
		for (i = 0; i < unparsedSizesListLength; i++) {
			unparsedSize = unparsedSizesList[i];

			// 1. Remove all consecutive <whitespace-token>s from the end of unparsed size.
			// ( parseComponentValues() already omits spaces outside of parens. )

			// If unparsed size is now empty, that is a parse error; continue to the next
			// iteration of this algorithm.
			// ( parseComponentValues() won't push an empty array. )

			// 2. If the last component value in unparsed size is a valid non-negative
			// <source-size-value>, let size be its value and remove the component value
			// from unparsed size. Any CSS function other than the calc() function is
			// invalid. Otherwise, there is a parse error; continue to the next iteration
			// of this algorithm.
			// http://dev.w3.org/csswg/css-syntax/#parse-component-value
			lastComponentValue = unparsedSize[unparsedSize.length - 1];

			if (isValidNonNegativeSourceSizeValue(lastComponentValue)) {
				size = lastComponentValue;
				unparsedSize.pop();
			} else {
				continue;
			}

			// 3. Remove all consecutive <whitespace-token>s from the end of unparsed
			// size. If unparsed size is now empty, return size and exit this algorithm.
			// If this was not the last item in unparsed sizes list, that is a parse error.
			if (unparsedSize.length === 0) {
				return size;
			}

			// 4. Parse the remaining component values in unparsed size as a
			// <media-condition>. If it does not parse correctly, or it does parse
			// correctly but the <media-condition> evaluates to false, continue to the
			// next iteration of this algorithm.
			// (Parsing all possible compound media conditions in JS is heavy, complicated,
			// and the payoff is unclear. Is there ever an situation where the
			// media condition parses incorrectly but still somehow evaluates to true?
			// Can we just rely on the browser/polyfill to do it?)
			unparsedSize = unparsedSize.join(" ");
			if (!(pf.matchesMedia( unparsedSize ) ) ) {
				continue;
			}

			// 5. Return size and exit this algorithm.
			return size;
		}

		// If the above algorithm exhausts unparsed sizes list without returning a
		// size value, return 100vw.
		return "100vw";
	}

	// namespace
	pf.ns = ("pf" + new Date().getTime()).substr(0, 9);

	// srcset support test
	pf.supSrcset = "srcset" in image;
	pf.supSizes = "sizes" in image;
	pf.supPicture = !!window.HTMLPictureElement;

	// UC browser does claim to support srcset and picture, but not sizes,
	// this extended test reveals the browser does support nothing
	if (pf.supSrcset && pf.supPicture && !pf.supSizes) {
		(function(image2) {
			image.srcset = "data:,a";
			image2.src = "data:,a";
			pf.supSrcset = image.complete === image2.complete;
			pf.supPicture = pf.supSrcset && pf.supPicture;
		})(document.createElement("img"));
	}

	// Safari9 has basic support for sizes, but does't expose the `sizes` idl attribute
	if (pf.supSrcset && !pf.supSizes) {

		(function() {
			var width2 = "data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==";
			var width1 = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
			var img = document.createElement("img");
			var test = function() {
				var width = img.width;

				if (width === 2) {
					pf.supSizes = true;
				}

				alwaysCheckWDescriptor = pf.supSrcset && !pf.supSizes;

				isSupportTestReady = true;
				// force async
				setTimeout(picturefill);
			};

			img.onload = test;
			img.onerror = test;
			img.setAttribute("sizes", "9px");

			img.srcset = width1 + " 1w," + width2 + " 9w";
			img.src = width1;
		})();

	} else {
		isSupportTestReady = true;
	}

	// using pf.qsa instead of dom traversing does scale much better,
	// especially on sites mixing responsive and non-responsive images
	pf.selShort = "picture>img,img[srcset]";
	pf.sel = pf.selShort;
	pf.cfg = cfg;

	/**
	 * Shortcut property for `devicePixelRatio` ( for easy overriding in tests )
	 */
	pf.DPR = (DPR  || 1 );
	pf.u = units;

	// container of supported mime types that one might need to qualify before using
	pf.types =  types;

	pf.setSize = noop;

	/**
	 * Gets a string and returns the absolute URL
	 * @param src
	 * @returns {String} absolute URL
	 */

	pf.makeUrl = memoize(function(src) {
		anchor.href = src;
		return anchor.href;
	});

	/**
	 * Gets a DOM element or document and a selctor and returns the found matches
	 * Can be extended with jQuery/Sizzle for IE7 support
	 * @param context
	 * @param sel
	 * @returns {NodeList|Array}
	 */
	pf.qsa = function(context, sel) {
		return ( "querySelector" in context ) ? context.querySelectorAll(sel) : [];
	};

	/**
	 * Shortcut method for matchMedia ( for easy overriding in tests )
	 * wether native or pf.mMQ is used will be decided lazy on first call
	 * @returns {boolean}
	 */
	pf.matchesMedia = function() {
		if ( window.matchMedia && (matchMedia( "(min-width: 0.1em)" ) || {}).matches ) {
			pf.matchesMedia = function( media ) {
				return !media || ( matchMedia( media ).matches );
			};
		} else {
			pf.matchesMedia = pf.mMQ;
		}

		return pf.matchesMedia.apply( this, arguments );
	};

	/**
	 * A simplified matchMedia implementation for IE8 and IE9
	 * handles only min-width/max-width with px or em values
	 * @param media
	 * @returns {boolean}
	 */
	pf.mMQ = function( media ) {
		return media ? evalCSS(media) : true;
	};

	/**
	 * Returns the calculated length in css pixel from the given sourceSizeValue
	 * http://dev.w3.org/csswg/css-values-3/#length-value
	 * intended Spec mismatches:
	 * * Does not check for invalid use of CSS functions
	 * * Does handle a computed length of 0 the same as a negative and therefore invalid value
	 * @param sourceSizeValue
	 * @returns {Number}
	 */
	pf.calcLength = function( sourceSizeValue ) {

		var value = evalCSS(sourceSizeValue, true) || false;
		if (value < 0) {
			value = false;
		}

		return value;
	};

	/**
	 * Takes a type string and checks if its supported
	 */

	pf.supportsType = function( type ) {
		return ( type ) ? types[ type ] : true;
	};

	/**
	 * Parses a sourceSize into mediaCondition (media) and sourceSizeValue (length)
	 * @param sourceSizeStr
	 * @returns {*}
	 */
	pf.parseSize = memoize(function( sourceSizeStr ) {
		var match = ( sourceSizeStr || "" ).match(regSize);
		return {
			media: match && match[1],
			length: match && match[2]
		};
	});

	pf.parseSet = function( set ) {
		if ( !set.cands ) {
			set.cands = parseSrcset(set.srcset, set);
		}
		return set.cands;
	};

	/**
	 * returns 1em in css px for html/body default size
	 * function taken from respondjs
	 * @returns {*|number}
	 */
	pf.getEmValue = function() {
		var body;
		if ( !eminpx && (body = document.body) ) {
			var div = document.createElement( "div" ),
				originalHTMLCSS = docElem.style.cssText,
				originalBodyCSS = body.style.cssText;

			div.style.cssText = baseStyle;

			// 1em in a media query is the value of the default font size of the browser
			// reset docElem and body to ensure the correct value is returned
			docElem.style.cssText = fsCss;
			body.style.cssText = fsCss;

			body.appendChild( div );
			eminpx = div.offsetWidth;
			body.removeChild( div );

			//also update eminpx before returning
			eminpx = parseFloat( eminpx, 10 );

			// restore the original values
			docElem.style.cssText = originalHTMLCSS;
			body.style.cssText = originalBodyCSS;

		}
		return eminpx || 16;
	};

	/**
	 * Takes a string of sizes and returns the width in pixels as a number
	 */
	pf.calcListLength = function( sourceSizeListStr ) {
		// Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
		//
		//                           or (min-width:30em) calc(30% - 15px)
		if ( !(sourceSizeListStr in sizeLengthCache) || cfg.uT ) {
			var winningLength = pf.calcLength( parseSizes( sourceSizeListStr ) );

			sizeLengthCache[ sourceSizeListStr ] = !winningLength ? units.width : winningLength;
		}

		return sizeLengthCache[ sourceSizeListStr ];
	};

	/**
	 * Takes a candidate object with a srcset property in the form of url/
	 * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
	 *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
	 *     "images/pic-small.png"
	 * Get an array of image candidates in the form of
	 *      {url: "/foo/bar.png", resolution: 1}
	 * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
	 * If sizes is specified, res is calculated
	 */
	pf.setRes = function( set ) {
		var candidates;
		if ( set ) {

			candidates = pf.parseSet( set );

			for ( var i = 0, len = candidates.length; i < len; i++ ) {
				setResolution( candidates[ i ], set.sizes );
			}
		}
		return candidates;
	};

	pf.setRes.res = setResolution;

	pf.applySetCandidate = function( candidates, img ) {
		if ( !candidates.length ) {return;}
		var candidate,
			i,
			j,
			length,
			bestCandidate,
			curSrc,
			curCan,
			candidateSrc,
			abortCurSrc;

		var imageData = img[ pf.ns ];
		var dpr = pf.DPR;

		curSrc = imageData.curSrc || img[curSrcProp];

		curCan = imageData.curCan || setSrcToCur(img, curSrc, candidates[0].set);

		// if we have a current source, we might either become lazy or give this source some advantage
		if ( curCan && curCan.set === candidates[ 0 ].set ) {

			// if browser can abort image request and the image has a higher pixel density than needed
			// and this image isn't downloaded yet, we skip next part and try to save bandwidth
			abortCurSrc = (supportAbort && !img.complete && curCan.res - 0.1 > dpr);

			if ( !abortCurSrc ) {
				curCan.cached = true;

				// if current candidate is "best", "better" or "okay",
				// set it to bestCandidate
				if ( curCan.res >= dpr ) {
					bestCandidate = curCan;
				}
			}
		}

		if ( !bestCandidate ) {

			candidates.sort( ascendingSort );

			length = candidates.length;
			bestCandidate = candidates[ length - 1 ];

			for ( i = 0; i < length; i++ ) {
				candidate = candidates[ i ];
				if ( candidate.res >= dpr ) {
					j = i - 1;

					// we have found the perfect candidate,
					// but let's improve this a little bit with some assumptions ;-)
					if (candidates[ j ] &&
						(abortCurSrc || curSrc !== pf.makeUrl( candidate.url )) &&
						chooseLowRes(candidates[ j ].res, candidate.res, dpr, candidates[ j ].cached)) {

						bestCandidate = candidates[ j ];

					} else {
						bestCandidate = candidate;
					}
					break;
				}
			}
		}

		if ( bestCandidate ) {

			candidateSrc = pf.makeUrl( bestCandidate.url );

			imageData.curSrc = candidateSrc;
			imageData.curCan = bestCandidate;

			if ( candidateSrc !== curSrc ) {
				pf.setSrc( img, bestCandidate );
			}
			pf.setSize( img );
		}
	};

	pf.setSrc = function( img, bestCandidate ) {
		var origWidth;
		img.src = bestCandidate.url;

		// although this is a specific Safari issue, we don't want to take too much different code paths
		if ( bestCandidate.set.type === "image/svg+xml" ) {
			origWidth = img.style.width;
			img.style.width = (img.offsetWidth + 1) + "px";

			// next line only should trigger a repaint
			// if... is only done to trick dead code removal
			if ( img.offsetWidth + 1 ) {
				img.style.width = origWidth;
			}
		}
	};

	pf.getSet = function( img ) {
		var i, set, supportsType;
		var match = false;
		var sets = img [ pf.ns ].sets;

		for ( i = 0; i < sets.length && !match; i++ ) {
			set = sets[i];

			if ( !set.srcset || !pf.matchesMedia( set.media ) || !(supportsType = pf.supportsType( set.type )) ) {
				continue;
			}

			if ( supportsType === "pending" ) {
				set = supportsType;
			}

			match = set;
			break;
		}

		return match;
	};

	pf.parseSets = function( element, parent, options ) {
		var srcsetAttribute, imageSet, isWDescripor, srcsetParsed;

		var hasPicture = parent && parent.nodeName.toUpperCase() === "PICTURE";
		var imageData = element[ pf.ns ];

		if ( imageData.src === undefined || options.src ) {
			imageData.src = getImgAttr.call( element, "src" );
			if ( imageData.src ) {
				setImgAttr.call( element, srcAttr, imageData.src );
			} else {
				removeImgAttr.call( element, srcAttr );
			}
		}

		if ( imageData.srcset === undefined || options.srcset || !pf.supSrcset || element.srcset ) {
			srcsetAttribute = getImgAttr.call( element, "srcset" );
			imageData.srcset = srcsetAttribute;
			srcsetParsed = true;
		}

		imageData.sets = [];

		if ( hasPicture ) {
			imageData.pic = true;
			getAllSourceElements( parent, imageData.sets );
		}

		if ( imageData.srcset ) {
			imageSet = {
				srcset: imageData.srcset,
				sizes: getImgAttr.call( element, "sizes" )
			};

			imageData.sets.push( imageSet );

			isWDescripor = (alwaysCheckWDescriptor || imageData.src) && regWDesc.test(imageData.srcset || "");

			// add normal src as candidate, if source has no w descriptor
			if ( !isWDescripor && imageData.src && !getCandidateForSrc(imageData.src, imageSet) && !imageSet.has1x ) {
				imageSet.srcset += ", " + imageData.src;
				imageSet.cands.push({
					url: imageData.src,
					d: 1,
					set: imageSet
				});
			}

		} else if ( imageData.src ) {
			imageData.sets.push( {
				srcset: imageData.src,
				sizes: null
			} );
		}

		imageData.curCan = null;
		imageData.curSrc = undefined;

		// if img has picture or the srcset was removed or has a srcset and does not support srcset at all
		// or has a w descriptor (and does not support sizes) set support to false to evaluate
		imageData.supported = !( hasPicture || ( imageSet && !pf.supSrcset ) || (isWDescripor && !pf.supSizes) );

		if ( srcsetParsed && pf.supSrcset && !imageData.supported ) {
			if ( srcsetAttribute ) {
				setImgAttr.call( element, srcsetAttr, srcsetAttribute );
				element.srcset = "";
			} else {
				removeImgAttr.call( element, srcsetAttr );
			}
		}

		if (imageData.supported && !imageData.srcset && ((!imageData.src && element.src) ||  element.src !== pf.makeUrl(imageData.src))) {
			if (imageData.src === null) {
				element.removeAttribute("src");
			} else {
				element.src = imageData.src;
			}
		}

		imageData.parsed = true;
	};

	pf.fillImg = function(element, options) {
		var imageData;
		var extreme = options.reselect || options.reevaluate;

		// expando for caching data on the img
		if ( !element[ pf.ns ] ) {
			element[ pf.ns ] = {};
		}

		imageData = element[ pf.ns ];

		// if the element has already been evaluated, skip it
		// unless `options.reevaluate` is set to true ( this, for example,
		// is set to true when running `picturefill` on `resize` ).
		if ( !extreme && imageData.evaled === evalId ) {
			return;
		}

		if ( !imageData.parsed || options.reevaluate ) {
			pf.parseSets( element, element.parentNode, options );
		}

		if ( !imageData.supported ) {
			applyBestCandidate( element );
		} else {
			imageData.evaled = evalId;
		}
	};

	pf.setupRun = function() {
		if ( !alreadyRun || isVwDirty || (DPR !== window.devicePixelRatio) ) {
			updateMetrics();
		}
	};

	// If picture is supported, well, that's awesome.
	if ( pf.supPicture ) {
		picturefill = noop;
		pf.fillImg = noop;
	} else {

		 // Set up picture polyfill by polling the document
		(function() {
			var isDomReady;
			var regReady = window.attachEvent ? /d$|^c/ : /d$|^c|^i/;

			var run = function() {
				var readyState = document.readyState || "";

				timerId = setTimeout(run, readyState === "loading" ? 200 :  999);
				if ( document.body ) {
					pf.fillImgs();
					isDomReady = isDomReady || regReady.test(readyState);
					if ( isDomReady ) {
						clearTimeout( timerId );
					}

				}
			};

			var timerId = setTimeout(run, document.body ? 9 : 99);

			// Also attach picturefill on resize and readystatechange
			// http://modernjavascript.blogspot.com/2013/08/building-better-debounce.html
			var debounce = function(func, wait) {
				var timeout, timestamp;
				var later = function() {
					var last = (new Date()) - timestamp;

					if (last < wait) {
						timeout = setTimeout(later, wait - last);
					} else {
						timeout = null;
						func();
					}
				};

				return function() {
					timestamp = new Date();

					if (!timeout) {
						timeout = setTimeout(later, wait);
					}
				};
			};
			var lastClientWidth = docElem.clientHeight;
			var onResize = function() {
				isVwDirty = Math.max(window.innerWidth || 0, docElem.clientWidth) !== units.width || docElem.clientHeight !== lastClientWidth;
				lastClientWidth = docElem.clientHeight;
				if ( isVwDirty ) {
					pf.fillImgs();
				}
			};

			on( window, "resize", debounce(onResize, 99 ) );
			on( document, "readystatechange", run );
		})();
	}

	pf.picturefill = picturefill;
	//use this internally for easy monkey patching/performance testing
	pf.fillImgs = picturefill;
	pf.teardownRun = noop;

	/* expose methods for testing */
	picturefill._ = pf;

	window.picturefillCFG = {
		pf: pf,
		push: function(args) {
			var name = args.shift();
			if (typeof pf[name] === "function") {
				pf[name].apply(pf, args);
			} else {
				cfg[name] = args[0];
				if (alreadyRun) {
					pf.fillImgs( { reselect: true } );
				}
			}
		}
	};

	while (setOptions && setOptions.length) {
		window.picturefillCFG.push(setOptions.shift());
	}

	/* expose picturefill */
	window.picturefill = picturefill;

	/* expose picturefill */
	if (  true && typeof module.exports === "object" ) {
		// CommonJS, just export
		module.exports = picturefill;
	} else if ( true ) {
		// AMD support
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return picturefill; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}

	// IE8 evals this sync, so it must be the last thing we do
	if ( !pf.supPicture ) {
		types[ "image/webp" ] = detectTypeSupport("image/webp", "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==" );
	}

} )( window, document );


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(229);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbGlicy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0Esd0ZBQXdGO0FBQ3hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLE9BQU8sa0JBQWtCLGNBQWMsVUFBVSxZQUFZLGNBQWMsVUFBVSxnQkFBZ0I7QUFDekksdUNBQXVDO0FBQ3ZDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBNEI7O0FBRTVCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLFVBQVU7QUFDMUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVk7QUFDWixXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHVCQUF1QjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDLFNBQVM7QUFDOUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixxQ0FBcUM7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0Isd0JBQXdCO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdCQUFnQixNQUFNOztBQUU5QztBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0EsdUJBQXVCOztBQUV2QjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0JBQWdCLE1BQU07O0FBRTlDO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0Esa0JBQWtCOztBQUVsQjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0JBQWdCLE1BQU07O0FBRTlDO0FBQ0EsTUFBTSxNQUFNO0FBQ1osS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWE7QUFDYixhQUFhO0FBQ2IsYUFBYTtBQUNiLHlCQUF5QjtBQUN6Qiw0QkFBNEI7QUFDNUI7O0FBRUE7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUVBQWlFO0FBQ2pFLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjLDZCQUE2QjtBQUMzQzs7QUFFQTtBQUNBOztBQUVBLDREQUE0RDtBQUM1RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0M7QUFDaEMsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVILEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsUUFBUTtBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxxRUFBcUU7QUFDckU7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsNkNBQTZDLFNBQVM7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsZ0JBQWdCLFlBQVk7QUFDNUI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUVBQW1FO0FBQ25FO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxlQUFlLDJCQUEyQjtBQUMxQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxvQkFBb0IsaUJBQWlCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsTUFBTSxLQUEwQjtBQUNoQztBQUNBO0FBQ0EsR0FBRyxVQUFVLElBQTBDO0FBQ3ZEO0FBQ0EsRUFBRSxtQ0FBdUIsYUFBYSxxQkFBcUI7QUFBQSxrR0FBRTtBQUM3RDs7QUFFQTtBQUNBO0FBQ0EsMkVBQTJFO0FBQzNFOztBQUVBLEVBQUU7Ozs7Ozs7VUN2Z0RGO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS8uL25vZGVfbW9kdWxlcy9waWN0dXJlZmlsbC9kaXN0L3BpY3R1cmVmaWxsLmpzIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgcGljdHVyZWZpbGwgLSB2My4wLjIgLSAyMDE2LTAyLTEyXG4gKiBodHRwczovL3Njb3R0amVobC5naXRodWIuaW8vcGljdHVyZWZpbGwvXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYgaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0amVobC9waWN0dXJlZmlsbC9ibG9iL21hc3Rlci9BdXRob3JzLnR4dDsgTGljZW5zZWQgTUlUXG4gKi9cbi8qISBHZWNrby1QaWN0dXJlIC0gdjEuMFxuICogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0amVobC9waWN0dXJlZmlsbC90cmVlLzMuMC9zcmMvcGx1Z2lucy9nZWNrby1waWN0dXJlXG4gKiBGaXJlZm94J3MgZWFybHkgcGljdHVyZSBpbXBsZW1lbnRhdGlvbiAocHJpb3IgdG8gRkY0MSkgaXMgc3RhdGljIGFuZCBkb2VzXG4gKiBub3QgcmVhY3QgdG8gdmlld3BvcnQgY2hhbmdlcy4gVGhpcyB0aW55IG1vZHVsZSBmaXhlcyB0aGlzLlxuICovXG4oZnVuY3Rpb24od2luZG93KSB7XG5cdC8qanNoaW50IGVxbnVsbDp0cnVlICovXG5cdHZhciB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cblx0aWYgKCB3aW5kb3cuSFRNTFBpY3R1cmVFbGVtZW50ICYmICgoL2Vja28vKS50ZXN0KHVhKSAmJiB1YS5tYXRjaCgvcnZcXDooXFxkKykvKSAmJiBSZWdFeHAuJDEgPCA0NSkgKSB7XG5cdFx0YWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdGltZXI7XG5cblx0XHRcdHZhciBkdW1teVNyYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzb3VyY2VcIik7XG5cblx0XHRcdHZhciBmaXhSZXNwaW1nID0gZnVuY3Rpb24oaW1nKSB7XG5cdFx0XHRcdHZhciBzb3VyY2UsIHNpemVzO1xuXHRcdFx0XHR2YXIgcGljdHVyZSA9IGltZy5wYXJlbnROb2RlO1xuXG5cdFx0XHRcdGlmIChwaWN0dXJlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09IFwiUElDVFVSRVwiKSB7XG5cdFx0XHRcdFx0c291cmNlID0gZHVtbXlTcmMuY2xvbmVOb2RlKCk7XG5cblx0XHRcdFx0XHRwaWN0dXJlLmluc2VydEJlZm9yZShzb3VyY2UsIHBpY3R1cmUuZmlyc3RFbGVtZW50Q2hpbGQpO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRwaWN0dXJlLnJlbW92ZUNoaWxkKHNvdXJjZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIWltZy5fcGZMYXN0U2l6ZSB8fCBpbWcub2Zmc2V0V2lkdGggPiBpbWcuX3BmTGFzdFNpemUpIHtcblx0XHRcdFx0XHRpbWcuX3BmTGFzdFNpemUgPSBpbWcub2Zmc2V0V2lkdGg7XG5cdFx0XHRcdFx0c2l6ZXMgPSBpbWcuc2l6ZXM7XG5cdFx0XHRcdFx0aW1nLnNpemVzICs9IFwiLDEwMHZ3XCI7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGltZy5zaXplcyA9IHNpemVzO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgZmluZFBpY3R1cmVJbWdzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBpO1xuXHRcdFx0XHR2YXIgaW1ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJwaWN0dXJlID4gaW1nLCBpbWdbc3Jjc2V0XVtzaXplc11cIik7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBpbWdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0Zml4UmVzcGltZyhpbWdzW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHZhciBvblJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xuXHRcdFx0XHR0aW1lciA9IHNldFRpbWVvdXQoZmluZFBpY3R1cmVJbWdzLCA5OSk7XG5cdFx0XHR9O1xuXHRcdFx0dmFyIG1xID0gd2luZG93Lm1hdGNoTWVkaWEgJiYgbWF0Y2hNZWRpYShcIihvcmllbnRhdGlvbjogbGFuZHNjYXBlKVwiKTtcblx0XHRcdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG9uUmVzaXplKCk7XG5cblx0XHRcdFx0aWYgKG1xICYmIG1xLmFkZExpc3RlbmVyKSB7XG5cdFx0XHRcdFx0bXEuYWRkTGlzdGVuZXIob25SZXNpemUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRkdW1teVNyYy5zcmNzZXQgPSBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBQUFBQUNINUJBRUtBQUVBTEFBQUFBQUJBQUVBQUFJQ1RBRUFPdz09XCI7XG5cblx0XHRcdGlmICgvXltjfGldfGQkLy50ZXN0KGRvY3VtZW50LnJlYWR5U3RhdGUgfHwgXCJcIikpIHtcblx0XHRcdFx0aW5pdCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvblJlc2l6ZTtcblx0XHR9KSgpKTtcblx0fVxufSkod2luZG93KTtcblxuLyohIFBpY3R1cmVmaWxsIC0gdjMuMC4yXG4gKiBodHRwOi8vc2NvdHRqZWhsLmdpdGh1Yi5pby9waWN0dXJlZmlsbFxuICogQ29weXJpZ2h0IChjKSAyMDE1IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGplaGwvcGljdHVyZWZpbGwvYmxvYi9tYXN0ZXIvQXV0aG9ycy50eHQ7XG4gKiAgTGljZW5zZTogTUlUXG4gKi9cblxuKGZ1bmN0aW9uKCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQgKSB7XG5cdC8vIEVuYWJsZSBzdHJpY3QgbW9kZVxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHQvLyBIVE1MIHNoaW18diBpdCBmb3Igb2xkIElFIChJRTkgd2lsbCBzdGlsbCBuZWVkIHRoZSBIVE1MIHZpZGVvIHRhZyB3b3JrYXJvdW5kKVxuXHRkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcInBpY3R1cmVcIiApO1xuXG5cdHZhciB3YXJuLCBlbWlucHgsIGFsd2F5c0NoZWNrV0Rlc2NyaXB0b3IsIGV2YWxJZDtcblx0Ly8gbG9jYWwgb2JqZWN0IGZvciBtZXRob2QgcmVmZXJlbmNlcyBhbmQgdGVzdGluZyBleHBvc3VyZVxuXHR2YXIgcGYgPSB7fTtcblx0dmFyIGlzU3VwcG9ydFRlc3RSZWFkeSA9IGZhbHNlO1xuXHR2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cdHZhciBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiaW1nXCIgKTtcblx0dmFyIGdldEltZ0F0dHIgPSBpbWFnZS5nZXRBdHRyaWJ1dGU7XG5cdHZhciBzZXRJbWdBdHRyID0gaW1hZ2Uuc2V0QXR0cmlidXRlO1xuXHR2YXIgcmVtb3ZlSW1nQXR0ciA9IGltYWdlLnJlbW92ZUF0dHJpYnV0ZTtcblx0dmFyIGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdHZhciB0eXBlcyA9IHt9O1xuXHR2YXIgY2ZnID0ge1xuXHRcdC8vcmVzb3VyY2Ugc2VsZWN0aW9uOlxuXHRcdGFsZ29yaXRobTogXCJcIlxuXHR9O1xuXHR2YXIgc3JjQXR0ciA9IFwiZGF0YS1wZnNyY1wiO1xuXHR2YXIgc3Jjc2V0QXR0ciA9IHNyY0F0dHIgKyBcInNldFwiO1xuXHQvLyB1YSBzbmlmZmluZyBpcyBkb25lIGZvciB1bmRldGVjdGFibGUgaW1nIGxvYWRpbmcgZmVhdHVyZXMsXG5cdC8vIHRvIGRvIHNvbWUgbm9uIGNydWNpYWwgcGVyZiBvcHRpbWl6YXRpb25zXG5cdHZhciB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cdHZhciBzdXBwb3J0QWJvcnQgPSAoL3JpZGVudC8pLnRlc3QodWEpIHx8ICgoL2Vja28vKS50ZXN0KHVhKSAmJiB1YS5tYXRjaCgvcnZcXDooXFxkKykvKSAmJiBSZWdFeHAuJDEgPiAzNSApO1xuXHR2YXIgY3VyU3JjUHJvcCA9IFwiY3VycmVudFNyY1wiO1xuXHR2YXIgcmVnV0Rlc2MgPSAvXFxzK1xcKz9cXGQrKGVcXGQrKT93Lztcblx0dmFyIHJlZ1NpemUgPSAvKFxcKFteKV0rXFwpKT9cXHMqKC4rKS87XG5cdHZhciBzZXRPcHRpb25zID0gd2luZG93LnBpY3R1cmVmaWxsQ0ZHO1xuXHQvKipcblx0ICogU2hvcnRjdXQgcHJvcGVydHkgZm9yIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMvc3BlY3MvbWl4ZWRjb250ZW50LyNyZXN0cmljdHMtbWl4ZWQtY29udGVudCAoIGZvciBlYXN5IG92ZXJyaWRpbmcgaW4gdGVzdHMgKVxuXHQgKi9cblx0Ly8gYmFzZVN0eWxlIGFsc28gdXNlZCBieSBnZXRFbVZhbHVlIChpLmUuOiB3aWR0aDogMWVtIGlzIGltcG9ydGFudClcblx0dmFyIGJhc2VTdHlsZSA9IFwicG9zaXRpb246YWJzb2x1dGU7bGVmdDowO3Zpc2liaWxpdHk6aGlkZGVuO2Rpc3BsYXk6YmxvY2s7cGFkZGluZzowO2JvcmRlcjpub25lO2ZvbnQtc2l6ZToxZW07d2lkdGg6MWVtO292ZXJmbG93OmhpZGRlbjtjbGlwOnJlY3QoMHB4LCAwcHgsIDBweCwgMHB4KVwiO1xuXHR2YXIgZnNDc3MgPSBcImZvbnQtc2l6ZToxMDAlIWltcG9ydGFudDtcIjtcblx0dmFyIGlzVndEaXJ0eSA9IHRydWU7XG5cblx0dmFyIGNzc0NhY2hlID0ge307XG5cdHZhciBzaXplTGVuZ3RoQ2FjaGUgPSB7fTtcblx0dmFyIERQUiA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuXHR2YXIgdW5pdHMgPSB7XG5cdFx0cHg6IDEsXG5cdFx0XCJpblwiOiA5NlxuXHR9O1xuXHR2YXIgYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJhXCIgKTtcblx0LyoqXG5cdCAqIGFscmVhZHlSdW4gZmxhZyB1c2VkIGZvciBzZXRPcHRpb25zLiBpcyBpdCB0cnVlIHNldE9wdGlvbnMgd2lsbCByZWV2YWx1YXRlXG5cdCAqIEB0eXBlIHtib29sZWFufVxuXHQgKi9cblx0dmFyIGFscmVhZHlSdW4gPSBmYWxzZTtcblxuXHQvLyBSZXVzYWJsZSwgbm9uLVwiZ1wiIFJlZ2V4ZXNcblxuXHQvLyAoRG9uJ3QgdXNlIFxccywgdG8gYXZvaWQgbWF0Y2hpbmcgbm9uLWJyZWFraW5nIHNwYWNlLilcblx0dmFyIHJlZ2V4TGVhZGluZ1NwYWNlcyA9IC9eWyBcXHRcXG5cXHJcXHUwMDBjXSsvLFxuXHQgICAgcmVnZXhMZWFkaW5nQ29tbWFzT3JTcGFjZXMgPSAvXlssIFxcdFxcblxcclxcdTAwMGNdKy8sXG5cdCAgICByZWdleExlYWRpbmdOb3RTcGFjZXMgPSAvXlteIFxcdFxcblxcclxcdTAwMGNdKy8sXG5cdCAgICByZWdleFRyYWlsaW5nQ29tbWFzID0gL1ssXSskLyxcblx0ICAgIHJlZ2V4Tm9uTmVnYXRpdmVJbnRlZ2VyID0gL15cXGQrJC8sXG5cblx0ICAgIC8vICggUG9zaXRpdmUgb3IgbmVnYXRpdmUgb3IgdW5zaWduZWQgaW50ZWdlcnMgb3IgZGVjaW1hbHMsIHdpdGhvdXQgb3Igd2l0aG91dCBleHBvbmVudHMuXG5cdCAgICAvLyBNdXN0IGluY2x1ZGUgYXQgbGVhc3Qgb25lIGRpZ2l0LlxuXHQgICAgLy8gQWNjb3JkaW5nIHRvIHNwZWMgdGVzdHMgYW55IGRlY2ltYWwgcG9pbnQgbXVzdCBiZSBmb2xsb3dlZCBieSBhIGRpZ2l0LlxuXHQgICAgLy8gTm8gbGVhZGluZyBwbHVzIHNpZ24gaXMgYWxsb3dlZC4pXG5cdCAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9pbmZyYXN0cnVjdHVyZS5odG1sI3ZhbGlkLWZsb2F0aW5nLXBvaW50LW51bWJlclxuXHQgICAgcmVnZXhGbG9hdGluZ1BvaW50ID0gL14tPyg/OlswLTldK3xbMC05XSpcXC5bMC05XSspKD86W2VFXVsrLV0/WzAtOV0rKT8kLztcblxuXHR2YXIgb24gPSBmdW5jdGlvbihvYmosIGV2dCwgZm4sIGNhcHR1cmUpIHtcblx0XHRpZiAoIG9iai5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdFx0b2JqLmFkZEV2ZW50TGlzdGVuZXIoZXZ0LCBmbiwgY2FwdHVyZSB8fCBmYWxzZSk7XG5cdFx0fSBlbHNlIGlmICggb2JqLmF0dGFjaEV2ZW50ICkge1xuXHRcdFx0b2JqLmF0dGFjaEV2ZW50KCBcIm9uXCIgKyBldnQsIGZuKTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIHNpbXBsZSBtZW1vaXplIGZ1bmN0aW9uOlxuXHQgKi9cblxuXHR2YXIgbWVtb2l6ZSA9IGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIGNhY2hlID0ge307XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XG5cdFx0XHRpZiAoICEoaW5wdXQgaW4gY2FjaGUpICkge1xuXHRcdFx0XHRjYWNoZVsgaW5wdXQgXSA9IGZuKGlucHV0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBjYWNoZVsgaW5wdXQgXTtcblx0XHR9O1xuXHR9O1xuXG5cdC8vIFVUSUxJVFkgRlVOQ1RJT05TXG5cblx0Ly8gTWFudWFsIGlzIGZhc3RlciB0aGFuIFJlZ0V4XG5cdC8vIGh0dHA6Ly9qc3BlcmYuY29tL3doaXRlc3BhY2UtY2hhcmFjdGVyLzVcblx0ZnVuY3Rpb24gaXNTcGFjZShjKSB7XG5cdFx0cmV0dXJuIChjID09PSBcIlxcdTAwMjBcIiB8fCAvLyBzcGFjZVxuXHRcdCAgICAgICAgYyA9PT0gXCJcXHUwMDA5XCIgfHwgLy8gaG9yaXpvbnRhbCB0YWJcblx0XHQgICAgICAgIGMgPT09IFwiXFx1MDAwQVwiIHx8IC8vIG5ldyBsaW5lXG5cdFx0ICAgICAgICBjID09PSBcIlxcdTAwMENcIiB8fCAvLyBmb3JtIGZlZWRcblx0XHQgICAgICAgIGMgPT09IFwiXFx1MDAwRFwiKTsgIC8vIGNhcnJpYWdlIHJldHVyblxuXHR9XG5cblx0LyoqXG5cdCAqIGdldHMgYSBtZWRpYXF1ZXJ5IGFuZCByZXR1cm5zIGEgYm9vbGVhbiBvciBnZXRzIGEgY3NzIGxlbmd0aCBhbmQgcmV0dXJucyBhIG51bWJlclxuXHQgKiBAcGFyYW0gY3NzIG1lZGlhcXVlcmllcyBvciBjc3MgbGVuZ3RoXG5cdCAqIEByZXR1cm5zIHtib29sZWFufG51bWJlcn1cblx0ICpcblx0ICogYmFzZWQgb246IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2pvbmF0aGFudG5lYWwvZGI0Zjc3MDA5YjE1NWYwODM3Mzhcblx0ICovXG5cdHZhciBldmFsQ1NTID0gKGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIHJlZ0xlbmd0aCA9IC9eKFtcXGRcXC5dKykoZW18dnd8cHgpJC87XG5cdFx0dmFyIHJlcGxhY2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBhcmdzID0gYXJndW1lbnRzLCBpbmRleCA9IDAsIHN0cmluZyA9IGFyZ3NbMF07XG5cdFx0XHR3aGlsZSAoKytpbmRleCBpbiBhcmdzKSB7XG5cdFx0XHRcdHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKGFyZ3NbaW5kZXhdLCBhcmdzWysraW5kZXhdKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdHJpbmc7XG5cdFx0fTtcblxuXHRcdHZhciBidWlsZFN0ciA9IG1lbW9pemUoZnVuY3Rpb24oY3NzKSB7XG5cblx0XHRcdHJldHVybiBcInJldHVybiBcIiArIHJlcGxhY2UoKGNzcyB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHQvLyBpbnRlcnByZXQgYGFuZGBcblx0XHRcdFx0L1xcYmFuZFxcYi9nLCBcIiYmXCIsXG5cblx0XHRcdFx0Ly8gaW50ZXJwcmV0IGAsYFxuXHRcdFx0XHQvLC9nLCBcInx8XCIsXG5cblx0XHRcdFx0Ly8gaW50ZXJwcmV0IGBtaW4tYCBhcyA+PVxuXHRcdFx0XHQvbWluLShbYS16LVxcc10rKTovZywgXCJlLiQxPj1cIixcblxuXHRcdFx0XHQvLyBpbnRlcnByZXQgYG1heC1gIGFzIDw9XG5cdFx0XHRcdC9tYXgtKFthLXotXFxzXSspOi9nLCBcImUuJDE8PVwiLFxuXG5cdFx0XHRcdC8vY2FsYyB2YWx1ZVxuXHRcdFx0XHQvY2FsYyhbXildKykvZywgXCIoJDEpXCIsXG5cblx0XHRcdFx0Ly8gaW50ZXJwcmV0IGNzcyB2YWx1ZXNcblx0XHRcdFx0LyhcXGQrW1xcLl0qW1xcZF0qKShbYS16XSspL2csIFwiKCQxICogZS4kMilcIixcblx0XHRcdFx0Ly9tYWtlIGV2YWwgbGVzcyBldmlsXG5cdFx0XHRcdC9eKD8hKGUuW2Etel18WzAtOVxcLiY9fD48XFwrXFwtXFwqXFwoXFwpXFwvXSkpLiovaWcsIFwiXCJcblx0XHRcdCkgKyBcIjtcIjtcblx0XHR9KTtcblxuXHRcdHJldHVybiBmdW5jdGlvbihjc3MsIGxlbmd0aCkge1xuXHRcdFx0dmFyIHBhcnNlZExlbmd0aDtcblx0XHRcdGlmICghKGNzcyBpbiBjc3NDYWNoZSkpIHtcblx0XHRcdFx0Y3NzQ2FjaGVbY3NzXSA9IGZhbHNlO1xuXHRcdFx0XHRpZiAobGVuZ3RoICYmIChwYXJzZWRMZW5ndGggPSBjc3MubWF0Y2goIHJlZ0xlbmd0aCApKSkge1xuXHRcdFx0XHRcdGNzc0NhY2hlW2Nzc10gPSBwYXJzZWRMZW5ndGhbIDEgXSAqIHVuaXRzW3BhcnNlZExlbmd0aFsgMiBdXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvKmpzaGludCBldmlsOnRydWUgKi9cblx0XHRcdFx0XHR0cnl7XG5cdFx0XHRcdFx0XHRjc3NDYWNoZVtjc3NdID0gbmV3IEZ1bmN0aW9uKFwiZVwiLCBidWlsZFN0cihjc3MpKSh1bml0cyk7XG5cdFx0XHRcdFx0fSBjYXRjaChlKSB7fVxuXHRcdFx0XHRcdC8qanNoaW50IGV2aWw6ZmFsc2UgKi9cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNzc0NhY2hlW2Nzc107XG5cdFx0fTtcblx0fSkoKTtcblxuXHR2YXIgc2V0UmVzb2x1dGlvbiA9IGZ1bmN0aW9uKCBjYW5kaWRhdGUsIHNpemVzYXR0ciApIHtcblx0XHRpZiAoIGNhbmRpZGF0ZS53ICkgeyAvLyBoID0gbWVhbnMgaGVpZ2h0OiB8fCBkZXNjcmlwdG9yLnR5cGUgPT09ICdoJyBkbyBub3QgaGFuZGxlIHlldC4uLlxuXHRcdFx0Y2FuZGlkYXRlLmNXaWR0aCA9IHBmLmNhbGNMaXN0TGVuZ3RoKCBzaXplc2F0dHIgfHwgXCIxMDB2d1wiICk7XG5cdFx0XHRjYW5kaWRhdGUucmVzID0gY2FuZGlkYXRlLncgLyBjYW5kaWRhdGUuY1dpZHRoIDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2FuZGlkYXRlLnJlcyA9IGNhbmRpZGF0ZS5kO1xuXHRcdH1cblx0XHRyZXR1cm4gY2FuZGlkYXRlO1xuXHR9O1xuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0gb3B0XG5cdCAqL1xuXHR2YXIgcGljdHVyZWZpbGwgPSBmdW5jdGlvbiggb3B0ICkge1xuXG5cdFx0aWYgKCFpc1N1cHBvcnRUZXN0UmVhZHkpIHtyZXR1cm47fVxuXG5cdFx0dmFyIGVsZW1lbnRzLCBpLCBwbGVuO1xuXG5cdFx0dmFyIG9wdGlvbnMgPSBvcHQgfHwge307XG5cblx0XHRpZiAoIG9wdGlvbnMuZWxlbWVudHMgJiYgb3B0aW9ucy5lbGVtZW50cy5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdGlmICggb3B0aW9ucy5lbGVtZW50cy5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSBcIklNR1wiICkge1xuXHRcdFx0XHRvcHRpb25zLmVsZW1lbnRzID0gIFsgb3B0aW9ucy5lbGVtZW50cyBdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b3B0aW9ucy5jb250ZXh0ID0gb3B0aW9ucy5lbGVtZW50cztcblx0XHRcdFx0b3B0aW9ucy5lbGVtZW50cyA9ICBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGVsZW1lbnRzID0gb3B0aW9ucy5lbGVtZW50cyB8fCBwZi5xc2EoIChvcHRpb25zLmNvbnRleHQgfHwgZG9jdW1lbnQpLCAoIG9wdGlvbnMucmVldmFsdWF0ZSB8fCBvcHRpb25zLnJlc2VsZWN0ICkgPyBwZi5zZWwgOiBwZi5zZWxTaG9ydCApO1xuXG5cdFx0aWYgKCAocGxlbiA9IGVsZW1lbnRzLmxlbmd0aCkgKSB7XG5cblx0XHRcdHBmLnNldHVwUnVuKCBvcHRpb25zICk7XG5cdFx0XHRhbHJlYWR5UnVuID0gdHJ1ZTtcblxuXHRcdFx0Ly8gTG9vcCB0aHJvdWdoIGFsbCBlbGVtZW50c1xuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBwbGVuOyBpKysgKSB7XG5cdFx0XHRcdHBmLmZpbGxJbWcoZWxlbWVudHNbIGkgXSwgb3B0aW9ucyk7XG5cdFx0XHR9XG5cblx0XHRcdHBmLnRlYXJkb3duUnVuKCBvcHRpb25zICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBvdXRwdXRzIGEgd2FybmluZyBmb3IgdGhlIGRldmVsb3BlclxuXHQgKiBAcGFyYW0ge21lc3NhZ2V9XG5cdCAqIEB0eXBlIHtGdW5jdGlvbn1cblx0ICovXG5cdHdhcm4gPSAoIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2FybiApID9cblx0XHRmdW5jdGlvbiggbWVzc2FnZSApIHtcblx0XHRcdGNvbnNvbGUud2FybiggbWVzc2FnZSApO1xuXHRcdH0gOlxuXHRcdG5vb3Bcblx0O1xuXG5cdGlmICggIShjdXJTcmNQcm9wIGluIGltYWdlKSApIHtcblx0XHRjdXJTcmNQcm9wID0gXCJzcmNcIjtcblx0fVxuXG5cdC8vIEFkZCBzdXBwb3J0IGZvciBzdGFuZGFyZCBtaW1lIHR5cGVzLlxuXHR0eXBlc1sgXCJpbWFnZS9qcGVnXCIgXSA9IHRydWU7XG5cdHR5cGVzWyBcImltYWdlL2dpZlwiIF0gPSB0cnVlO1xuXHR0eXBlc1sgXCJpbWFnZS9wbmdcIiBdID0gdHJ1ZTtcblxuXHRmdW5jdGlvbiBkZXRlY3RUeXBlU3VwcG9ydCggdHlwZSwgdHlwZVVyaSApIHtcblx0XHQvLyBiYXNlZCBvbiBNb2Rlcm5penIncyBsb3NzbGVzcyBpbWctd2VicCB0ZXN0XG5cdFx0Ly8gbm90ZTogYXN5bmNocm9ub3VzXG5cdFx0dmFyIGltYWdlID0gbmV3IHdpbmRvdy5JbWFnZSgpO1xuXHRcdGltYWdlLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblx0XHRcdHR5cGVzWyB0eXBlIF0gPSBmYWxzZTtcblx0XHRcdHBpY3R1cmVmaWxsKCk7XG5cdFx0fTtcblx0XHRpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdHR5cGVzWyB0eXBlIF0gPSBpbWFnZS53aWR0aCA9PT0gMTtcblx0XHRcdHBpY3R1cmVmaWxsKCk7XG5cdFx0fTtcblx0XHRpbWFnZS5zcmMgPSB0eXBlVXJpO1xuXHRcdHJldHVybiBcInBlbmRpbmdcIjtcblx0fVxuXG5cdC8vIHRlc3Qgc3ZnIHN1cHBvcnRcblx0dHlwZXNbIFwiaW1hZ2Uvc3ZnK3htbFwiIF0gPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKCBcImh0dHA6Ly93d3cudzMub3JnL1RSL1NWRzExL2ZlYXR1cmUjSW1hZ2VcIiwgXCIxLjFcIiApO1xuXG5cdC8qKlxuXHQgKiB1cGRhdGVzIHRoZSBpbnRlcm5hbCB2VyBwcm9wZXJ0eSB3aXRoIHRoZSBjdXJyZW50IHZpZXdwb3J0IHdpZHRoIGluIHB4XG5cdCAqL1xuXHRmdW5jdGlvbiB1cGRhdGVNZXRyaWNzKCkge1xuXG5cdFx0aXNWd0RpcnR5ID0gZmFsc2U7XG5cdFx0RFBSID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG5cdFx0Y3NzQ2FjaGUgPSB7fTtcblx0XHRzaXplTGVuZ3RoQ2FjaGUgPSB7fTtcblxuXHRcdHBmLkRQUiA9IERQUiB8fCAxO1xuXG5cdFx0dW5pdHMud2lkdGggPSBNYXRoLm1heCh3aW5kb3cuaW5uZXJXaWR0aCB8fCAwLCBkb2NFbGVtLmNsaWVudFdpZHRoKTtcblx0XHR1bml0cy5oZWlnaHQgPSBNYXRoLm1heCh3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMCwgZG9jRWxlbS5jbGllbnRIZWlnaHQpO1xuXG5cdFx0dW5pdHMudncgPSB1bml0cy53aWR0aCAvIDEwMDtcblx0XHR1bml0cy52aCA9IHVuaXRzLmhlaWdodCAvIDEwMDtcblxuXHRcdGV2YWxJZCA9IFsgdW5pdHMuaGVpZ2h0LCB1bml0cy53aWR0aCwgRFBSIF0uam9pbihcIi1cIik7XG5cblx0XHR1bml0cy5lbSA9IHBmLmdldEVtVmFsdWUoKTtcblx0XHR1bml0cy5yZW0gPSB1bml0cy5lbTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNob29zZUxvd1JlcyggbG93ZXJWYWx1ZSwgaGlnaGVyVmFsdWUsIGRwclZhbHVlLCBpc0NhY2hlZCApIHtcblx0XHR2YXIgYm9udXNGYWN0b3IsIHRvb011Y2gsIGJvbnVzLCBtZWFuRGVuc2l0eTtcblxuXHRcdC8vZXhwZXJpbWVudGFsXG5cdFx0aWYgKGNmZy5hbGdvcml0aG0gPT09IFwic2F2ZURhdGFcIiApe1xuXHRcdFx0aWYgKCBsb3dlclZhbHVlID4gMi43ICkge1xuXHRcdFx0XHRtZWFuRGVuc2l0eSA9IGRwclZhbHVlICsgMTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRvb011Y2ggPSBoaWdoZXJWYWx1ZSAtIGRwclZhbHVlO1xuXHRcdFx0XHRib251c0ZhY3RvciA9IE1hdGgucG93KGxvd2VyVmFsdWUgLSAwLjYsIDEuNSk7XG5cblx0XHRcdFx0Ym9udXMgPSB0b29NdWNoICogYm9udXNGYWN0b3I7XG5cblx0XHRcdFx0aWYgKGlzQ2FjaGVkKSB7XG5cdFx0XHRcdFx0Ym9udXMgKz0gMC4xICogYm9udXNGYWN0b3I7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRtZWFuRGVuc2l0eSA9IGxvd2VyVmFsdWUgKyBib251cztcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bWVhbkRlbnNpdHkgPSAoZHByVmFsdWUgPiAxKSA/XG5cdFx0XHRcdE1hdGguc3FydChsb3dlclZhbHVlICogaGlnaGVyVmFsdWUpIDpcblx0XHRcdFx0bG93ZXJWYWx1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbWVhbkRlbnNpdHkgPiBkcHJWYWx1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFwcGx5QmVzdENhbmRpZGF0ZSggaW1nICkge1xuXHRcdHZhciBzcmNTZXRDYW5kaWRhdGVzO1xuXHRcdHZhciBtYXRjaGluZ1NldCA9IHBmLmdldFNldCggaW1nICk7XG5cdFx0dmFyIGV2YWx1YXRlZCA9IGZhbHNlO1xuXHRcdGlmICggbWF0Y2hpbmdTZXQgIT09IFwicGVuZGluZ1wiICkge1xuXHRcdFx0ZXZhbHVhdGVkID0gZXZhbElkO1xuXHRcdFx0aWYgKCBtYXRjaGluZ1NldCApIHtcblx0XHRcdFx0c3JjU2V0Q2FuZGlkYXRlcyA9IHBmLnNldFJlcyggbWF0Y2hpbmdTZXQgKTtcblx0XHRcdFx0cGYuYXBwbHlTZXRDYW5kaWRhdGUoIHNyY1NldENhbmRpZGF0ZXMsIGltZyApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpbWdbIHBmLm5zIF0uZXZhbGVkID0gZXZhbHVhdGVkO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXNjZW5kaW5nU29ydCggYSwgYiApIHtcblx0XHRyZXR1cm4gYS5yZXMgLSBiLnJlcztcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFNyY1RvQ3VyKCBpbWcsIHNyYywgc2V0ICkge1xuXHRcdHZhciBjYW5kaWRhdGU7XG5cdFx0aWYgKCAhc2V0ICYmIHNyYyApIHtcblx0XHRcdHNldCA9IGltZ1sgcGYubnMgXS5zZXRzO1xuXHRcdFx0c2V0ID0gc2V0ICYmIHNldFtzZXQubGVuZ3RoIC0gMV07XG5cdFx0fVxuXG5cdFx0Y2FuZGlkYXRlID0gZ2V0Q2FuZGlkYXRlRm9yU3JjKHNyYywgc2V0KTtcblxuXHRcdGlmICggY2FuZGlkYXRlICkge1xuXHRcdFx0c3JjID0gcGYubWFrZVVybChzcmMpO1xuXHRcdFx0aW1nWyBwZi5ucyBdLmN1clNyYyA9IHNyYztcblx0XHRcdGltZ1sgcGYubnMgXS5jdXJDYW4gPSBjYW5kaWRhdGU7XG5cblx0XHRcdGlmICggIWNhbmRpZGF0ZS5yZXMgKSB7XG5cdFx0XHRcdHNldFJlc29sdXRpb24oIGNhbmRpZGF0ZSwgY2FuZGlkYXRlLnNldC5zaXplcyApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gY2FuZGlkYXRlO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0Q2FuZGlkYXRlRm9yU3JjKCBzcmMsIHNldCApIHtcblx0XHR2YXIgaSwgY2FuZGlkYXRlLCBjYW5kaWRhdGVzO1xuXHRcdGlmICggc3JjICYmIHNldCApIHtcblx0XHRcdGNhbmRpZGF0ZXMgPSBwZi5wYXJzZVNldCggc2V0ICk7XG5cdFx0XHRzcmMgPSBwZi5tYWtlVXJsKHNyYyk7XG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IGNhbmRpZGF0ZXMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGlmICggc3JjID09PSBwZi5tYWtlVXJsKGNhbmRpZGF0ZXNbIGkgXS51cmwpICkge1xuXHRcdFx0XHRcdGNhbmRpZGF0ZSA9IGNhbmRpZGF0ZXNbIGkgXTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gY2FuZGlkYXRlO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0QWxsU291cmNlRWxlbWVudHMoIHBpY3R1cmUsIGNhbmRpZGF0ZXMgKSB7XG5cdFx0dmFyIGksIGxlbiwgc291cmNlLCBzcmNzZXQ7XG5cblx0XHQvLyBTUEVDIG1pc21hdGNoIGludGVuZGVkIGZvciBzaXplIGFuZCBwZXJmOlxuXHRcdC8vIGFjdHVhbGx5IG9ubHkgc291cmNlIGVsZW1lbnRzIHByZWNlZGluZyB0aGUgaW1nIHNob3VsZCBiZSB1c2VkXG5cdFx0Ly8gYWxzbyBub3RlOiBkb24ndCB1c2UgcXNhIGhlcmUsIGJlY2F1c2UgSUU4IHNvbWV0aW1lcyBkb2Vzbid0IGxpa2Ugc291cmNlIGFzIHRoZSBrZXkgcGFydCBpbiBhIHNlbGVjdG9yXG5cdFx0dmFyIHNvdXJjZXMgPSBwaWN0dXJlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCBcInNvdXJjZVwiICk7XG5cblx0XHRmb3IgKCBpID0gMCwgbGVuID0gc291cmNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdHNvdXJjZSA9IHNvdXJjZXNbIGkgXTtcblx0XHRcdHNvdXJjZVsgcGYubnMgXSA9IHRydWU7XG5cdFx0XHRzcmNzZXQgPSBzb3VyY2UuZ2V0QXR0cmlidXRlKCBcInNyY3NldFwiICk7XG5cblx0XHRcdC8vIGlmIHNvdXJjZSBkb2VzIG5vdCBoYXZlIGEgc3Jjc2V0IGF0dHJpYnV0ZSwgc2tpcFxuXHRcdFx0aWYgKCBzcmNzZXQgKSB7XG5cdFx0XHRcdGNhbmRpZGF0ZXMucHVzaCgge1xuXHRcdFx0XHRcdHNyY3NldDogc3Jjc2V0LFxuXHRcdFx0XHRcdG1lZGlhOiBzb3VyY2UuZ2V0QXR0cmlidXRlKCBcIm1lZGlhXCIgKSxcblx0XHRcdFx0XHR0eXBlOiBzb3VyY2UuZ2V0QXR0cmlidXRlKCBcInR5cGVcIiApLFxuXHRcdFx0XHRcdHNpemVzOiBzb3VyY2UuZ2V0QXR0cmlidXRlKCBcInNpemVzXCIgKVxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNyY3NldCBQYXJzZXJcblx0ICogQnkgQWxleCBCZWxsIHwgIE1JVCBMaWNlbnNlXG5cdCAqXG5cdCAqIEByZXR1cm5zIEFycmF5IFt7dXJsOiBfLCBkOiBfLCB3OiBfLCBoOl8sIHNldDpfKD8/Pz8pfSwgLi4uXVxuXHQgKlxuXHQgKiBCYXNlZCBzdXBlciBkdXBlciBjbG9zZWx5IG9uIHRoZSByZWZlcmVuY2UgYWxnb3JpdGhtIGF0OlxuXHQgKiBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9lbWJlZGRlZC1jb250ZW50Lmh0bWwjcGFyc2UtYS1zcmNzZXQtYXR0cmlidXRlXG5cdCAqL1xuXG5cdC8vIDEuIExldCBpbnB1dCBiZSB0aGUgdmFsdWUgcGFzc2VkIHRvIHRoaXMgYWxnb3JpdGhtLlxuXHQvLyAoVE8tRE8gOiBFeHBsYWluIHdoYXQgXCJzZXRcIiBhcmd1bWVudCBpcyBoZXJlLiBNYXliZSBjaG9vc2UgYSBtb3JlXG5cdC8vIGRlc2NyaXB0aXZlICYgbW9yZSBzZWFyY2hhYmxlIG5hbWUuICBTaW5jZSBwYXNzaW5nIHRoZSBcInNldFwiIGluIHJlYWxseSBoYXNcblx0Ly8gbm90aGluZyB0byBkbyB3aXRoIHBhcnNpbmcgcHJvcGVyLCBJIHdvdWxkIHByZWZlciB0aGlzIGFzc2lnbm1lbnQgZXZlbnR1YWxseVxuXHQvLyBnbyBpbiBhbiBleHRlcm5hbCBmbi4pXG5cdGZ1bmN0aW9uIHBhcnNlU3Jjc2V0KGlucHV0LCBzZXQpIHtcblxuXHRcdGZ1bmN0aW9uIGNvbGxlY3RDaGFyYWN0ZXJzKHJlZ0V4KSB7XG5cdFx0XHR2YXIgY2hhcnMsXG5cdFx0XHQgICAgbWF0Y2ggPSByZWdFeC5leGVjKGlucHV0LnN1YnN0cmluZyhwb3MpKTtcblx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHRjaGFycyA9IG1hdGNoWyAwIF07XG5cdFx0XHRcdHBvcyArPSBjaGFycy5sZW5ndGg7XG5cdFx0XHRcdHJldHVybiBjaGFycztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgaW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGgsXG5cdFx0ICAgIHVybCxcblx0XHQgICAgZGVzY3JpcHRvcnMsXG5cdFx0ICAgIGN1cnJlbnREZXNjcmlwdG9yLFxuXHRcdCAgICBzdGF0ZSxcblx0XHQgICAgYyxcblxuXHRcdCAgICAvLyAyLiBMZXQgcG9zaXRpb24gYmUgYSBwb2ludGVyIGludG8gaW5wdXQsIGluaXRpYWxseSBwb2ludGluZyBhdCB0aGUgc3RhcnRcblx0XHQgICAgLy8gICAgb2YgdGhlIHN0cmluZy5cblx0XHQgICAgcG9zID0gMCxcblxuXHRcdCAgICAvLyAzLiBMZXQgY2FuZGlkYXRlcyBiZSBhbiBpbml0aWFsbHkgZW1wdHkgc291cmNlIHNldC5cblx0XHQgICAgY2FuZGlkYXRlcyA9IFtdO1xuXG5cdFx0LyoqXG5cdFx0KiBBZGRzIGRlc2NyaXB0b3IgcHJvcGVydGllcyB0byBhIGNhbmRpZGF0ZSwgcHVzaGVzIHRvIHRoZSBjYW5kaWRhdGVzIGFycmF5XG5cdFx0KiBAcmV0dXJuIHVuZGVmaW5lZFxuXHRcdCovXG5cdFx0Ly8gKERlY2xhcmVkIG91dHNpZGUgb2YgdGhlIHdoaWxlIGxvb3Agc28gdGhhdCBpdCdzIG9ubHkgY3JlYXRlZCBvbmNlLlxuXHRcdC8vIChUaGlzIGZuIGlzIGRlZmluZWQgYmVmb3JlIGl0IGlzIHVzZWQsIGluIG9yZGVyIHRvIHBhc3MgSlNISU5ULlxuXHRcdC8vIFVuZm9ydHVuYXRlbHkgdGhpcyBicmVha3MgdGhlIHNlcXVlbmNpbmcgb2YgdGhlIHNwZWMgY29tbWVudHMuIDovIClcblx0XHRmdW5jdGlvbiBwYXJzZURlc2NyaXB0b3JzKCkge1xuXG5cdFx0XHQvLyA5LiBEZXNjcmlwdG9yIHBhcnNlcjogTGV0IGVycm9yIGJlIG5vLlxuXHRcdFx0dmFyIHBFcnJvciA9IGZhbHNlLFxuXG5cdFx0XHQvLyAxMC4gTGV0IHdpZHRoIGJlIGFic2VudC5cblx0XHRcdC8vIDExLiBMZXQgZGVuc2l0eSBiZSBhYnNlbnQuXG5cdFx0XHQvLyAxMi4gTGV0IGZ1dHVyZS1jb21wYXQtaCBiZSBhYnNlbnQuIChXZSdyZSBpbXBsZW1lbnRpbmcgaXQgbm93IGFzIGgpXG5cdFx0XHQgICAgdywgZCwgaCwgaSxcblx0XHRcdCAgICBjYW5kaWRhdGUgPSB7fSxcblx0XHRcdCAgICBkZXNjLCBsYXN0Q2hhciwgdmFsdWUsIGludFZhbCwgZmxvYXRWYWw7XG5cblx0XHRcdC8vIDEzLiBGb3IgZWFjaCBkZXNjcmlwdG9yIGluIGRlc2NyaXB0b3JzLCBydW4gdGhlIGFwcHJvcHJpYXRlIHNldCBvZiBzdGVwc1xuXHRcdFx0Ly8gZnJvbSB0aGUgZm9sbG93aW5nIGxpc3Q6XG5cdFx0XHRmb3IgKGkgPSAwIDsgaSA8IGRlc2NyaXB0b3JzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGRlc2MgPSBkZXNjcmlwdG9yc1sgaSBdO1xuXG5cdFx0XHRcdGxhc3RDaGFyID0gZGVzY1sgZGVzYy5sZW5ndGggLSAxIF07XG5cdFx0XHRcdHZhbHVlID0gZGVzYy5zdWJzdHJpbmcoMCwgZGVzYy5sZW5ndGggLSAxKTtcblx0XHRcdFx0aW50VmFsID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcblx0XHRcdFx0ZmxvYXRWYWwgPSBwYXJzZUZsb2F0KHZhbHVlKTtcblxuXHRcdFx0XHQvLyBJZiB0aGUgZGVzY3JpcHRvciBjb25zaXN0cyBvZiBhIHZhbGlkIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyIGZvbGxvd2VkIGJ5XG5cdFx0XHRcdC8vIGEgVSswMDc3IExBVElOIFNNQUxMIExFVFRFUiBXIGNoYXJhY3RlclxuXHRcdFx0XHRpZiAocmVnZXhOb25OZWdhdGl2ZUludGVnZXIudGVzdCh2YWx1ZSkgJiYgKGxhc3RDaGFyID09PSBcIndcIikpIHtcblxuXHRcdFx0XHRcdC8vIElmIHdpZHRoIGFuZCBkZW5zaXR5IGFyZSBub3QgYm90aCBhYnNlbnQsIHRoZW4gbGV0IGVycm9yIGJlIHllcy5cblx0XHRcdFx0XHRpZiAodyB8fCBkKSB7cEVycm9yID0gdHJ1ZTt9XG5cblx0XHRcdFx0XHQvLyBBcHBseSB0aGUgcnVsZXMgZm9yIHBhcnNpbmcgbm9uLW5lZ2F0aXZlIGludGVnZXJzIHRvIHRoZSBkZXNjcmlwdG9yLlxuXHRcdFx0XHRcdC8vIElmIHRoZSByZXN1bHQgaXMgemVybywgbGV0IGVycm9yIGJlIHllcy5cblx0XHRcdFx0XHQvLyBPdGhlcndpc2UsIGxldCB3aWR0aCBiZSB0aGUgcmVzdWx0LlxuXHRcdFx0XHRcdGlmIChpbnRWYWwgPT09IDApIHtwRXJyb3IgPSB0cnVlO30gZWxzZSB7dyA9IGludFZhbDt9XG5cblx0XHRcdFx0Ly8gSWYgdGhlIGRlc2NyaXB0b3IgY29uc2lzdHMgb2YgYSB2YWxpZCBmbG9hdGluZy1wb2ludCBudW1iZXIgZm9sbG93ZWQgYnlcblx0XHRcdFx0Ly8gYSBVKzAwNzggTEFUSU4gU01BTEwgTEVUVEVSIFggY2hhcmFjdGVyXG5cdFx0XHRcdH0gZWxzZSBpZiAocmVnZXhGbG9hdGluZ1BvaW50LnRlc3QodmFsdWUpICYmIChsYXN0Q2hhciA9PT0gXCJ4XCIpKSB7XG5cblx0XHRcdFx0XHQvLyBJZiB3aWR0aCwgZGVuc2l0eSBhbmQgZnV0dXJlLWNvbXBhdC1oIGFyZSBub3QgYWxsIGFic2VudCwgdGhlbiBsZXQgZXJyb3Jcblx0XHRcdFx0XHQvLyBiZSB5ZXMuXG5cdFx0XHRcdFx0aWYgKHcgfHwgZCB8fCBoKSB7cEVycm9yID0gdHJ1ZTt9XG5cblx0XHRcdFx0XHQvLyBBcHBseSB0aGUgcnVsZXMgZm9yIHBhcnNpbmcgZmxvYXRpbmctcG9pbnQgbnVtYmVyIHZhbHVlcyB0byB0aGUgZGVzY3JpcHRvci5cblx0XHRcdFx0XHQvLyBJZiB0aGUgcmVzdWx0IGlzIGxlc3MgdGhhbiB6ZXJvLCBsZXQgZXJyb3IgYmUgeWVzLiBPdGhlcndpc2UsIGxldCBkZW5zaXR5XG5cdFx0XHRcdFx0Ly8gYmUgdGhlIHJlc3VsdC5cblx0XHRcdFx0XHRpZiAoZmxvYXRWYWwgPCAwKSB7cEVycm9yID0gdHJ1ZTt9IGVsc2Uge2QgPSBmbG9hdFZhbDt9XG5cblx0XHRcdFx0Ly8gSWYgdGhlIGRlc2NyaXB0b3IgY29uc2lzdHMgb2YgYSB2YWxpZCBub24tbmVnYXRpdmUgaW50ZWdlciBmb2xsb3dlZCBieVxuXHRcdFx0XHQvLyBhIFUrMDA2OCBMQVRJTiBTTUFMTCBMRVRURVIgSCBjaGFyYWN0ZXJcblx0XHRcdFx0fSBlbHNlIGlmIChyZWdleE5vbk5lZ2F0aXZlSW50ZWdlci50ZXN0KHZhbHVlKSAmJiAobGFzdENoYXIgPT09IFwiaFwiKSkge1xuXG5cdFx0XHRcdFx0Ly8gSWYgaGVpZ2h0IGFuZCBkZW5zaXR5IGFyZSBub3QgYm90aCBhYnNlbnQsIHRoZW4gbGV0IGVycm9yIGJlIHllcy5cblx0XHRcdFx0XHRpZiAoaCB8fCBkKSB7cEVycm9yID0gdHJ1ZTt9XG5cblx0XHRcdFx0XHQvLyBBcHBseSB0aGUgcnVsZXMgZm9yIHBhcnNpbmcgbm9uLW5lZ2F0aXZlIGludGVnZXJzIHRvIHRoZSBkZXNjcmlwdG9yLlxuXHRcdFx0XHRcdC8vIElmIHRoZSByZXN1bHQgaXMgemVybywgbGV0IGVycm9yIGJlIHllcy4gT3RoZXJ3aXNlLCBsZXQgZnV0dXJlLWNvbXBhdC1oXG5cdFx0XHRcdFx0Ly8gYmUgdGhlIHJlc3VsdC5cblx0XHRcdFx0XHRpZiAoaW50VmFsID09PSAwKSB7cEVycm9yID0gdHJ1ZTt9IGVsc2Uge2ggPSBpbnRWYWw7fVxuXG5cdFx0XHRcdC8vIEFueXRoaW5nIGVsc2UsIExldCBlcnJvciBiZSB5ZXMuXG5cdFx0XHRcdH0gZWxzZSB7cEVycm9yID0gdHJ1ZTt9XG5cdFx0XHR9IC8vIChjbG9zZSBzdGVwIDEzIGZvciBsb29wKVxuXG5cdFx0XHQvLyAxNS4gSWYgZXJyb3IgaXMgc3RpbGwgbm8sIHRoZW4gYXBwZW5kIGEgbmV3IGltYWdlIHNvdXJjZSB0byBjYW5kaWRhdGVzIHdob3NlXG5cdFx0XHQvLyBVUkwgaXMgdXJsLCBhc3NvY2lhdGVkIHdpdGggYSB3aWR0aCB3aWR0aCBpZiBub3QgYWJzZW50IGFuZCBhIHBpeGVsXG5cdFx0XHQvLyBkZW5zaXR5IGRlbnNpdHkgaWYgbm90IGFic2VudC4gT3RoZXJ3aXNlLCB0aGVyZSBpcyBhIHBhcnNlIGVycm9yLlxuXHRcdFx0aWYgKCFwRXJyb3IpIHtcblx0XHRcdFx0Y2FuZGlkYXRlLnVybCA9IHVybDtcblxuXHRcdFx0XHRpZiAodykgeyBjYW5kaWRhdGUudyA9IHc7fVxuXHRcdFx0XHRpZiAoZCkgeyBjYW5kaWRhdGUuZCA9IGQ7fVxuXHRcdFx0XHRpZiAoaCkgeyBjYW5kaWRhdGUuaCA9IGg7fVxuXHRcdFx0XHRpZiAoIWggJiYgIWQgJiYgIXcpIHtjYW5kaWRhdGUuZCA9IDE7fVxuXHRcdFx0XHRpZiAoY2FuZGlkYXRlLmQgPT09IDEpIHtzZXQuaGFzMXggPSB0cnVlO31cblx0XHRcdFx0Y2FuZGlkYXRlLnNldCA9IHNldDtcblxuXHRcdFx0XHRjYW5kaWRhdGVzLnB1c2goY2FuZGlkYXRlKTtcblx0XHRcdH1cblx0XHR9IC8vIChjbG9zZSBwYXJzZURlc2NyaXB0b3JzIGZuKVxuXG5cdFx0LyoqXG5cdFx0KiBUb2tlbml6ZXMgZGVzY3JpcHRvciBwcm9wZXJ0aWVzIHByaW9yIHRvIHBhcnNpbmdcblx0XHQqIFJldHVybnMgdW5kZWZpbmVkLlxuXHRcdCogKEFnYWluLCB0aGlzIGZuIGlzIGRlZmluZWQgYmVmb3JlIGl0IGlzIHVzZWQsIGluIG9yZGVyIHRvIHBhc3MgSlNISU5ULlxuXHRcdCogVW5mb3J0dW5hdGVseSB0aGlzIGJyZWFrcyB0aGUgbG9naWNhbCBzZXF1ZW5jaW5nIG9mIHRoZSBzcGVjIGNvbW1lbnRzLiA6LyApXG5cdFx0Ki9cblx0XHRmdW5jdGlvbiB0b2tlbml6ZSgpIHtcblxuXHRcdFx0Ly8gOC4xLiBEZXNjcmlwdG9yIHRva2VuaXNlcjogU2tpcCB3aGl0ZXNwYWNlXG5cdFx0XHRjb2xsZWN0Q2hhcmFjdGVycyhyZWdleExlYWRpbmdTcGFjZXMpO1xuXG5cdFx0XHQvLyA4LjIuIExldCBjdXJyZW50IGRlc2NyaXB0b3IgYmUgdGhlIGVtcHR5IHN0cmluZy5cblx0XHRcdGN1cnJlbnREZXNjcmlwdG9yID0gXCJcIjtcblxuXHRcdFx0Ly8gOC4zLiBMZXQgc3RhdGUgYmUgaW4gZGVzY3JpcHRvci5cblx0XHRcdHN0YXRlID0gXCJpbiBkZXNjcmlwdG9yXCI7XG5cblx0XHRcdHdoaWxlICh0cnVlKSB7XG5cblx0XHRcdFx0Ly8gOC40LiBMZXQgYyBiZSB0aGUgY2hhcmFjdGVyIGF0IHBvc2l0aW9uLlxuXHRcdFx0XHRjID0gaW5wdXQuY2hhckF0KHBvcyk7XG5cblx0XHRcdFx0Ly8gIERvIHRoZSBmb2xsb3dpbmcgZGVwZW5kaW5nIG9uIHRoZSB2YWx1ZSBvZiBzdGF0ZS5cblx0XHRcdFx0Ly8gIEZvciB0aGUgcHVycG9zZSBvZiB0aGlzIHN0ZXAsIFwiRU9GXCIgaXMgYSBzcGVjaWFsIGNoYXJhY3RlciByZXByZXNlbnRpbmdcblx0XHRcdFx0Ly8gIHRoYXQgcG9zaXRpb24gaXMgcGFzdCB0aGUgZW5kIG9mIGlucHV0LlxuXG5cdFx0XHRcdC8vIEluIGRlc2NyaXB0b3Jcblx0XHRcdFx0aWYgKHN0YXRlID09PSBcImluIGRlc2NyaXB0b3JcIikge1xuXHRcdFx0XHRcdC8vIERvIHRoZSBmb2xsb3dpbmcsIGRlcGVuZGluZyBvbiB0aGUgdmFsdWUgb2YgYzpcblxuXHRcdFx0XHQgIC8vIFNwYWNlIGNoYXJhY3RlclxuXHRcdFx0XHQgIC8vIElmIGN1cnJlbnQgZGVzY3JpcHRvciBpcyBub3QgZW1wdHksIGFwcGVuZCBjdXJyZW50IGRlc2NyaXB0b3IgdG9cblx0XHRcdFx0ICAvLyBkZXNjcmlwdG9ycyBhbmQgbGV0IGN1cnJlbnQgZGVzY3JpcHRvciBiZSB0aGUgZW1wdHkgc3RyaW5nLlxuXHRcdFx0XHQgIC8vIFNldCBzdGF0ZSB0byBhZnRlciBkZXNjcmlwdG9yLlxuXHRcdFx0XHRcdGlmIChpc1NwYWNlKGMpKSB7XG5cdFx0XHRcdFx0XHRpZiAoY3VycmVudERlc2NyaXB0b3IpIHtcblx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRvcnMucHVzaChjdXJyZW50RGVzY3JpcHRvcik7XG5cdFx0XHRcdFx0XHRcdGN1cnJlbnREZXNjcmlwdG9yID0gXCJcIjtcblx0XHRcdFx0XHRcdFx0c3RhdGUgPSBcImFmdGVyIGRlc2NyaXB0b3JcIjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFUrMDAyQyBDT01NQSAoLClcblx0XHRcdFx0XHQvLyBBZHZhbmNlIHBvc2l0aW9uIHRvIHRoZSBuZXh0IGNoYXJhY3RlciBpbiBpbnB1dC4gSWYgY3VycmVudCBkZXNjcmlwdG9yXG5cdFx0XHRcdFx0Ly8gaXMgbm90IGVtcHR5LCBhcHBlbmQgY3VycmVudCBkZXNjcmlwdG9yIHRvIGRlc2NyaXB0b3JzLiBKdW1wIHRvIHRoZSBzdGVwXG5cdFx0XHRcdFx0Ly8gbGFiZWxlZCBkZXNjcmlwdG9yIHBhcnNlci5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGMgPT09IFwiLFwiKSB7XG5cdFx0XHRcdFx0XHRwb3MgKz0gMTtcblx0XHRcdFx0XHRcdGlmIChjdXJyZW50RGVzY3JpcHRvcikge1xuXHRcdFx0XHRcdFx0XHRkZXNjcmlwdG9ycy5wdXNoKGN1cnJlbnREZXNjcmlwdG9yKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHBhcnNlRGVzY3JpcHRvcnMoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblxuXHRcdFx0XHRcdC8vIFUrMDAyOCBMRUZUIFBBUkVOVEhFU0lTICgoKVxuXHRcdFx0XHRcdC8vIEFwcGVuZCBjIHRvIGN1cnJlbnQgZGVzY3JpcHRvci4gU2V0IHN0YXRlIHRvIGluIHBhcmVucy5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGMgPT09IFwiXFx1MDAyOFwiKSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50RGVzY3JpcHRvciA9IGN1cnJlbnREZXNjcmlwdG9yICsgYztcblx0XHRcdFx0XHRcdHN0YXRlID0gXCJpbiBwYXJlbnNcIjtcblxuXHRcdFx0XHRcdC8vIEVPRlxuXHRcdFx0XHRcdC8vIElmIGN1cnJlbnQgZGVzY3JpcHRvciBpcyBub3QgZW1wdHksIGFwcGVuZCBjdXJyZW50IGRlc2NyaXB0b3IgdG9cblx0XHRcdFx0XHQvLyBkZXNjcmlwdG9ycy4gSnVtcCB0byB0aGUgc3RlcCBsYWJlbGVkIGRlc2NyaXB0b3IgcGFyc2VyLlxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYyA9PT0gXCJcIikge1xuXHRcdFx0XHRcdFx0aWYgKGN1cnJlbnREZXNjcmlwdG9yKSB7XG5cdFx0XHRcdFx0XHRcdGRlc2NyaXB0b3JzLnB1c2goY3VycmVudERlc2NyaXB0b3IpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cGFyc2VEZXNjcmlwdG9ycygpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRcdFx0Ly8gQW55dGhpbmcgZWxzZVxuXHRcdFx0XHRcdC8vIEFwcGVuZCBjIHRvIGN1cnJlbnQgZGVzY3JpcHRvci5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y3VycmVudERlc2NyaXB0b3IgPSBjdXJyZW50RGVzY3JpcHRvciArIGM7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQvLyAoZW5kIFwiaW4gZGVzY3JpcHRvclwiXG5cblx0XHRcdFx0Ly8gSW4gcGFyZW5zXG5cdFx0XHRcdH0gZWxzZSBpZiAoc3RhdGUgPT09IFwiaW4gcGFyZW5zXCIpIHtcblxuXHRcdFx0XHRcdC8vIFUrMDAyOSBSSUdIVCBQQVJFTlRIRVNJUyAoKSlcblx0XHRcdFx0XHQvLyBBcHBlbmQgYyB0byBjdXJyZW50IGRlc2NyaXB0b3IuIFNldCBzdGF0ZSB0byBpbiBkZXNjcmlwdG9yLlxuXHRcdFx0XHRcdGlmIChjID09PSBcIilcIikge1xuXHRcdFx0XHRcdFx0Y3VycmVudERlc2NyaXB0b3IgPSBjdXJyZW50RGVzY3JpcHRvciArIGM7XG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFwiaW4gZGVzY3JpcHRvclwiO1xuXG5cdFx0XHRcdFx0Ly8gRU9GXG5cdFx0XHRcdFx0Ly8gQXBwZW5kIGN1cnJlbnQgZGVzY3JpcHRvciB0byBkZXNjcmlwdG9ycy4gSnVtcCB0byB0aGUgc3RlcCBsYWJlbGVkXG5cdFx0XHRcdFx0Ly8gZGVzY3JpcHRvciBwYXJzZXIuXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChjID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRkZXNjcmlwdG9ycy5wdXNoKGN1cnJlbnREZXNjcmlwdG9yKTtcblx0XHRcdFx0XHRcdHBhcnNlRGVzY3JpcHRvcnMoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblxuXHRcdFx0XHRcdC8vIEFueXRoaW5nIGVsc2Vcblx0XHRcdFx0XHQvLyBBcHBlbmQgYyB0byBjdXJyZW50IGRlc2NyaXB0b3IuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGN1cnJlbnREZXNjcmlwdG9yID0gY3VycmVudERlc2NyaXB0b3IgKyBjO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBBZnRlciBkZXNjcmlwdG9yXG5cdFx0XHRcdH0gZWxzZSBpZiAoc3RhdGUgPT09IFwiYWZ0ZXIgZGVzY3JpcHRvclwiKSB7XG5cblx0XHRcdFx0XHQvLyBEbyB0aGUgZm9sbG93aW5nLCBkZXBlbmRpbmcgb24gdGhlIHZhbHVlIG9mIGM6XG5cdFx0XHRcdFx0Ly8gU3BhY2UgY2hhcmFjdGVyOiBTdGF5IGluIHRoaXMgc3RhdGUuXG5cdFx0XHRcdFx0aWYgKGlzU3BhY2UoYykpIHtcblxuXHRcdFx0XHRcdC8vIEVPRjogSnVtcCB0byB0aGUgc3RlcCBsYWJlbGVkIGRlc2NyaXB0b3IgcGFyc2VyLlxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYyA9PT0gXCJcIikge1xuXHRcdFx0XHRcdFx0cGFyc2VEZXNjcmlwdG9ycygpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRcdFx0Ly8gQW55dGhpbmcgZWxzZVxuXHRcdFx0XHRcdC8vIFNldCBzdGF0ZSB0byBpbiBkZXNjcmlwdG9yLiBTZXQgcG9zaXRpb24gdG8gdGhlIHByZXZpb3VzIGNoYXJhY3RlciBpbiBpbnB1dC5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3RhdGUgPSBcImluIGRlc2NyaXB0b3JcIjtcblx0XHRcdFx0XHRcdHBvcyAtPSAxO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQWR2YW5jZSBwb3NpdGlvbiB0byB0aGUgbmV4dCBjaGFyYWN0ZXIgaW4gaW5wdXQuXG5cdFx0XHRcdHBvcyArPSAxO1xuXG5cdFx0XHQvLyBSZXBlYXQgdGhpcyBzdGVwLlxuXHRcdFx0fSAvLyAoY2xvc2Ugd2hpbGUgdHJ1ZSBsb29wKVxuXHRcdH1cblxuXHRcdC8vIDQuIFNwbGl0dGluZyBsb29wOiBDb2xsZWN0IGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyB0aGF0IGFyZSBzcGFjZVxuXHRcdC8vICAgIGNoYXJhY3RlcnMgb3IgVSswMDJDIENPTU1BIGNoYXJhY3RlcnMuIElmIGFueSBVKzAwMkMgQ09NTUEgY2hhcmFjdGVyc1xuXHRcdC8vICAgIHdlcmUgY29sbGVjdGVkLCB0aGF0IGlzIGEgcGFyc2UgZXJyb3IuXG5cdFx0d2hpbGUgKHRydWUpIHtcblx0XHRcdGNvbGxlY3RDaGFyYWN0ZXJzKHJlZ2V4TGVhZGluZ0NvbW1hc09yU3BhY2VzKTtcblxuXHRcdFx0Ly8gNS4gSWYgcG9zaXRpb24gaXMgcGFzdCB0aGUgZW5kIG9mIGlucHV0LCByZXR1cm4gY2FuZGlkYXRlcyBhbmQgYWJvcnQgdGhlc2Ugc3RlcHMuXG5cdFx0XHRpZiAocG9zID49IGlucHV0TGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiBjYW5kaWRhdGVzOyAvLyAod2UncmUgZG9uZSwgdGhpcyBpcyB0aGUgc29sZSByZXR1cm4gcGF0aClcblx0XHRcdH1cblxuXHRcdFx0Ly8gNi4gQ29sbGVjdCBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgdGhhdCBhcmUgbm90IHNwYWNlIGNoYXJhY3RlcnMsXG5cdFx0XHQvLyAgICBhbmQgbGV0IHRoYXQgYmUgdXJsLlxuXHRcdFx0dXJsID0gY29sbGVjdENoYXJhY3RlcnMocmVnZXhMZWFkaW5nTm90U3BhY2VzKTtcblxuXHRcdFx0Ly8gNy4gTGV0IGRlc2NyaXB0b3JzIGJlIGEgbmV3IGVtcHR5IGxpc3QuXG5cdFx0XHRkZXNjcmlwdG9ycyA9IFtdO1xuXG5cdFx0XHQvLyA4LiBJZiB1cmwgZW5kcyB3aXRoIGEgVSswMDJDIENPTU1BIGNoYXJhY3RlciAoLCksIGZvbGxvdyB0aGVzZSBzdWJzdGVwczpcblx0XHRcdC8vXHRcdCgxKS4gUmVtb3ZlIGFsbCB0cmFpbGluZyBVKzAwMkMgQ09NTUEgY2hhcmFjdGVycyBmcm9tIHVybC4gSWYgdGhpcyByZW1vdmVkXG5cdFx0XHQvLyAgICAgICAgIG1vcmUgdGhhbiBvbmUgY2hhcmFjdGVyLCB0aGF0IGlzIGEgcGFyc2UgZXJyb3IuXG5cdFx0XHRpZiAodXJsLnNsaWNlKC0xKSA9PT0gXCIsXCIpIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UocmVnZXhUcmFpbGluZ0NvbW1hcywgXCJcIik7XG5cdFx0XHRcdC8vIChKdW1wIGFoZWFkIHRvIHN0ZXAgOSB0byBza2lwIHRva2VuaXphdGlvbiBhbmQganVzdCBwdXNoIHRoZSBjYW5kaWRhdGUpLlxuXHRcdFx0XHRwYXJzZURlc2NyaXB0b3JzKCk7XG5cblx0XHRcdC8vXHRPdGhlcndpc2UsIGZvbGxvdyB0aGVzZSBzdWJzdGVwczpcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRva2VuaXplKCk7XG5cdFx0XHR9IC8vIChjbG9zZSBlbHNlIG9mIHN0ZXAgOClcblxuXHRcdC8vIDE2LiBSZXR1cm4gdG8gdGhlIHN0ZXAgbGFiZWxlZCBzcGxpdHRpbmcgbG9vcC5cblx0XHR9IC8vIChDbG9zZSBvZiBiaWcgd2hpbGUgbG9vcC4pXG5cdH1cblxuXHQvKlxuXHQgKiBTaXplcyBQYXJzZXJcblx0ICpcblx0ICogQnkgQWxleCBCZWxsIHwgIE1JVCBMaWNlbnNlXG5cdCAqXG5cdCAqIE5vbi1zdHJpY3QgYnV0IGFjY3VyYXRlIGFuZCBsaWdodHdlaWdodCBKUyBQYXJzZXIgZm9yIHRoZSBzdHJpbmcgdmFsdWUgPGltZyBzaXplcz1cImhlcmVcIj5cblx0ICpcblx0ICogUmVmZXJlbmNlIGFsZ29yaXRobSBhdDpcblx0ICogaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZW1iZWRkZWQtY29udGVudC5odG1sI3BhcnNlLWEtc2l6ZXMtYXR0cmlidXRlXG5cdCAqXG5cdCAqIE1vc3QgY29tbWVudHMgYXJlIGNvcGllZCBpbiBkaXJlY3RseSBmcm9tIHRoZSBzcGVjXG5cdCAqIChleGNlcHQgZm9yIGNvbW1lbnRzIGluIHBhcmVucykuXG5cdCAqXG5cdCAqIEdyYW1tYXIgaXM6XG5cdCAqIDxzb3VyY2Utc2l6ZS1saXN0PiA9IDxzb3VyY2Utc2l6ZT4jIFsgLCA8c291cmNlLXNpemUtdmFsdWU+IF0/IHwgPHNvdXJjZS1zaXplLXZhbHVlPlxuXHQgKiA8c291cmNlLXNpemU+ID0gPG1lZGlhLWNvbmRpdGlvbj4gPHNvdXJjZS1zaXplLXZhbHVlPlxuXHQgKiA8c291cmNlLXNpemUtdmFsdWU+ID0gPGxlbmd0aD5cblx0ICogaHR0cDovL3d3dy53My5vcmcvaHRtbC93Zy9kcmFmdHMvaHRtbC9tYXN0ZXIvZW1iZWRkZWQtY29udGVudC5odG1sI2F0dHItaW1nLXNpemVzXG5cdCAqXG5cdCAqIEUuZy4gXCIobWF4LXdpZHRoOiAzMGVtKSAxMDB2dywgKG1heC13aWR0aDogNTBlbSkgNzB2dywgMTAwdndcIlxuXHQgKiBvciBcIihtaW4td2lkdGg6IDMwZW0pLCBjYWxjKDMwdncgLSAxNXB4KVwiIG9yIGp1c3QgXCIzMHZ3XCJcblx0ICpcblx0ICogUmV0dXJucyB0aGUgZmlyc3QgdmFsaWQgPGNzcy1sZW5ndGg+IHdpdGggYSBtZWRpYSBjb25kaXRpb24gdGhhdCBldmFsdWF0ZXMgdG8gdHJ1ZSxcblx0ICogb3IgXCIxMDB2d1wiIGlmIGFsbCB2YWxpZCBtZWRpYSBjb25kaXRpb25zIGV2YWx1YXRlIHRvIGZhbHNlLlxuXHQgKlxuXHQgKi9cblxuXHRmdW5jdGlvbiBwYXJzZVNpemVzKHN0clZhbHVlKSB7XG5cblx0XHQvLyAoUGVyY2VudGFnZSBDU1MgbGVuZ3RocyBhcmUgbm90IGFsbG93ZWQgaW4gdGhpcyBjYXNlLCB0byBhdm9pZCBjb25mdXNpb246XG5cdFx0Ly8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZW1iZWRkZWQtY29udGVudC5odG1sI3ZhbGlkLXNvdXJjZS1zaXplLWxpc3Rcblx0XHQvLyBDU1MgYWxsb3dzIGEgc2luZ2xlIG9wdGlvbmFsIHBsdXMgb3IgbWludXMgc2lnbjpcblx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9DU1MyL3N5bmRhdGEuaHRtbCNudW1iZXJzXG5cdFx0Ly8gQ1NTIGlzIEFTQ0lJIGNhc2UtaW5zZW5zaXRpdmU6XG5cdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvQ1NTMi9zeW5kYXRhLmh0bWwjY2hhcmFjdGVycyApXG5cdFx0Ly8gU3BlYyBhbGxvd3MgZXhwb25lbnRpYWwgbm90YXRpb24gZm9yIDxudW1iZXI+IHR5cGU6XG5cdFx0Ly8gaHR0cDovL2Rldi53My5vcmcvY3Nzd2cvY3NzLXZhbHVlcy8jbnVtYmVyc1xuXHRcdHZhciByZWdleENzc0xlbmd0aFdpdGhVbml0cyA9IC9eKD86WystXT9bMC05XSt8WzAtOV0qXFwuWzAtOV0rKSg/OltlRV1bKy1dP1swLTldKyk/KD86Y2h8Y218ZW18ZXh8aW58bW18cGN8cHR8cHh8cmVtfHZofHZtaW58dm1heHx2dykkL2k7XG5cblx0XHQvLyAoVGhpcyBpcyBhIHF1aWNrIGFuZCBsZW5pZW50IHRlc3QuIEJlY2F1c2Ugb2Ygb3B0aW9uYWwgdW5saW1pdGVkLWRlcHRoIGludGVybmFsXG5cdFx0Ly8gZ3JvdXBpbmcgcGFyZW5zIGFuZCBzdHJpY3Qgc3BhY2luZyBydWxlcywgdGhpcyBjb3VsZCBnZXQgdmVyeSBjb21wbGljYXRlZC4pXG5cdFx0dmFyIHJlZ2V4Q3NzQ2FsYyA9IC9eY2FsY1xcKCg/OlswLTlhLXogXFwuXFwrXFwtXFwqXFwvXFwoXFwpXSspXFwpJC9pO1xuXG5cdFx0dmFyIGk7XG5cdFx0dmFyIHVucGFyc2VkU2l6ZXNMaXN0O1xuXHRcdHZhciB1bnBhcnNlZFNpemVzTGlzdExlbmd0aDtcblx0XHR2YXIgdW5wYXJzZWRTaXplO1xuXHRcdHZhciBsYXN0Q29tcG9uZW50VmFsdWU7XG5cdFx0dmFyIHNpemU7XG5cblx0XHQvLyBVVElMSVRZIEZVTkNUSU9OU1xuXG5cdFx0Ly8gIChUb3kgQ1NTIHBhcnNlci4gVGhlIGdvYWxzIGhlcmUgYXJlOlxuXHRcdC8vICAxKSBleHBhbnNpdmUgdGVzdCBjb3ZlcmFnZSB3aXRob3V0IHRoZSB3ZWlnaHQgb2YgYSBmdWxsIENTUyBwYXJzZXIuXG5cdFx0Ly8gIDIpIEF2b2lkaW5nIHJlZ2V4IHdoZXJldmVyIGNvbnZlbmllbnQuXG5cdFx0Ly8gIFF1aWNrIHRlc3RzOiBodHRwOi8vanNmaWRkbGUubmV0L2d0bnRMNGdyLzMvXG5cdFx0Ly8gIFJldHVybnMgYW4gYXJyYXkgb2YgYXJyYXlzLilcblx0XHRmdW5jdGlvbiBwYXJzZUNvbXBvbmVudFZhbHVlcyhzdHIpIHtcblx0XHRcdHZhciBjaHJjdHI7XG5cdFx0XHR2YXIgY29tcG9uZW50ID0gXCJcIjtcblx0XHRcdHZhciBjb21wb25lbnRBcnJheSA9IFtdO1xuXHRcdFx0dmFyIGxpc3RBcnJheSA9IFtdO1xuXHRcdFx0dmFyIHBhcmVuRGVwdGggPSAwO1xuXHRcdFx0dmFyIHBvcyA9IDA7XG5cdFx0XHR2YXIgaW5Db21tZW50ID0gZmFsc2U7XG5cblx0XHRcdGZ1bmN0aW9uIHB1c2hDb21wb25lbnQoKSB7XG5cdFx0XHRcdGlmIChjb21wb25lbnQpIHtcblx0XHRcdFx0XHRjb21wb25lbnRBcnJheS5wdXNoKGNvbXBvbmVudCk7XG5cdFx0XHRcdFx0Y29tcG9uZW50ID0gXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBwdXNoQ29tcG9uZW50QXJyYXkoKSB7XG5cdFx0XHRcdGlmIChjb21wb25lbnRBcnJheVswXSkge1xuXHRcdFx0XHRcdGxpc3RBcnJheS5wdXNoKGNvbXBvbmVudEFycmF5KTtcblx0XHRcdFx0XHRjb21wb25lbnRBcnJheSA9IFtdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIChMb29wIGZvcndhcmRzIGZyb20gdGhlIGJlZ2lubmluZyBvZiB0aGUgc3RyaW5nLilcblx0XHRcdHdoaWxlICh0cnVlKSB7XG5cdFx0XHRcdGNocmN0ciA9IHN0ci5jaGFyQXQocG9zKTtcblxuXHRcdFx0XHRpZiAoY2hyY3RyID09PSBcIlwiKSB7IC8vICggRW5kIG9mIHN0cmluZyByZWFjaGVkLilcblx0XHRcdFx0XHRwdXNoQ29tcG9uZW50KCk7XG5cdFx0XHRcdFx0cHVzaENvbXBvbmVudEFycmF5KCk7XG5cdFx0XHRcdFx0cmV0dXJuIGxpc3RBcnJheTtcblx0XHRcdFx0fSBlbHNlIGlmIChpbkNvbW1lbnQpIHtcblx0XHRcdFx0XHRpZiAoKGNocmN0ciA9PT0gXCIqXCIpICYmIChzdHJbcG9zICsgMV0gPT09IFwiL1wiKSkgeyAvLyAoQXQgZW5kIG9mIGEgY29tbWVudC4pXG5cdFx0XHRcdFx0XHRpbkNvbW1lbnQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHBvcyArPSAyO1xuXHRcdFx0XHRcdFx0cHVzaENvbXBvbmVudCgpO1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBvcyArPSAxOyAvLyAoU2tpcCBhbGwgY2hhcmFjdGVycyBpbnNpZGUgY29tbWVudHMuKVxuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKGlzU3BhY2UoY2hyY3RyKSkge1xuXHRcdFx0XHRcdC8vIChJZiBwcmV2aW91cyBjaGFyYWN0ZXIgaW4gbG9vcCB3YXMgYWxzbyBhIHNwYWNlLCBvciBpZlxuXHRcdFx0XHRcdC8vIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHN0cmluZywgZG8gbm90IGFkZCBzcGFjZSBjaGFyIHRvXG5cdFx0XHRcdFx0Ly8gY29tcG9uZW50Lilcblx0XHRcdFx0XHRpZiAoIChzdHIuY2hhckF0KHBvcyAtIDEpICYmIGlzU3BhY2UoIHN0ci5jaGFyQXQocG9zIC0gMSkgKSApIHx8ICFjb21wb25lbnQgKSB7XG5cdFx0XHRcdFx0XHRwb3MgKz0gMTtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocGFyZW5EZXB0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0cHVzaENvbXBvbmVudCgpO1xuXHRcdFx0XHRcdFx0cG9zICs9MTtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyAoUmVwbGFjZSBhbnkgc3BhY2UgY2hhcmFjdGVyIHdpdGggYSBwbGFpbiBzcGFjZSBmb3IgbGVnaWJpbGl0eS4pXG5cdFx0XHRcdFx0XHRjaHJjdHIgPSBcIiBcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoY2hyY3RyID09PSBcIihcIikge1xuXHRcdFx0XHRcdHBhcmVuRGVwdGggKz0gMTtcblx0XHRcdFx0fSBlbHNlIGlmIChjaHJjdHIgPT09IFwiKVwiKSB7XG5cdFx0XHRcdFx0cGFyZW5EZXB0aCAtPSAxO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNocmN0ciA9PT0gXCIsXCIpIHtcblx0XHRcdFx0XHRwdXNoQ29tcG9uZW50KCk7XG5cdFx0XHRcdFx0cHVzaENvbXBvbmVudEFycmF5KCk7XG5cdFx0XHRcdFx0cG9zICs9IDE7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIChjaHJjdHIgPT09IFwiL1wiKSAmJiAoc3RyLmNoYXJBdChwb3MgKyAxKSA9PT0gXCIqXCIpICkge1xuXHRcdFx0XHRcdGluQ29tbWVudCA9IHRydWU7XG5cdFx0XHRcdFx0cG9zICs9IDI7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb21wb25lbnQgPSBjb21wb25lbnQgKyBjaHJjdHI7XG5cdFx0XHRcdHBvcyArPSAxO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGlzVmFsaWROb25OZWdhdGl2ZVNvdXJjZVNpemVWYWx1ZShzKSB7XG5cdFx0XHRpZiAocmVnZXhDc3NMZW5ndGhXaXRoVW5pdHMudGVzdChzKSAmJiAocGFyc2VGbG9hdChzKSA+PSAwKSkge3JldHVybiB0cnVlO31cblx0XHRcdGlmIChyZWdleENzc0NhbGMudGVzdChzKSkge3JldHVybiB0cnVlO31cblx0XHRcdC8vICggaHR0cDovL3d3dy53My5vcmcvVFIvQ1NTMi9zeW5kYXRhLmh0bWwjbnVtYmVycyBzYXlzOlxuXHRcdFx0Ly8gXCItMCBpcyBlcXVpdmFsZW50IHRvIDAgYW5kIGlzIG5vdCBhIG5lZ2F0aXZlIG51bWJlci5cIiB3aGljaCBtZWFucyB0aGF0XG5cdFx0XHQvLyB1bml0bGVzcyB6ZXJvIGFuZCB1bml0bGVzcyBuZWdhdGl2ZSB6ZXJvIG11c3QgYmUgYWNjZXB0ZWQgYXMgc3BlY2lhbCBjYXNlcy4pXG5cdFx0XHRpZiAoKHMgPT09IFwiMFwiKSB8fCAocyA9PT0gXCItMFwiKSB8fCAocyA9PT0gXCIrMFwiKSkge3JldHVybiB0cnVlO31cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBXaGVuIGFza2VkIHRvIHBhcnNlIGEgc2l6ZXMgYXR0cmlidXRlIGZyb20gYW4gZWxlbWVudCwgcGFyc2UgYVxuXHRcdC8vIGNvbW1hLXNlcGFyYXRlZCBsaXN0IG9mIGNvbXBvbmVudCB2YWx1ZXMgZnJvbSB0aGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQnc1xuXHRcdC8vIHNpemVzIGF0dHJpYnV0ZSAob3IgdGhlIGVtcHR5IHN0cmluZywgaWYgdGhlIGF0dHJpYnV0ZSBpcyBhYnNlbnQpLCBhbmQgbGV0XG5cdFx0Ly8gdW5wYXJzZWQgc2l6ZXMgbGlzdCBiZSB0aGUgcmVzdWx0LlxuXHRcdC8vIGh0dHA6Ly9kZXYudzMub3JnL2Nzc3dnL2Nzcy1zeW50YXgvI3BhcnNlLWNvbW1hLXNlcGFyYXRlZC1saXN0LW9mLWNvbXBvbmVudC12YWx1ZXNcblxuXHRcdHVucGFyc2VkU2l6ZXNMaXN0ID0gcGFyc2VDb21wb25lbnRWYWx1ZXMoc3RyVmFsdWUpO1xuXHRcdHVucGFyc2VkU2l6ZXNMaXN0TGVuZ3RoID0gdW5wYXJzZWRTaXplc0xpc3QubGVuZ3RoO1xuXG5cdFx0Ly8gRm9yIGVhY2ggdW5wYXJzZWQgc2l6ZSBpbiB1bnBhcnNlZCBzaXplcyBsaXN0OlxuXHRcdGZvciAoaSA9IDA7IGkgPCB1bnBhcnNlZFNpemVzTGlzdExlbmd0aDsgaSsrKSB7XG5cdFx0XHR1bnBhcnNlZFNpemUgPSB1bnBhcnNlZFNpemVzTGlzdFtpXTtcblxuXHRcdFx0Ly8gMS4gUmVtb3ZlIGFsbCBjb25zZWN1dGl2ZSA8d2hpdGVzcGFjZS10b2tlbj5zIGZyb20gdGhlIGVuZCBvZiB1bnBhcnNlZCBzaXplLlxuXHRcdFx0Ly8gKCBwYXJzZUNvbXBvbmVudFZhbHVlcygpIGFscmVhZHkgb21pdHMgc3BhY2VzIG91dHNpZGUgb2YgcGFyZW5zLiApXG5cblx0XHRcdC8vIElmIHVucGFyc2VkIHNpemUgaXMgbm93IGVtcHR5LCB0aGF0IGlzIGEgcGFyc2UgZXJyb3I7IGNvbnRpbnVlIHRvIHRoZSBuZXh0XG5cdFx0XHQvLyBpdGVyYXRpb24gb2YgdGhpcyBhbGdvcml0aG0uXG5cdFx0XHQvLyAoIHBhcnNlQ29tcG9uZW50VmFsdWVzKCkgd29uJ3QgcHVzaCBhbiBlbXB0eSBhcnJheS4gKVxuXG5cdFx0XHQvLyAyLiBJZiB0aGUgbGFzdCBjb21wb25lbnQgdmFsdWUgaW4gdW5wYXJzZWQgc2l6ZSBpcyBhIHZhbGlkIG5vbi1uZWdhdGl2ZVxuXHRcdFx0Ly8gPHNvdXJjZS1zaXplLXZhbHVlPiwgbGV0IHNpemUgYmUgaXRzIHZhbHVlIGFuZCByZW1vdmUgdGhlIGNvbXBvbmVudCB2YWx1ZVxuXHRcdFx0Ly8gZnJvbSB1bnBhcnNlZCBzaXplLiBBbnkgQ1NTIGZ1bmN0aW9uIG90aGVyIHRoYW4gdGhlIGNhbGMoKSBmdW5jdGlvbiBpc1xuXHRcdFx0Ly8gaW52YWxpZC4gT3RoZXJ3aXNlLCB0aGVyZSBpcyBhIHBhcnNlIGVycm9yOyBjb250aW51ZSB0byB0aGUgbmV4dCBpdGVyYXRpb25cblx0XHRcdC8vIG9mIHRoaXMgYWxnb3JpdGhtLlxuXHRcdFx0Ly8gaHR0cDovL2Rldi53My5vcmcvY3Nzd2cvY3NzLXN5bnRheC8jcGFyc2UtY29tcG9uZW50LXZhbHVlXG5cdFx0XHRsYXN0Q29tcG9uZW50VmFsdWUgPSB1bnBhcnNlZFNpemVbdW5wYXJzZWRTaXplLmxlbmd0aCAtIDFdO1xuXG5cdFx0XHRpZiAoaXNWYWxpZE5vbk5lZ2F0aXZlU291cmNlU2l6ZVZhbHVlKGxhc3RDb21wb25lbnRWYWx1ZSkpIHtcblx0XHRcdFx0c2l6ZSA9IGxhc3RDb21wb25lbnRWYWx1ZTtcblx0XHRcdFx0dW5wYXJzZWRTaXplLnBvcCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIDMuIFJlbW92ZSBhbGwgY29uc2VjdXRpdmUgPHdoaXRlc3BhY2UtdG9rZW4+cyBmcm9tIHRoZSBlbmQgb2YgdW5wYXJzZWRcblx0XHRcdC8vIHNpemUuIElmIHVucGFyc2VkIHNpemUgaXMgbm93IGVtcHR5LCByZXR1cm4gc2l6ZSBhbmQgZXhpdCB0aGlzIGFsZ29yaXRobS5cblx0XHRcdC8vIElmIHRoaXMgd2FzIG5vdCB0aGUgbGFzdCBpdGVtIGluIHVucGFyc2VkIHNpemVzIGxpc3QsIHRoYXQgaXMgYSBwYXJzZSBlcnJvci5cblx0XHRcdGlmICh1bnBhcnNlZFNpemUubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiBzaXplO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyA0LiBQYXJzZSB0aGUgcmVtYWluaW5nIGNvbXBvbmVudCB2YWx1ZXMgaW4gdW5wYXJzZWQgc2l6ZSBhcyBhXG5cdFx0XHQvLyA8bWVkaWEtY29uZGl0aW9uPi4gSWYgaXQgZG9lcyBub3QgcGFyc2UgY29ycmVjdGx5LCBvciBpdCBkb2VzIHBhcnNlXG5cdFx0XHQvLyBjb3JyZWN0bHkgYnV0IHRoZSA8bWVkaWEtY29uZGl0aW9uPiBldmFsdWF0ZXMgdG8gZmFsc2UsIGNvbnRpbnVlIHRvIHRoZVxuXHRcdFx0Ly8gbmV4dCBpdGVyYXRpb24gb2YgdGhpcyBhbGdvcml0aG0uXG5cdFx0XHQvLyAoUGFyc2luZyBhbGwgcG9zc2libGUgY29tcG91bmQgbWVkaWEgY29uZGl0aW9ucyBpbiBKUyBpcyBoZWF2eSwgY29tcGxpY2F0ZWQsXG5cdFx0XHQvLyBhbmQgdGhlIHBheW9mZiBpcyB1bmNsZWFyLiBJcyB0aGVyZSBldmVyIGFuIHNpdHVhdGlvbiB3aGVyZSB0aGVcblx0XHRcdC8vIG1lZGlhIGNvbmRpdGlvbiBwYXJzZXMgaW5jb3JyZWN0bHkgYnV0IHN0aWxsIHNvbWVob3cgZXZhbHVhdGVzIHRvIHRydWU/XG5cdFx0XHQvLyBDYW4gd2UganVzdCByZWx5IG9uIHRoZSBicm93c2VyL3BvbHlmaWxsIHRvIGRvIGl0Pylcblx0XHRcdHVucGFyc2VkU2l6ZSA9IHVucGFyc2VkU2l6ZS5qb2luKFwiIFwiKTtcblx0XHRcdGlmICghKHBmLm1hdGNoZXNNZWRpYSggdW5wYXJzZWRTaXplICkgKSApIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIDUuIFJldHVybiBzaXplIGFuZCBleGl0IHRoaXMgYWxnb3JpdGhtLlxuXHRcdFx0cmV0dXJuIHNpemU7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlIGFib3ZlIGFsZ29yaXRobSBleGhhdXN0cyB1bnBhcnNlZCBzaXplcyBsaXN0IHdpdGhvdXQgcmV0dXJuaW5nIGFcblx0XHQvLyBzaXplIHZhbHVlLCByZXR1cm4gMTAwdncuXG5cdFx0cmV0dXJuIFwiMTAwdndcIjtcblx0fVxuXG5cdC8vIG5hbWVzcGFjZVxuXHRwZi5ucyA9IChcInBmXCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSkuc3Vic3RyKDAsIDkpO1xuXG5cdC8vIHNyY3NldCBzdXBwb3J0IHRlc3Rcblx0cGYuc3VwU3Jjc2V0ID0gXCJzcmNzZXRcIiBpbiBpbWFnZTtcblx0cGYuc3VwU2l6ZXMgPSBcInNpemVzXCIgaW4gaW1hZ2U7XG5cdHBmLnN1cFBpY3R1cmUgPSAhIXdpbmRvdy5IVE1MUGljdHVyZUVsZW1lbnQ7XG5cblx0Ly8gVUMgYnJvd3NlciBkb2VzIGNsYWltIHRvIHN1cHBvcnQgc3Jjc2V0IGFuZCBwaWN0dXJlLCBidXQgbm90IHNpemVzLFxuXHQvLyB0aGlzIGV4dGVuZGVkIHRlc3QgcmV2ZWFscyB0aGUgYnJvd3NlciBkb2VzIHN1cHBvcnQgbm90aGluZ1xuXHRpZiAocGYuc3VwU3Jjc2V0ICYmIHBmLnN1cFBpY3R1cmUgJiYgIXBmLnN1cFNpemVzKSB7XG5cdFx0KGZ1bmN0aW9uKGltYWdlMikge1xuXHRcdFx0aW1hZ2Uuc3Jjc2V0ID0gXCJkYXRhOixhXCI7XG5cdFx0XHRpbWFnZTIuc3JjID0gXCJkYXRhOixhXCI7XG5cdFx0XHRwZi5zdXBTcmNzZXQgPSBpbWFnZS5jb21wbGV0ZSA9PT0gaW1hZ2UyLmNvbXBsZXRlO1xuXHRcdFx0cGYuc3VwUGljdHVyZSA9IHBmLnN1cFNyY3NldCAmJiBwZi5zdXBQaWN0dXJlO1xuXHRcdH0pKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIikpO1xuXHR9XG5cblx0Ly8gU2FmYXJpOSBoYXMgYmFzaWMgc3VwcG9ydCBmb3Igc2l6ZXMsIGJ1dCBkb2VzJ3QgZXhwb3NlIHRoZSBgc2l6ZXNgIGlkbCBhdHRyaWJ1dGVcblx0aWYgKHBmLnN1cFNyY3NldCAmJiAhcGYuc3VwU2l6ZXMpIHtcblxuXHRcdChmdW5jdGlvbigpIHtcblx0XHRcdHZhciB3aWR0aDIgPSBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFnQUJBUEFBQVAvLy93QUFBQ0g1QkFBQUFBQUFMQUFBQUFBQ0FBRUFBQUlDQkFvQU93PT1cIjtcblx0XHRcdHZhciB3aWR0aDEgPSBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBQUFBQUNINUJBRUtBQUVBTEFBQUFBQUJBQUVBQUFJQ1RBRUFPdz09XCI7XG5cdFx0XHR2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblx0XHRcdHZhciB0ZXN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciB3aWR0aCA9IGltZy53aWR0aDtcblxuXHRcdFx0XHRpZiAod2lkdGggPT09IDIpIHtcblx0XHRcdFx0XHRwZi5zdXBTaXplcyA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhbHdheXNDaGVja1dEZXNjcmlwdG9yID0gcGYuc3VwU3Jjc2V0ICYmICFwZi5zdXBTaXplcztcblxuXHRcdFx0XHRpc1N1cHBvcnRUZXN0UmVhZHkgPSB0cnVlO1xuXHRcdFx0XHQvLyBmb3JjZSBhc3luY1xuXHRcdFx0XHRzZXRUaW1lb3V0KHBpY3R1cmVmaWxsKTtcblx0XHRcdH07XG5cblx0XHRcdGltZy5vbmxvYWQgPSB0ZXN0O1xuXHRcdFx0aW1nLm9uZXJyb3IgPSB0ZXN0O1xuXHRcdFx0aW1nLnNldEF0dHJpYnV0ZShcInNpemVzXCIsIFwiOXB4XCIpO1xuXG5cdFx0XHRpbWcuc3Jjc2V0ID0gd2lkdGgxICsgXCIgMXcsXCIgKyB3aWR0aDIgKyBcIiA5d1wiO1xuXHRcdFx0aW1nLnNyYyA9IHdpZHRoMTtcblx0XHR9KSgpO1xuXG5cdH0gZWxzZSB7XG5cdFx0aXNTdXBwb3J0VGVzdFJlYWR5ID0gdHJ1ZTtcblx0fVxuXG5cdC8vIHVzaW5nIHBmLnFzYSBpbnN0ZWFkIG9mIGRvbSB0cmF2ZXJzaW5nIGRvZXMgc2NhbGUgbXVjaCBiZXR0ZXIsXG5cdC8vIGVzcGVjaWFsbHkgb24gc2l0ZXMgbWl4aW5nIHJlc3BvbnNpdmUgYW5kIG5vbi1yZXNwb25zaXZlIGltYWdlc1xuXHRwZi5zZWxTaG9ydCA9IFwicGljdHVyZT5pbWcsaW1nW3NyY3NldF1cIjtcblx0cGYuc2VsID0gcGYuc2VsU2hvcnQ7XG5cdHBmLmNmZyA9IGNmZztcblxuXHQvKipcblx0ICogU2hvcnRjdXQgcHJvcGVydHkgZm9yIGBkZXZpY2VQaXhlbFJhdGlvYCAoIGZvciBlYXN5IG92ZXJyaWRpbmcgaW4gdGVzdHMgKVxuXHQgKi9cblx0cGYuRFBSID0gKERQUiAgfHwgMSApO1xuXHRwZi51ID0gdW5pdHM7XG5cblx0Ly8gY29udGFpbmVyIG9mIHN1cHBvcnRlZCBtaW1lIHR5cGVzIHRoYXQgb25lIG1pZ2h0IG5lZWQgdG8gcXVhbGlmeSBiZWZvcmUgdXNpbmdcblx0cGYudHlwZXMgPSAgdHlwZXM7XG5cblx0cGYuc2V0U2l6ZSA9IG5vb3A7XG5cblx0LyoqXG5cdCAqIEdldHMgYSBzdHJpbmcgYW5kIHJldHVybnMgdGhlIGFic29sdXRlIFVSTFxuXHQgKiBAcGFyYW0gc3JjXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IGFic29sdXRlIFVSTFxuXHQgKi9cblxuXHRwZi5tYWtlVXJsID0gbWVtb2l6ZShmdW5jdGlvbihzcmMpIHtcblx0XHRhbmNob3IuaHJlZiA9IHNyYztcblx0XHRyZXR1cm4gYW5jaG9yLmhyZWY7XG5cdH0pO1xuXG5cdC8qKlxuXHQgKiBHZXRzIGEgRE9NIGVsZW1lbnQgb3IgZG9jdW1lbnQgYW5kIGEgc2VsY3RvciBhbmQgcmV0dXJucyB0aGUgZm91bmQgbWF0Y2hlc1xuXHQgKiBDYW4gYmUgZXh0ZW5kZWQgd2l0aCBqUXVlcnkvU2l6emxlIGZvciBJRTcgc3VwcG9ydFxuXHQgKiBAcGFyYW0gY29udGV4dFxuXHQgKiBAcGFyYW0gc2VsXG5cdCAqIEByZXR1cm5zIHtOb2RlTGlzdHxBcnJheX1cblx0ICovXG5cdHBmLnFzYSA9IGZ1bmN0aW9uKGNvbnRleHQsIHNlbCkge1xuXHRcdHJldHVybiAoIFwicXVlcnlTZWxlY3RvclwiIGluIGNvbnRleHQgKSA/IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWwpIDogW107XG5cdH07XG5cblx0LyoqXG5cdCAqIFNob3J0Y3V0IG1ldGhvZCBmb3IgbWF0Y2hNZWRpYSAoIGZvciBlYXN5IG92ZXJyaWRpbmcgaW4gdGVzdHMgKVxuXHQgKiB3ZXRoZXIgbmF0aXZlIG9yIHBmLm1NUSBpcyB1c2VkIHdpbGwgYmUgZGVjaWRlZCBsYXp5IG9uIGZpcnN0IGNhbGxcblx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdCAqL1xuXHRwZi5tYXRjaGVzTWVkaWEgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIHdpbmRvdy5tYXRjaE1lZGlhICYmIChtYXRjaE1lZGlhKCBcIihtaW4td2lkdGg6IDAuMWVtKVwiICkgfHwge30pLm1hdGNoZXMgKSB7XG5cdFx0XHRwZi5tYXRjaGVzTWVkaWEgPSBmdW5jdGlvbiggbWVkaWEgKSB7XG5cdFx0XHRcdHJldHVybiAhbWVkaWEgfHwgKCBtYXRjaE1lZGlhKCBtZWRpYSApLm1hdGNoZXMgKTtcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBmLm1hdGNoZXNNZWRpYSA9IHBmLm1NUTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGYubWF0Y2hlc01lZGlhLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblx0fTtcblxuXHQvKipcblx0ICogQSBzaW1wbGlmaWVkIG1hdGNoTWVkaWEgaW1wbGVtZW50YXRpb24gZm9yIElFOCBhbmQgSUU5XG5cdCAqIGhhbmRsZXMgb25seSBtaW4td2lkdGgvbWF4LXdpZHRoIHdpdGggcHggb3IgZW0gdmFsdWVzXG5cdCAqIEBwYXJhbSBtZWRpYVxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0ICovXG5cdHBmLm1NUSA9IGZ1bmN0aW9uKCBtZWRpYSApIHtcblx0XHRyZXR1cm4gbWVkaWEgPyBldmFsQ1NTKG1lZGlhKSA6IHRydWU7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGNhbGN1bGF0ZWQgbGVuZ3RoIGluIGNzcyBwaXhlbCBmcm9tIHRoZSBnaXZlbiBzb3VyY2VTaXplVmFsdWVcblx0ICogaHR0cDovL2Rldi53My5vcmcvY3Nzd2cvY3NzLXZhbHVlcy0zLyNsZW5ndGgtdmFsdWVcblx0ICogaW50ZW5kZWQgU3BlYyBtaXNtYXRjaGVzOlxuXHQgKiAqIERvZXMgbm90IGNoZWNrIGZvciBpbnZhbGlkIHVzZSBvZiBDU1MgZnVuY3Rpb25zXG5cdCAqICogRG9lcyBoYW5kbGUgYSBjb21wdXRlZCBsZW5ndGggb2YgMCB0aGUgc2FtZSBhcyBhIG5lZ2F0aXZlIGFuZCB0aGVyZWZvcmUgaW52YWxpZCB2YWx1ZVxuXHQgKiBAcGFyYW0gc291cmNlU2l6ZVZhbHVlXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9XG5cdCAqL1xuXHRwZi5jYWxjTGVuZ3RoID0gZnVuY3Rpb24oIHNvdXJjZVNpemVWYWx1ZSApIHtcblxuXHRcdHZhciB2YWx1ZSA9IGV2YWxDU1Moc291cmNlU2l6ZVZhbHVlLCB0cnVlKSB8fCBmYWxzZTtcblx0XHRpZiAodmFsdWUgPCAwKSB7XG5cdFx0XHR2YWx1ZSA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YWx1ZTtcblx0fTtcblxuXHQvKipcblx0ICogVGFrZXMgYSB0eXBlIHN0cmluZyBhbmQgY2hlY2tzIGlmIGl0cyBzdXBwb3J0ZWRcblx0ICovXG5cblx0cGYuc3VwcG9ydHNUeXBlID0gZnVuY3Rpb24oIHR5cGUgKSB7XG5cdFx0cmV0dXJuICggdHlwZSApID8gdHlwZXNbIHR5cGUgXSA6IHRydWU7XG5cdH07XG5cblx0LyoqXG5cdCAqIFBhcnNlcyBhIHNvdXJjZVNpemUgaW50byBtZWRpYUNvbmRpdGlvbiAobWVkaWEpIGFuZCBzb3VyY2VTaXplVmFsdWUgKGxlbmd0aClcblx0ICogQHBhcmFtIHNvdXJjZVNpemVTdHJcblx0ICogQHJldHVybnMgeyp9XG5cdCAqL1xuXHRwZi5wYXJzZVNpemUgPSBtZW1vaXplKGZ1bmN0aW9uKCBzb3VyY2VTaXplU3RyICkge1xuXHRcdHZhciBtYXRjaCA9ICggc291cmNlU2l6ZVN0ciB8fCBcIlwiICkubWF0Y2gocmVnU2l6ZSk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG1lZGlhOiBtYXRjaCAmJiBtYXRjaFsxXSxcblx0XHRcdGxlbmd0aDogbWF0Y2ggJiYgbWF0Y2hbMl1cblx0XHR9O1xuXHR9KTtcblxuXHRwZi5wYXJzZVNldCA9IGZ1bmN0aW9uKCBzZXQgKSB7XG5cdFx0aWYgKCAhc2V0LmNhbmRzICkge1xuXHRcdFx0c2V0LmNhbmRzID0gcGFyc2VTcmNzZXQoc2V0LnNyY3NldCwgc2V0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHNldC5jYW5kcztcblx0fTtcblxuXHQvKipcblx0ICogcmV0dXJucyAxZW0gaW4gY3NzIHB4IGZvciBodG1sL2JvZHkgZGVmYXVsdCBzaXplXG5cdCAqIGZ1bmN0aW9uIHRha2VuIGZyb20gcmVzcG9uZGpzXG5cdCAqIEByZXR1cm5zIHsqfG51bWJlcn1cblx0ICovXG5cdHBmLmdldEVtVmFsdWUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgYm9keTtcblx0XHRpZiAoICFlbWlucHggJiYgKGJvZHkgPSBkb2N1bWVudC5ib2R5KSApIHtcblx0XHRcdHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICksXG5cdFx0XHRcdG9yaWdpbmFsSFRNTENTUyA9IGRvY0VsZW0uc3R5bGUuY3NzVGV4dCxcblx0XHRcdFx0b3JpZ2luYWxCb2R5Q1NTID0gYm9keS5zdHlsZS5jc3NUZXh0O1xuXG5cdFx0XHRkaXYuc3R5bGUuY3NzVGV4dCA9IGJhc2VTdHlsZTtcblxuXHRcdFx0Ly8gMWVtIGluIGEgbWVkaWEgcXVlcnkgaXMgdGhlIHZhbHVlIG9mIHRoZSBkZWZhdWx0IGZvbnQgc2l6ZSBvZiB0aGUgYnJvd3NlclxuXHRcdFx0Ly8gcmVzZXQgZG9jRWxlbSBhbmQgYm9keSB0byBlbnN1cmUgdGhlIGNvcnJlY3QgdmFsdWUgaXMgcmV0dXJuZWRcblx0XHRcdGRvY0VsZW0uc3R5bGUuY3NzVGV4dCA9IGZzQ3NzO1xuXHRcdFx0Ym9keS5zdHlsZS5jc3NUZXh0ID0gZnNDc3M7XG5cblx0XHRcdGJvZHkuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXHRcdFx0ZW1pbnB4ID0gZGl2Lm9mZnNldFdpZHRoO1xuXHRcdFx0Ym9keS5yZW1vdmVDaGlsZCggZGl2ICk7XG5cblx0XHRcdC8vYWxzbyB1cGRhdGUgZW1pbnB4IGJlZm9yZSByZXR1cm5pbmdcblx0XHRcdGVtaW5weCA9IHBhcnNlRmxvYXQoIGVtaW5weCwgMTAgKTtcblxuXHRcdFx0Ly8gcmVzdG9yZSB0aGUgb3JpZ2luYWwgdmFsdWVzXG5cdFx0XHRkb2NFbGVtLnN0eWxlLmNzc1RleHQgPSBvcmlnaW5hbEhUTUxDU1M7XG5cdFx0XHRib2R5LnN0eWxlLmNzc1RleHQgPSBvcmlnaW5hbEJvZHlDU1M7XG5cblx0XHR9XG5cdFx0cmV0dXJuIGVtaW5weCB8fCAxNjtcblx0fTtcblxuXHQvKipcblx0ICogVGFrZXMgYSBzdHJpbmcgb2Ygc2l6ZXMgYW5kIHJldHVybnMgdGhlIHdpZHRoIGluIHBpeGVscyBhcyBhIG51bWJlclxuXHQgKi9cblx0cGYuY2FsY0xpc3RMZW5ndGggPSBmdW5jdGlvbiggc291cmNlU2l6ZUxpc3RTdHIgKSB7XG5cdFx0Ly8gU3BsaXQgdXAgc291cmNlIHNpemUgbGlzdCwgaWUgKCBtYXgtd2lkdGg6IDMwZW0gKSAxMDAlLCAoIG1heC13aWR0aDogNTBlbSApIDUwJSwgMzMlXG5cdFx0Ly9cblx0XHQvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yIChtaW4td2lkdGg6MzBlbSkgY2FsYygzMCUgLSAxNXB4KVxuXHRcdGlmICggIShzb3VyY2VTaXplTGlzdFN0ciBpbiBzaXplTGVuZ3RoQ2FjaGUpIHx8IGNmZy51VCApIHtcblx0XHRcdHZhciB3aW5uaW5nTGVuZ3RoID0gcGYuY2FsY0xlbmd0aCggcGFyc2VTaXplcyggc291cmNlU2l6ZUxpc3RTdHIgKSApO1xuXG5cdFx0XHRzaXplTGVuZ3RoQ2FjaGVbIHNvdXJjZVNpemVMaXN0U3RyIF0gPSAhd2lubmluZ0xlbmd0aCA/IHVuaXRzLndpZHRoIDogd2lubmluZ0xlbmd0aDtcblx0XHR9XG5cblx0XHRyZXR1cm4gc2l6ZUxlbmd0aENhY2hlWyBzb3VyY2VTaXplTGlzdFN0ciBdO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBUYWtlcyBhIGNhbmRpZGF0ZSBvYmplY3Qgd2l0aCBhIHNyY3NldCBwcm9wZXJ0eSBpbiB0aGUgZm9ybSBvZiB1cmwvXG5cdCAqIGV4LiBcImltYWdlcy9waWMtbWVkaXVtLnBuZyAxeCwgaW1hZ2VzL3BpYy1tZWRpdW0tMngucG5nIDJ4XCIgb3Jcblx0ICogICAgIFwiaW1hZ2VzL3BpYy1tZWRpdW0ucG5nIDQwMHcsIGltYWdlcy9waWMtbWVkaXVtLTJ4LnBuZyA4MDB3XCIgb3Jcblx0ICogICAgIFwiaW1hZ2VzL3BpYy1zbWFsbC5wbmdcIlxuXHQgKiBHZXQgYW4gYXJyYXkgb2YgaW1hZ2UgY2FuZGlkYXRlcyBpbiB0aGUgZm9ybSBvZlxuXHQgKiAgICAgIHt1cmw6IFwiL2Zvby9iYXIucG5nXCIsIHJlc29sdXRpb246IDF9XG5cdCAqIHdoZXJlIHJlc29sdXRpb24gaXMgaHR0cDovL2Rldi53My5vcmcvY3Nzd2cvY3NzLXZhbHVlcy0zLyNyZXNvbHV0aW9uLXZhbHVlXG5cdCAqIElmIHNpemVzIGlzIHNwZWNpZmllZCwgcmVzIGlzIGNhbGN1bGF0ZWRcblx0ICovXG5cdHBmLnNldFJlcyA9IGZ1bmN0aW9uKCBzZXQgKSB7XG5cdFx0dmFyIGNhbmRpZGF0ZXM7XG5cdFx0aWYgKCBzZXQgKSB7XG5cblx0XHRcdGNhbmRpZGF0ZXMgPSBwZi5wYXJzZVNldCggc2V0ICk7XG5cblx0XHRcdGZvciAoIHZhciBpID0gMCwgbGVuID0gY2FuZGlkYXRlcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdFx0c2V0UmVzb2x1dGlvbiggY2FuZGlkYXRlc1sgaSBdLCBzZXQuc2l6ZXMgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGNhbmRpZGF0ZXM7XG5cdH07XG5cblx0cGYuc2V0UmVzLnJlcyA9IHNldFJlc29sdXRpb247XG5cblx0cGYuYXBwbHlTZXRDYW5kaWRhdGUgPSBmdW5jdGlvbiggY2FuZGlkYXRlcywgaW1nICkge1xuXHRcdGlmICggIWNhbmRpZGF0ZXMubGVuZ3RoICkge3JldHVybjt9XG5cdFx0dmFyIGNhbmRpZGF0ZSxcblx0XHRcdGksXG5cdFx0XHRqLFxuXHRcdFx0bGVuZ3RoLFxuXHRcdFx0YmVzdENhbmRpZGF0ZSxcblx0XHRcdGN1clNyYyxcblx0XHRcdGN1ckNhbixcblx0XHRcdGNhbmRpZGF0ZVNyYyxcblx0XHRcdGFib3J0Q3VyU3JjO1xuXG5cdFx0dmFyIGltYWdlRGF0YSA9IGltZ1sgcGYubnMgXTtcblx0XHR2YXIgZHByID0gcGYuRFBSO1xuXG5cdFx0Y3VyU3JjID0gaW1hZ2VEYXRhLmN1clNyYyB8fCBpbWdbY3VyU3JjUHJvcF07XG5cblx0XHRjdXJDYW4gPSBpbWFnZURhdGEuY3VyQ2FuIHx8IHNldFNyY1RvQ3VyKGltZywgY3VyU3JjLCBjYW5kaWRhdGVzWzBdLnNldCk7XG5cblx0XHQvLyBpZiB3ZSBoYXZlIGEgY3VycmVudCBzb3VyY2UsIHdlIG1pZ2h0IGVpdGhlciBiZWNvbWUgbGF6eSBvciBnaXZlIHRoaXMgc291cmNlIHNvbWUgYWR2YW50YWdlXG5cdFx0aWYgKCBjdXJDYW4gJiYgY3VyQ2FuLnNldCA9PT0gY2FuZGlkYXRlc1sgMCBdLnNldCApIHtcblxuXHRcdFx0Ly8gaWYgYnJvd3NlciBjYW4gYWJvcnQgaW1hZ2UgcmVxdWVzdCBhbmQgdGhlIGltYWdlIGhhcyBhIGhpZ2hlciBwaXhlbCBkZW5zaXR5IHRoYW4gbmVlZGVkXG5cdFx0XHQvLyBhbmQgdGhpcyBpbWFnZSBpc24ndCBkb3dubG9hZGVkIHlldCwgd2Ugc2tpcCBuZXh0IHBhcnQgYW5kIHRyeSB0byBzYXZlIGJhbmR3aWR0aFxuXHRcdFx0YWJvcnRDdXJTcmMgPSAoc3VwcG9ydEFib3J0ICYmICFpbWcuY29tcGxldGUgJiYgY3VyQ2FuLnJlcyAtIDAuMSA+IGRwcik7XG5cblx0XHRcdGlmICggIWFib3J0Q3VyU3JjICkge1xuXHRcdFx0XHRjdXJDYW4uY2FjaGVkID0gdHJ1ZTtcblxuXHRcdFx0XHQvLyBpZiBjdXJyZW50IGNhbmRpZGF0ZSBpcyBcImJlc3RcIiwgXCJiZXR0ZXJcIiBvciBcIm9rYXlcIixcblx0XHRcdFx0Ly8gc2V0IGl0IHRvIGJlc3RDYW5kaWRhdGVcblx0XHRcdFx0aWYgKCBjdXJDYW4ucmVzID49IGRwciApIHtcblx0XHRcdFx0XHRiZXN0Q2FuZGlkYXRlID0gY3VyQ2FuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCAhYmVzdENhbmRpZGF0ZSApIHtcblxuXHRcdFx0Y2FuZGlkYXRlcy5zb3J0KCBhc2NlbmRpbmdTb3J0ICk7XG5cblx0XHRcdGxlbmd0aCA9IGNhbmRpZGF0ZXMubGVuZ3RoO1xuXHRcdFx0YmVzdENhbmRpZGF0ZSA9IGNhbmRpZGF0ZXNbIGxlbmd0aCAtIDEgXTtcblxuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBsZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0Y2FuZGlkYXRlID0gY2FuZGlkYXRlc1sgaSBdO1xuXHRcdFx0XHRpZiAoIGNhbmRpZGF0ZS5yZXMgPj0gZHByICkge1xuXHRcdFx0XHRcdGogPSBpIC0gMTtcblxuXHRcdFx0XHRcdC8vIHdlIGhhdmUgZm91bmQgdGhlIHBlcmZlY3QgY2FuZGlkYXRlLFxuXHRcdFx0XHRcdC8vIGJ1dCBsZXQncyBpbXByb3ZlIHRoaXMgYSBsaXR0bGUgYml0IHdpdGggc29tZSBhc3N1bXB0aW9ucyA7LSlcblx0XHRcdFx0XHRpZiAoY2FuZGlkYXRlc1sgaiBdICYmXG5cdFx0XHRcdFx0XHQoYWJvcnRDdXJTcmMgfHwgY3VyU3JjICE9PSBwZi5tYWtlVXJsKCBjYW5kaWRhdGUudXJsICkpICYmXG5cdFx0XHRcdFx0XHRjaG9vc2VMb3dSZXMoY2FuZGlkYXRlc1sgaiBdLnJlcywgY2FuZGlkYXRlLnJlcywgZHByLCBjYW5kaWRhdGVzWyBqIF0uY2FjaGVkKSkge1xuXG5cdFx0XHRcdFx0XHRiZXN0Q2FuZGlkYXRlID0gY2FuZGlkYXRlc1sgaiBdO1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGJlc3RDYW5kaWRhdGUgPSBjYW5kaWRhdGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBiZXN0Q2FuZGlkYXRlICkge1xuXG5cdFx0XHRjYW5kaWRhdGVTcmMgPSBwZi5tYWtlVXJsKCBiZXN0Q2FuZGlkYXRlLnVybCApO1xuXG5cdFx0XHRpbWFnZURhdGEuY3VyU3JjID0gY2FuZGlkYXRlU3JjO1xuXHRcdFx0aW1hZ2VEYXRhLmN1ckNhbiA9IGJlc3RDYW5kaWRhdGU7XG5cblx0XHRcdGlmICggY2FuZGlkYXRlU3JjICE9PSBjdXJTcmMgKSB7XG5cdFx0XHRcdHBmLnNldFNyYyggaW1nLCBiZXN0Q2FuZGlkYXRlICk7XG5cdFx0XHR9XG5cdFx0XHRwZi5zZXRTaXplKCBpbWcgKTtcblx0XHR9XG5cdH07XG5cblx0cGYuc2V0U3JjID0gZnVuY3Rpb24oIGltZywgYmVzdENhbmRpZGF0ZSApIHtcblx0XHR2YXIgb3JpZ1dpZHRoO1xuXHRcdGltZy5zcmMgPSBiZXN0Q2FuZGlkYXRlLnVybDtcblxuXHRcdC8vIGFsdGhvdWdoIHRoaXMgaXMgYSBzcGVjaWZpYyBTYWZhcmkgaXNzdWUsIHdlIGRvbid0IHdhbnQgdG8gdGFrZSB0b28gbXVjaCBkaWZmZXJlbnQgY29kZSBwYXRoc1xuXHRcdGlmICggYmVzdENhbmRpZGF0ZS5zZXQudHlwZSA9PT0gXCJpbWFnZS9zdmcreG1sXCIgKSB7XG5cdFx0XHRvcmlnV2lkdGggPSBpbWcuc3R5bGUud2lkdGg7XG5cdFx0XHRpbWcuc3R5bGUud2lkdGggPSAoaW1nLm9mZnNldFdpZHRoICsgMSkgKyBcInB4XCI7XG5cblx0XHRcdC8vIG5leHQgbGluZSBvbmx5IHNob3VsZCB0cmlnZ2VyIGEgcmVwYWludFxuXHRcdFx0Ly8gaWYuLi4gaXMgb25seSBkb25lIHRvIHRyaWNrIGRlYWQgY29kZSByZW1vdmFsXG5cdFx0XHRpZiAoIGltZy5vZmZzZXRXaWR0aCArIDEgKSB7XG5cdFx0XHRcdGltZy5zdHlsZS53aWR0aCA9IG9yaWdXaWR0aDtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cGYuZ2V0U2V0ID0gZnVuY3Rpb24oIGltZyApIHtcblx0XHR2YXIgaSwgc2V0LCBzdXBwb3J0c1R5cGU7XG5cdFx0dmFyIG1hdGNoID0gZmFsc2U7XG5cdFx0dmFyIHNldHMgPSBpbWcgWyBwZi5ucyBdLnNldHM7XG5cblx0XHRmb3IgKCBpID0gMDsgaSA8IHNldHMubGVuZ3RoICYmICFtYXRjaDsgaSsrICkge1xuXHRcdFx0c2V0ID0gc2V0c1tpXTtcblxuXHRcdFx0aWYgKCAhc2V0LnNyY3NldCB8fCAhcGYubWF0Y2hlc01lZGlhKCBzZXQubWVkaWEgKSB8fCAhKHN1cHBvcnRzVHlwZSA9IHBmLnN1cHBvcnRzVHlwZSggc2V0LnR5cGUgKSkgKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHN1cHBvcnRzVHlwZSA9PT0gXCJwZW5kaW5nXCIgKSB7XG5cdFx0XHRcdHNldCA9IHN1cHBvcnRzVHlwZTtcblx0XHRcdH1cblxuXHRcdFx0bWF0Y2ggPSBzZXQ7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gbWF0Y2g7XG5cdH07XG5cblx0cGYucGFyc2VTZXRzID0gZnVuY3Rpb24oIGVsZW1lbnQsIHBhcmVudCwgb3B0aW9ucyApIHtcblx0XHR2YXIgc3Jjc2V0QXR0cmlidXRlLCBpbWFnZVNldCwgaXNXRGVzY3JpcG9yLCBzcmNzZXRQYXJzZWQ7XG5cblx0XHR2YXIgaGFzUGljdHVyZSA9IHBhcmVudCAmJiBwYXJlbnQubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gXCJQSUNUVVJFXCI7XG5cdFx0dmFyIGltYWdlRGF0YSA9IGVsZW1lbnRbIHBmLm5zIF07XG5cblx0XHRpZiAoIGltYWdlRGF0YS5zcmMgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnNyYyApIHtcblx0XHRcdGltYWdlRGF0YS5zcmMgPSBnZXRJbWdBdHRyLmNhbGwoIGVsZW1lbnQsIFwic3JjXCIgKTtcblx0XHRcdGlmICggaW1hZ2VEYXRhLnNyYyApIHtcblx0XHRcdFx0c2V0SW1nQXR0ci5jYWxsKCBlbGVtZW50LCBzcmNBdHRyLCBpbWFnZURhdGEuc3JjICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZW1vdmVJbWdBdHRyLmNhbGwoIGVsZW1lbnQsIHNyY0F0dHIgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIGltYWdlRGF0YS5zcmNzZXQgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnNyY3NldCB8fCAhcGYuc3VwU3Jjc2V0IHx8IGVsZW1lbnQuc3Jjc2V0ICkge1xuXHRcdFx0c3Jjc2V0QXR0cmlidXRlID0gZ2V0SW1nQXR0ci5jYWxsKCBlbGVtZW50LCBcInNyY3NldFwiICk7XG5cdFx0XHRpbWFnZURhdGEuc3Jjc2V0ID0gc3Jjc2V0QXR0cmlidXRlO1xuXHRcdFx0c3Jjc2V0UGFyc2VkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpbWFnZURhdGEuc2V0cyA9IFtdO1xuXG5cdFx0aWYgKCBoYXNQaWN0dXJlICkge1xuXHRcdFx0aW1hZ2VEYXRhLnBpYyA9IHRydWU7XG5cdFx0XHRnZXRBbGxTb3VyY2VFbGVtZW50cyggcGFyZW50LCBpbWFnZURhdGEuc2V0cyApO1xuXHRcdH1cblxuXHRcdGlmICggaW1hZ2VEYXRhLnNyY3NldCApIHtcblx0XHRcdGltYWdlU2V0ID0ge1xuXHRcdFx0XHRzcmNzZXQ6IGltYWdlRGF0YS5zcmNzZXQsXG5cdFx0XHRcdHNpemVzOiBnZXRJbWdBdHRyLmNhbGwoIGVsZW1lbnQsIFwic2l6ZXNcIiApXG5cdFx0XHR9O1xuXG5cdFx0XHRpbWFnZURhdGEuc2V0cy5wdXNoKCBpbWFnZVNldCApO1xuXG5cdFx0XHRpc1dEZXNjcmlwb3IgPSAoYWx3YXlzQ2hlY2tXRGVzY3JpcHRvciB8fCBpbWFnZURhdGEuc3JjKSAmJiByZWdXRGVzYy50ZXN0KGltYWdlRGF0YS5zcmNzZXQgfHwgXCJcIik7XG5cblx0XHRcdC8vIGFkZCBub3JtYWwgc3JjIGFzIGNhbmRpZGF0ZSwgaWYgc291cmNlIGhhcyBubyB3IGRlc2NyaXB0b3Jcblx0XHRcdGlmICggIWlzV0Rlc2NyaXBvciAmJiBpbWFnZURhdGEuc3JjICYmICFnZXRDYW5kaWRhdGVGb3JTcmMoaW1hZ2VEYXRhLnNyYywgaW1hZ2VTZXQpICYmICFpbWFnZVNldC5oYXMxeCApIHtcblx0XHRcdFx0aW1hZ2VTZXQuc3Jjc2V0ICs9IFwiLCBcIiArIGltYWdlRGF0YS5zcmM7XG5cdFx0XHRcdGltYWdlU2V0LmNhbmRzLnB1c2goe1xuXHRcdFx0XHRcdHVybDogaW1hZ2VEYXRhLnNyYyxcblx0XHRcdFx0XHRkOiAxLFxuXHRcdFx0XHRcdHNldDogaW1hZ2VTZXRcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2UgaWYgKCBpbWFnZURhdGEuc3JjICkge1xuXHRcdFx0aW1hZ2VEYXRhLnNldHMucHVzaCgge1xuXHRcdFx0XHRzcmNzZXQ6IGltYWdlRGF0YS5zcmMsXG5cdFx0XHRcdHNpemVzOiBudWxsXG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aW1hZ2VEYXRhLmN1ckNhbiA9IG51bGw7XG5cdFx0aW1hZ2VEYXRhLmN1clNyYyA9IHVuZGVmaW5lZDtcblxuXHRcdC8vIGlmIGltZyBoYXMgcGljdHVyZSBvciB0aGUgc3Jjc2V0IHdhcyByZW1vdmVkIG9yIGhhcyBhIHNyY3NldCBhbmQgZG9lcyBub3Qgc3VwcG9ydCBzcmNzZXQgYXQgYWxsXG5cdFx0Ly8gb3IgaGFzIGEgdyBkZXNjcmlwdG9yIChhbmQgZG9lcyBub3Qgc3VwcG9ydCBzaXplcykgc2V0IHN1cHBvcnQgdG8gZmFsc2UgdG8gZXZhbHVhdGVcblx0XHRpbWFnZURhdGEuc3VwcG9ydGVkID0gISggaGFzUGljdHVyZSB8fCAoIGltYWdlU2V0ICYmICFwZi5zdXBTcmNzZXQgKSB8fCAoaXNXRGVzY3JpcG9yICYmICFwZi5zdXBTaXplcykgKTtcblxuXHRcdGlmICggc3Jjc2V0UGFyc2VkICYmIHBmLnN1cFNyY3NldCAmJiAhaW1hZ2VEYXRhLnN1cHBvcnRlZCApIHtcblx0XHRcdGlmICggc3Jjc2V0QXR0cmlidXRlICkge1xuXHRcdFx0XHRzZXRJbWdBdHRyLmNhbGwoIGVsZW1lbnQsIHNyY3NldEF0dHIsIHNyY3NldEF0dHJpYnV0ZSApO1xuXHRcdFx0XHRlbGVtZW50LnNyY3NldCA9IFwiXCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZW1vdmVJbWdBdHRyLmNhbGwoIGVsZW1lbnQsIHNyY3NldEF0dHIgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoaW1hZ2VEYXRhLnN1cHBvcnRlZCAmJiAhaW1hZ2VEYXRhLnNyY3NldCAmJiAoKCFpbWFnZURhdGEuc3JjICYmIGVsZW1lbnQuc3JjKSB8fCAgZWxlbWVudC5zcmMgIT09IHBmLm1ha2VVcmwoaW1hZ2VEYXRhLnNyYykpKSB7XG5cdFx0XHRpZiAoaW1hZ2VEYXRhLnNyYyA9PT0gbnVsbCkge1xuXHRcdFx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcInNyY1wiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsZW1lbnQuc3JjID0gaW1hZ2VEYXRhLnNyYztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpbWFnZURhdGEucGFyc2VkID0gdHJ1ZTtcblx0fTtcblxuXHRwZi5maWxsSW1nID0gZnVuY3Rpb24oZWxlbWVudCwgb3B0aW9ucykge1xuXHRcdHZhciBpbWFnZURhdGE7XG5cdFx0dmFyIGV4dHJlbWUgPSBvcHRpb25zLnJlc2VsZWN0IHx8IG9wdGlvbnMucmVldmFsdWF0ZTtcblxuXHRcdC8vIGV4cGFuZG8gZm9yIGNhY2hpbmcgZGF0YSBvbiB0aGUgaW1nXG5cdFx0aWYgKCAhZWxlbWVudFsgcGYubnMgXSApIHtcblx0XHRcdGVsZW1lbnRbIHBmLm5zIF0gPSB7fTtcblx0XHR9XG5cblx0XHRpbWFnZURhdGEgPSBlbGVtZW50WyBwZi5ucyBdO1xuXG5cdFx0Ly8gaWYgdGhlIGVsZW1lbnQgaGFzIGFscmVhZHkgYmVlbiBldmFsdWF0ZWQsIHNraXAgaXRcblx0XHQvLyB1bmxlc3MgYG9wdGlvbnMucmVldmFsdWF0ZWAgaXMgc2V0IHRvIHRydWUgKCB0aGlzLCBmb3IgZXhhbXBsZSxcblx0XHQvLyBpcyBzZXQgdG8gdHJ1ZSB3aGVuIHJ1bm5pbmcgYHBpY3R1cmVmaWxsYCBvbiBgcmVzaXplYCApLlxuXHRcdGlmICggIWV4dHJlbWUgJiYgaW1hZ2VEYXRhLmV2YWxlZCA9PT0gZXZhbElkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggIWltYWdlRGF0YS5wYXJzZWQgfHwgb3B0aW9ucy5yZWV2YWx1YXRlICkge1xuXHRcdFx0cGYucGFyc2VTZXRzKCBlbGVtZW50LCBlbGVtZW50LnBhcmVudE5vZGUsIG9wdGlvbnMgKTtcblx0XHR9XG5cblx0XHRpZiAoICFpbWFnZURhdGEuc3VwcG9ydGVkICkge1xuXHRcdFx0YXBwbHlCZXN0Q2FuZGlkYXRlKCBlbGVtZW50ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGltYWdlRGF0YS5ldmFsZWQgPSBldmFsSWQ7XG5cdFx0fVxuXHR9O1xuXG5cdHBmLnNldHVwUnVuID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCAhYWxyZWFkeVJ1biB8fCBpc1Z3RGlydHkgfHwgKERQUiAhPT0gd2luZG93LmRldmljZVBpeGVsUmF0aW8pICkge1xuXHRcdFx0dXBkYXRlTWV0cmljcygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBJZiBwaWN0dXJlIGlzIHN1cHBvcnRlZCwgd2VsbCwgdGhhdCdzIGF3ZXNvbWUuXG5cdGlmICggcGYuc3VwUGljdHVyZSApIHtcblx0XHRwaWN0dXJlZmlsbCA9IG5vb3A7XG5cdFx0cGYuZmlsbEltZyA9IG5vb3A7XG5cdH0gZWxzZSB7XG5cblx0XHQgLy8gU2V0IHVwIHBpY3R1cmUgcG9seWZpbGwgYnkgcG9sbGluZyB0aGUgZG9jdW1lbnRcblx0XHQoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgaXNEb21SZWFkeTtcblx0XHRcdHZhciByZWdSZWFkeSA9IHdpbmRvdy5hdHRhY2hFdmVudCA/IC9kJHxeYy8gOiAvZCR8XmN8XmkvO1xuXG5cdFx0XHR2YXIgcnVuID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciByZWFkeVN0YXRlID0gZG9jdW1lbnQucmVhZHlTdGF0ZSB8fCBcIlwiO1xuXG5cdFx0XHRcdHRpbWVySWQgPSBzZXRUaW1lb3V0KHJ1biwgcmVhZHlTdGF0ZSA9PT0gXCJsb2FkaW5nXCIgPyAyMDAgOiAgOTk5KTtcblx0XHRcdFx0aWYgKCBkb2N1bWVudC5ib2R5ICkge1xuXHRcdFx0XHRcdHBmLmZpbGxJbWdzKCk7XG5cdFx0XHRcdFx0aXNEb21SZWFkeSA9IGlzRG9tUmVhZHkgfHwgcmVnUmVhZHkudGVzdChyZWFkeVN0YXRlKTtcblx0XHRcdFx0XHRpZiAoIGlzRG9tUmVhZHkgKSB7XG5cdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQoIHRpbWVySWQgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0dmFyIHRpbWVySWQgPSBzZXRUaW1lb3V0KHJ1biwgZG9jdW1lbnQuYm9keSA/IDkgOiA5OSk7XG5cblx0XHRcdC8vIEFsc28gYXR0YWNoIHBpY3R1cmVmaWxsIG9uIHJlc2l6ZSBhbmQgcmVhZHlzdGF0ZWNoYW5nZVxuXHRcdFx0Ly8gaHR0cDovL21vZGVybmphdmFzY3JpcHQuYmxvZ3Nwb3QuY29tLzIwMTMvMDgvYnVpbGRpbmctYmV0dGVyLWRlYm91bmNlLmh0bWxcblx0XHRcdHZhciBkZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcblx0XHRcdFx0dmFyIHRpbWVvdXQsIHRpbWVzdGFtcDtcblx0XHRcdFx0dmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIGxhc3QgPSAobmV3IERhdGUoKSkgLSB0aW1lc3RhbXA7XG5cblx0XHRcdFx0XHRpZiAobGFzdCA8IHdhaXQpIHtcblx0XHRcdFx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0XHRcdFx0ZnVuYygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGltZXN0YW1wID0gbmV3IERhdGUoKTtcblxuXHRcdFx0XHRcdGlmICghdGltZW91dCkge1xuXHRcdFx0XHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdH07XG5cdFx0XHR2YXIgbGFzdENsaWVudFdpZHRoID0gZG9jRWxlbS5jbGllbnRIZWlnaHQ7XG5cdFx0XHR2YXIgb25SZXNpemUgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0aXNWd0RpcnR5ID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGggfHwgMCwgZG9jRWxlbS5jbGllbnRXaWR0aCkgIT09IHVuaXRzLndpZHRoIHx8IGRvY0VsZW0uY2xpZW50SGVpZ2h0ICE9PSBsYXN0Q2xpZW50V2lkdGg7XG5cdFx0XHRcdGxhc3RDbGllbnRXaWR0aCA9IGRvY0VsZW0uY2xpZW50SGVpZ2h0O1xuXHRcdFx0XHRpZiAoIGlzVndEaXJ0eSApIHtcblx0XHRcdFx0XHRwZi5maWxsSW1ncygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRvbiggd2luZG93LCBcInJlc2l6ZVwiLCBkZWJvdW5jZShvblJlc2l6ZSwgOTkgKSApO1xuXHRcdFx0b24oIGRvY3VtZW50LCBcInJlYWR5c3RhdGVjaGFuZ2VcIiwgcnVuICk7XG5cdFx0fSkoKTtcblx0fVxuXG5cdHBmLnBpY3R1cmVmaWxsID0gcGljdHVyZWZpbGw7XG5cdC8vdXNlIHRoaXMgaW50ZXJuYWxseSBmb3IgZWFzeSBtb25rZXkgcGF0Y2hpbmcvcGVyZm9ybWFuY2UgdGVzdGluZ1xuXHRwZi5maWxsSW1ncyA9IHBpY3R1cmVmaWxsO1xuXHRwZi50ZWFyZG93blJ1biA9IG5vb3A7XG5cblx0LyogZXhwb3NlIG1ldGhvZHMgZm9yIHRlc3RpbmcgKi9cblx0cGljdHVyZWZpbGwuXyA9IHBmO1xuXG5cdHdpbmRvdy5waWN0dXJlZmlsbENGRyA9IHtcblx0XHRwZjogcGYsXG5cdFx0cHVzaDogZnVuY3Rpb24oYXJncykge1xuXHRcdFx0dmFyIG5hbWUgPSBhcmdzLnNoaWZ0KCk7XG5cdFx0XHRpZiAodHlwZW9mIHBmW25hbWVdID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0cGZbbmFtZV0uYXBwbHkocGYsIGFyZ3MpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2ZnW25hbWVdID0gYXJnc1swXTtcblx0XHRcdFx0aWYgKGFscmVhZHlSdW4pIHtcblx0XHRcdFx0XHRwZi5maWxsSW1ncyggeyByZXNlbGVjdDogdHJ1ZSB9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0d2hpbGUgKHNldE9wdGlvbnMgJiYgc2V0T3B0aW9ucy5sZW5ndGgpIHtcblx0XHR3aW5kb3cucGljdHVyZWZpbGxDRkcucHVzaChzZXRPcHRpb25zLnNoaWZ0KCkpO1xuXHR9XG5cblx0LyogZXhwb3NlIHBpY3R1cmVmaWxsICovXG5cdHdpbmRvdy5waWN0dXJlZmlsbCA9IHBpY3R1cmVmaWxsO1xuXG5cdC8qIGV4cG9zZSBwaWN0dXJlZmlsbCAqL1xuXHRpZiAoIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcIm9iamVjdFwiICkge1xuXHRcdC8vIENvbW1vbkpTLCBqdXN0IGV4cG9ydFxuXHRcdG1vZHVsZS5leHBvcnRzID0gcGljdHVyZWZpbGw7XG5cdH0gZWxzZSBpZiAoIHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kICkge1xuXHRcdC8vIEFNRCBzdXBwb3J0XG5cdFx0ZGVmaW5lKCBcInBpY3R1cmVmaWxsXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gcGljdHVyZWZpbGw7IH0gKTtcblx0fVxuXG5cdC8vIElFOCBldmFscyB0aGlzIHN5bmMsIHNvIGl0IG11c3QgYmUgdGhlIGxhc3QgdGhpbmcgd2UgZG9cblx0aWYgKCAhcGYuc3VwUGljdHVyZSApIHtcblx0XHR0eXBlc1sgXCJpbWFnZS93ZWJwXCIgXSA9IGRldGVjdFR5cGVTdXBwb3J0KFwiaW1hZ2Uvd2VicFwiLCBcImRhdGE6aW1hZ2Uvd2VicDtiYXNlNjQsVWtsR1Jrb0FBQUJYUlVKUVZsQTRXQW9BQUFBUUFBQUFBQUFBQUFBQVFVeFFTQXdBQUFBQkJ4QVIvUTlFUlA4REFBQldVRGdnR0FBQUFEQUJBSjBCS2dFQUFRQURBRFFscEFBRGNBRCsrLzFRQUE9PVwiICk7XG5cdH1cblxufSApKCB3aW5kb3csIGRvY3VtZW50ICk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIyOSk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=