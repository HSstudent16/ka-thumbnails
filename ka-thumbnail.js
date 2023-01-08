/**
 * HSstudent16's Thumbnail script for Khan Academ Webpages.
 *
 * Information about usage can be found in the README file.
 *
 * @version 1.0.0
 * @author  HSstudent16
 * @license MIT
 */
var KAThumbnail = ((root, udf) => {

  // Import stuff
  root = root ?? this ?? {};

  if (!root.parent || !root.document) return;

  let doc = root.document;

  // Global properties of the thumbnail
  let mode = "fill",
      background = "white",
      originX = 0.5,
      originY = 0.5,

  /**
   * The thumbnail source
   * @type {HTMLCanvasElement|HTMLImageElement}
   */
      canvas,

  // KAThumbnail.JS
      exports = {
        get mode () { return mode },
        get background () { return background },
        get origin () { return {originX, originY} }
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
    let wasCnv = canvas;
    let origin = config.origin ?? config.backgroundOirign ?? origin;

    mode = config.mode ?? config.resize ?? mode;
    background = config.background ?? config.backgroundColor ?? background;
    canvas = config.canvas ?? config.sourceImg ?? canvas;

    originX = Math.clamp((1 - origin.right) ?? origin.left ?? origin.x ?? originX, 0, 1);
    originY = Math.clamp((1 - origin.bottom) ?? origin.top ?? origin.y ?? originY);

    if (!(canvas instanceof root.HTMLCanvasElement) || !(canvas instanceof root.HTMLImageElement)) {
      alert ("Oh Noes! " + canvas.constructor.name + "s do not make nice thumbnails")
      canvas = wasCnv;
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
  function fillScale (ctx, source, size) {
    var ratio = source.width / source.height;
    var scale = size / Math.min(source.width, source.height);
    ctx.drawImage (
      source,
      Math.min(0, originX * size * (1 - ratio)),
      Math.min(0, originY * size * (1 - 1/ratio)),
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
  function fitScale (ctx, source, size) {
    var ratio = source.width / source.height;
    var scale = size / Math.max(source.width, source.height);
    ctx.drawImage  (
      source,
      Math.max(0, 0.5 * size * (1 - ratio)),
      Math.max(0, 0.5 * size * (1 - 1/ratio)),
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
  function stretchScale (ctx, source, size) {
    ctx.drawImage  (source, 0, 0, size, size);
  }

  /**
   * Draws an image without resizing it.  By default, the image is centered, though
   * positioning can be controlled via the `setup()` function.  Parameters are the
   * same as {@link fillScale}.
   *
   * @see {@link fillScale}
   */
  function noScale (ctx, source, size) {
    ctx.drawImage  (source, originX * (size - source.width), originY * (size - source.height));
  }

  /**
   * Guesses the best thumbnail source canvas, if one was not provided with `setup()`.
   *
   * @returns {typeof canvas}
   *   The thumbnail source.
   */
  function getSource () {
    if (!canvas) {
      let source = doc.querySelectorAll(
        "canvas#thumbnail,canvas[thumbnail],canvas[for=thumbnail],canvas[data-thumbnail],canvas[name=thumbnail],canvas.thumbnail"
      );
    }

    let isSafe = false;

    if (source) {
      try {
        source.toDataURL();
        isSafe = true;
      } catch (silently_ignore) {}
    }

    if (isSafe) {
      canvas = source;
    }

    return canvas;
  }
  exports.getSource = getSource;

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
    /** @type {HTMLCanvasElement} */
    let cnv = doc.createElement("canvas");
    let ctx = cnv.getContext("2d");

    cnv.width = cnv.height = size;

    getSource ();

    if (!canvas) {
      ctx.fillStyle = "grey";
      ctx.textAlign = "center";
      ctx.textBaseline = "center";
      ctx.font = Math.round(size * 2 / 3) + "px monospace bold";
      ctx.fillText("?", size / 2, size / 2);

      return callback(cnv.toDataURL("image/png"));
    }

    ctx.fillStyle = background;
    ctx.fillRect (0, 0, size, size);

    switch (mode) {
      case "fill":
      case "cover":
      default:
        fillScale(ctx, canvas, size);
        break;
      case "fit":
      case "auto":
        fitScale(ctx, canvas, size);
        break;
      case "stretch":
      case "squash":
        stretchScale(ctx, canvas, size);
        break;
      case "none":
      case "absolute":
        noScale(ctx, canvas, size);
        break;
    }

    callback(cnv.toDataURL("image/png"));
  }

  // And here's the leak!
  root.parent.WebpageOutput.prototype.getScreenshot = handleSave;

  return root.KAThumbnail = exports;

}) (this);
