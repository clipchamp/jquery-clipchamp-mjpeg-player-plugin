/*!
 * jQuery Clipchamp MJPEG Player Plugin v0.0.1
 * https://github.com/clipchamp/jquery-clipchamp-mjpeg-player-plugin
 * 
 * Plays back MJPEG files produced by the clipchamp
 * online video converter, online video compressor, and
 * webcam recorder.
 *
 * Copyright 2015 zfaas Pty Ltd (clipchamp.com) 
 * https://clipchamp.com
 * https://zfaas.com
 *
 * Released under the MIT license
 */
 (function($) {
	var DEFAULT_FPS = 24,
		DEFAULT_AUTOLOOP = true,
		JPEG_MAGIG_NUMBER = [0xff, 0xd8, 0xff];

	var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.setTimeout;

	function splitMJPEG(mjpegUrl, callback) {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', mjpegUrl, true);
		xhr.overrideMimeType('application/octet-stream');
		xhr.responseType = 'arraybuffer';
		
		xhr.onload = function(event) {
			var array = new Uint8Array(xhr.response),
				startIndex,
				jpegs = [];

			for (var i=0, ii=array.length; i<ii; ++i) {
				if (array[i] === JPEG_MAGIG_NUMBER[0] && array[i+1] === JPEG_MAGIG_NUMBER[1] && array[i+2] === JPEG_MAGIG_NUMBER[2]) {
					if (i>0 && typeof startIndex === 'number') {
						jpegs.push(new Blob([array.subarray(startIndex, i)], {type: 'image/jpeg'}));
					}
					startIndex = i;
				}
			}

			callback(jpegs);
		};

		xhr.send();
	};
	
	function playMJPEGInternal(wrapperElement, mjpegUrl, fps, autoloop) {
		fps = (typeof fps === 'number') ? fps : DEFAULT_FPS;
		autoloop = (typeof autoloop === 'boolean') ? autoloop : DEFAULT_AUTOLOOP;

		var playbackFinished = false,
			imageElement = document.createElement('img'),
			jpegUrl;

		imageElement.setAttribute('style', 'width:100%;');
		wrapperElement.appendChild(imageElement);

		splitMJPEG(mjpegUrl, function(jpegFiles) {
			if (jpegFiles.length > 0) {
				var nextFrameIndex = 0;

				function showNextFrame() {
					if (imageElement) {
						if (jpegUrl) {
							URL.revokeObjectURL(jpegUrl);
						}
						jpegUrl = URL.createObjectURL(jpegFiles[nextFrameIndex++]);

						imageElement.onload = function() {
							
							if (imageElement) {
								if (autoloop || nextFrameIndex < jpegFiles.length) {
									nextFrameIndex = (nextFrameIndex === jpegFiles.length) ? 0 : nextFrameIndex;
									setTimeout(function() {
										requestAnimationFrame(showNextFrame);
									}, 1000/fps);
								}
							}
						};
						imageElement.setAttribute('src', jpegUrl);
					}
				};

				setTimeout(function() {
					requestAnimationFrame(showNextFrame);
				}, 1000/fps);
			}
		});

		return {
			finish: function() {
				if (imageElement) {
					imageElement.src = '';
					wrapperElement.removeChild(imageElement);
					imageElement = undefined;
				}
			}
		};	
	};

	// optionally make available as jQuery plugin
	if (typeof $ === 'function') {
		$.fn.clipchamp_mjpeg_player = function(mjpegUrl, fps, autoloop, callback) {
			if (typeof mjpegUrl === 'string') {
				if (typeof callback === 'function') {
					return this.each(function() {
						callback($(this)[0], playMJPEGInternal($(this)[0], mjpegUrl, fps, autoloop));
					});
				} else {
					throw new Error('Callback must be given and must be a function');
				}
			} else {
				throw new Error('MJPEG URL must be a string');
			}

		}
	}

	// optionally provide AMD module definition
	if (typeof define === 'function') {
		define('jquery.clipchamp.mjpeg.player', [], function() {
			return {
				playMJPEG: function(wrapperElement, mjpegUrl, fps, autoloop) {
					if (wrapperElement instanceof Element) {
						if (typeof mjpegUrl === 'string') {
							return playMJPEGInternal(wrapperElement, mjpegUrl, fps, autoloop);
						} else {
							throw new Error('MJPEG URL must be a string');
						}
					} else {
						throw new Error('No parent element was given');
					}
				}
			};
		});
	}
} )


(typeof jQuery === 'function' ? jQuery : undefined);
