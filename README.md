# jquery-clipchamp-mjpeg-player-plugin
This jQuery plugin provides a simple player for MJPEG ("motion JPEG") videos, as produced by the [clipchamp.com online video converter, video compressor, and webcam recorder](https://clipchamp.com).

## Installation

There are two easy alternatives to add jquery-clipchamp-mjpeg-player-plugin to your project:
* Option 1: Add jquery-clipchamp-mjpeg-player-plugin as a submodule (find the Git URLs on the right) of your project:
```
git submodule add git@github.com:clipchamp/jquery-clipchamp-mjpeg-player-plugin.git
```
This is the preferred option if you need to adapt the plugin code. If you plan to contribute to the development of this plugin (you are more than welcome to do so!), you should use GitHub's fork mechanism and rather clone the fork (and submit a pull request when you wish to merge your changes upstream).

* Option 2: Install jquery-clipchamp-mjpeg-player-plugin using npm:
```
npm install jquery-clipchamp-mjpeg-player-plugin
```
This puts the ```jquery-clipchamp-mjpeg-player-plugin``` directory into the ```node_modules``` directory and is the preferred option if you plan to use the plugin "as-is".

In both cases, you may need to copy of symlink the actual Javascript source of the plugin (```jquery.clipchamp.mjpeg.player.js``` from the ```src``` subdirectory within the ```jquery-clipchamp-mjpeg-player-plugin``` directory) into the directory from where you serve the client-side code of your web application. Notice that we do not yet deliver a minified version of the plugin code, so it's up to you to invoke a minifier or your choice to do so.

## Usage

To date, the plugin exposes a simple interface, which is accessible thru either the jQuery API (preferred) or by including the plugin as an [AMD module](http://en.wikipedia.org/wiki/Asynchronous_module_definition). In either case, you need to put a "wrapper element" into your document like so:
```
<div id="mjpeg_player" style="width:640px;"></div>
```
Make sure to size the wrapper element appropriately - the MJPEG player will use the dimensions of the wrapper element to determine the scaling of the played back video itself (for the sake of clean markup and layout separation, you should normally prefer CSS classes over the ```style``` attribute). 

### jQuery API

The jQuery API naturally requires you to also include jQuery into your website. To date, the plugin does not use many jQuery features such that we expect even dated versions of jQuery to work in conjunction with this plugin. The plugin code must be included after jQuery. You can include the script asynchronously (using the ```async``` attribute in the ```<script>``` tag), but must yourself make sure to only invoke the plugin API from your Javascript code once it has become available.

Embedding the MJPEG player and immediately start playing back an MJPEG video is done like that:
```
$('#mjpeg_player').clipchamp_mjpeg_player(mjpegUrl, fps, autoloop, callback);
```
where ```mjpegUrl``` is the URL from where the MJPEG file can be retrieved (you can either construct a blob or data URL or simply pass a http(s) URL in here; ```fps``` determines the playback speed (in numbers of frames per second), ```autoloop``` is a boolean that specifies whether or not the video shall loop after coming to an end, and ```callback``` is a callback function that is invoked with two parameters:
```
function playerCallback(wrapperElement, playerInterface) {
   ...
   playerInterface.finish();
}
```
That is, ```wrapperElement``` is the DOM element (here: the ```div``` that was selected with the ```#mjpeg_player``` CSS query) and ```playerInterface``` is an object giving access to a few functions that permit to control the player. So far, ```playerInterface``` has only a single property ```finish```, which is a function that needs to be called in order to stop the playback. Calling ```finish``` will both stop the playback and also remove the player from its wrapper element.

### AMD module API

_TODO_
