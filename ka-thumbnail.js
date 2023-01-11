/**
 * HSstudent16's Thumbnail script for Khan Academ Webpages.
 *
 * Information about usage can be found in the README file.
 *
 * @version 1.1.0
 * @author  HSstudent16
 * @license MIT
 *
 */
var KAThumbnail = ((root, udf) => {

  // Import stuff
  root = root ?? this ?? {};

  if (!root.parent || !root.document) return;

  /**
   * @type {Document}
   */
  let doc = root.document;

  // Global properties of the thumbnail
  let mode = "fill",
      background = "white",
      originX = 0.5,
      originY = 0.5,
      keyBinding = "Escape",
      canvasWasPushed = false,

  /**
   * The thumbnail source
   * @type {HTMLCanvasElement|HTMLImageElement}
   */
      source,
      canvas = doc.createElement("canvas"),
      context = canvas.getContext("2d"),
      wrapper,

  // KAThumbnail.JS
      exports = {
        get mode () { return mode },
        get background () { return background },
        get origin () { return {x: originX, y: originY} },
        get keyBinding () { return keyBinding }
      };

  /**
   * A handy little function that clamps a number between
   * a minimum and a maximum value.
   *
   * @param {number} v - The initial value.  Numbers are preferred.
   * @param {number} m - The minimum value.  Must be less than the maximum value.
   * @param {number} n - The maximum value.  Must be greater than the minimum value.
   *
   * @returns {number} The final, clamped, value.
   */
  Math.clamp = (v, m, x) => v < m ? m : v > x ? x : v;

  /**
   * Brings the preview canvas into view, usually after a user types the proper
   * keystroke.
   */
  function showCanvas () {
    if (!canvasWasPushed) {
      appendToDOM ();
    }
    wrapper.style.opacity = "1";
    canvas.style.transform = "translate(0, 0px)";
    wrapper.style.visibility = "visible";
    canvas.dataset.open = "true";

    paintCanvas (200);
  }
  exports.showPreview = exports.show = showCanvas;

  /**
   * Hides the preview canvas, after pushing it to the DOM (if needed).
   */
  function hideCanvas () {
    if (!canvasWasPushed) {
      appendToDOM ();
    }
    wrapper.style.opacity = "0";
    canvas.style.transform = "translate(0, -50px)";
    wrapper.style.visibility = "hidden";
    canvas.dataset.open = "false";
  }
  exports.hidePreview = exports.hide = hideCanvas;
  
  /**
   * Toggles the visibility of the preview canvas, and pushes the element to the
   * DOM if needed.
   */
  function toggleCanvas () {
    if (canvas.dataset.open === "true") {
      hideCanvas ();
    } else {
      showCanvas ();
    }
  }
  exports.togglePreview = exports.toggle = toggleCanvas;

  /**
   * Manages the key binding for toggling the canvas, when needed.
   * @param {KeyboardEvent} evt The event object handed by the listener
   */
  function checkKeyBinding (evt) {
    let strokes = keyBinding.split(/\s*[+]\s*/g);
    
    if (!canvasWasPushed) return;
    
    // Hide on "esc", in the event of a panic :P
    if (evt.code === "Escape" && canvas.dataset.open === "true") {
      evt.preventDefault ();
      hideCanvas ();
      return false;
    }

    winders:for (let key of strokes) {
      switch (key.toLowerCase()) {
        case "alt":
          if (!evt.altKey) return true; break;
        case "ctrl":
        case "control":
        case "cmd":
        case "command":
          if (!evt.ctrlKey) return true; break;
        case "meta":
        case "home":
          if (!evt.metaKey) return true; break;
        default:
          if (key.length < 2) {
            key = "Key" + key.toUpperCase();
          }
          if (evt.code !== key) return true;
          break winders;
      }
    }
    evt.preventDefault ();
    toggleCanvas ();
    return false;
  }

  /**
   * Pushes the destination canvas to the document's <body> tag,
   * and gives it style :D
   */
  function appendToDOM () {
    wrapper = doc.createElement ("div");

    canvas.dataset.open = "false";

    wrapper.setAttribute (
      "style",
      `position: fixed;
       display: flex;
       align-items: center;
       justify-content: center;
       top: 0px;
       left: 0;
       width: 100vw;
       height: 100vh;
       z-index: 1000;
       backdrop-filter: blur(5px);
       opacity: 0;
       visibility: hidden;
       transition: all ease .2s;`
    );
    canvas.style.transform = "translate(0, -50px)";
    canvas.style.animation = "transform ease .2s";
    wrapper.appendChild(canvas);
    doc.body.appendChild(wrapper);

    wrapper.addEventListener("click", hideCanvas);

    canvasWasPushed = true;
  }

  /**
   * Changes the configuration for saving a thumbnail.
   *
   * @param {Object} config
   *   An object literal containing the settings for `KAThumbnail.JS`.  All properties are optional.
   *
   * @param {"fill"|"fit"|"stretch"|"none"} [config.mode]
   *   Defines how the input canvas is resized for the thumbnail.
   *    - `"fill"`: Resizes the image so that it covers the entire thumbnail.  Cropping of the
   *      horizontal or vertical edges often occurs.
   *    - `"fit"`: Resizes the image so that it entirely visible within the thumbnail.  Horizontal or
   *      vertical bars are common, and colored via `config.background`
   *    - `"stretch"`: Resizes the image so that it is completely visible within the thumbnail, but
   *      without preserving the aspect ratio.  This is the default behavior in Khan Academy's PJS
   *      environment.
   *    - `"none"`: The image is drawn as-is, without any resizing.  The alignment of the image can
   *      be controlled via `config.origin`.
   *
   * @param {string} [config.background]
   *   The background color, if needed, for the thumbnail.  Caution should be used with transparent
   *   thumbnails.
   *
   * @param {HTMLCanvasElement|HTMLImageElement} [config.canvas]
   *   The source element for a thumbnail.  If not provided, `KAThumbnail.JS` will guess the correct
   *   canvas element.
   *
   * @param {Object} [config.origin]
   *   Position of the original image.  This is only used when the original image is cropped to fit
   *   the thumbnail dimensions, i.e. when `config.mode` is "fill" or "none."
   *
   * @param {number} [config.origin.x]
   *   The horizontal position, as a percent, where 0 brings the right-most edge into view, and 1
   *   brings the left-most. Values not between 0 and 1 will be clamped.
   *
   * @param {number} [config.origin.y]
   *   The vertical position, as a percent, where 0 brings the top-most edge into view, and 1 brings
   *   the bottom-most.  Values not between 0 and 1 will be clamped.
   */
  function setup (config) {
    let wasCnv = source;
    let origin = config.origin ?? config.backgroundOirign ?? exports.origin;
    let pushCanvas = true;

    mode = config.mode ?? config.resize ?? mode;
    background = config.background ?? config.backgroundColor ?? background;
    source = config.canvas ?? config.sourceImg ?? source;

    originX = Math.clamp((1 - origin.right) ?? origin.left ?? origin.x ?? originX, 0, 1);
    originY = Math.clamp((1 - origin.bottom) ?? origin.top ?? origin.y ?? originY);


    keyBinding = config.keyBinding ?? config.keyStroke ?? config.shortcut ?? ((pushCanvas = false) || keyBinding);

    pushCanvas = config.showPreview || config.showThumbnail || config.preview || pushCanvas;

    if (pushCanvas && !canvasWasPushed) {
      appendToDOM ();
    }
    
    if (source) {
      if (!(source instanceof root.HTMLCanvasElement) || !(source instanceof root.HTMLImageElement)) {
        alert ("Oh Noes! " + source.constructor.name + "s do not make nice thumbnails")
        source = wasCnv;
      }
    }
  }
  exports.setup = setup;

  /**
   * Draws a resized image to the provided rendering context.  The image is resized
   * so that it covers the thumbnail entirely.
   *
   * @param {CanvasRenderingContext2D} ctx
   *   The rendering context of the thumbnail canvas.
   *
   * @param {typeof canvas} source
   *   The input image, which is painted to the thumbnail canvas.
   *
   * @param {number} size
   *   The width/height of the thumbnail.  As of January 2023, this is always 200px
   */
  function fillScale (size) {
    var ratio = source.width / source.height;
    var scale = size / Math.min(source.width, source.height);
    ctx.drawImage (
      source,
      Math.min(0, originX * size * (1 - ratio)),
      Math.min(0, originY * size * (1 - (1 / ratio))),
      source.width * scale,
      source.height * scale
    );
  }

  /**
   * Draws a resized image so that it is entirely visible in the thumbnail.
   * Parameters are the same as {@link fillScale}.
   *
   * @see {@link fillScale}
   */
  function fitScale (size) {
    var ratio = source.width / source.height;
    var scale = size / Math.max(source.width, source.height);
    ctx.drawImage  (
      source,
      Math.max(0, 0.5 * size * (1 - ratio)),
      Math.max(0, 0.5 * size * (1 - (1 / ratio))),
      source.width * scale,
      source.height * scale
    );
  }

  /**
   * Draws a resized image so that it is entirely visible in the thumbnail,
   * without preserving the apsect ratio. Parameters are the same as
   * {@link fillScale}.
   *
   * @see {@link fillScale}
   */
  function stretchScale (size) {
    ctx.drawImage  (source, 0, 0, size, size);
  }

  /**
   * Draws an image without resizing it.  By default, the image is centered, though
   * positioning can be controlled via the `setup()` function.  Parameters are the
   * same as {@link fillScale}.
   *
   * @see {@link fillScale}
   */
  function noScale (size) {
    ctx.drawImage  (source, originX * (size - source.width), originY * (size - source.height));
  }

  /**
   * Guesses the best thumbnail source canvas, if one was not provided with `setup()`.
   *
   * @returns {typeof source}
   *   The thumbnail source.
   */
  function getSource () {
    let temp = source;
    
    if (!source) {
      temp = doc.querySelector(
        "canvas#thumbnail,canvas[thumbnail],canvas[for=thumbnail],canvas[data-thumbnail],canvas[name=thumbnail],canvas.thumbnail"
      );
    }

    let isSafe = false;

    if (temp) {
      try {
        temp.toDataURL();
        isSafe = true;
      } catch (silently_ignore) {
        alert ("Oh Noes! Your thumbnail source contains cross-origin data, and cannot be exported.")
      }
    } else {
      alert ("Oh Noes!  A thumbnail source was not detected.");
    }

    if (isSafe) {
      source = temp;
    }

    return source;
  }
  exports.getSource = getSource;


  function paintCanvas (size) {
    canvas.width = canvas.height = size;
    context.clearRect (0, 0, size, size);

    getSource ();

    if (!source) {
      context.fillStyle = "grey";
      context.textAlign = "center";
      context.textBaseline = "center";
      context.font = Math.round(size * 2 / 3) + "px monospace bold";
      context.fillText("?", size / 2, size / 2);

      return;
    }

    context.fillStyle = background;
    context.fillRect (0, 0, size, size);

    switch (mode) {
      case "fill":
      case "cover":
      default:
        fillScale(size);
        break;
      case "fit":
      case "auto":
        fitScale(size);
        break;
      case "stretch":
      case "squash":
        stretchScale(size);
        break;
      case "none":
      case "absolute":
        noScale(size);
        break;
    }
  }

  /**
   * Khan Academy's handler for thumbnails, typically called when a program is saved.
   *
   * @callback callback
   * @param {string} dataURL
   *   A Base64-encoded data URL for the thumbnail image.
   *
   * @returns {void}
   */

  /**
   * Handles Khan Academy's "internal" thumbnail saving process.  This is made avaiable
   * thanks to a leak of the `WebpageOutput` constructor to `window.parent`.
   *
   * @param {200} size
   *   The thumbnail size;  this is almost always 200 pixels.
   *
   * @param {callback} callback
   *  Khan Academy's handler for thumbnails, typically called when a program is saved.
   *
   * @returns {void}
   */
  function handleSave (size, callback) {
    paintCanvas (size);

    callback(canvas.toDataURL("image/png"));
  }

  // And here's the leak!
  root.parent.WebpageOutput.prototype.getScreenshot = handleSave;

  // Why not?
  root.addEventListener("keyup", checkKeyBinding);

  return root.KAThumbnail = exports;

}) (this);
