# How to use `KAThumbnail.js`

If you're reading this, congratulations!  You get to learn all the tricks most people will never bother with :)

## Step 1: Get the file

You can't run a program that doesn't exist.  Fortunately, the program does exist & all you have to do is tell the browser where to find it!  Paste this script tag into the head or body tag of your webpage on Khan Academy:

```
<script src = "https://cdn.jsdelivr.net/gh/hsstudent16/ka-thumbnails@latest/ka-thumbnail.min.js"></script>
```

## Step 2: Make a thumbnail

If you've added the script, then your webpage automatically gets a thumbnail generated each time you save.  You do, of course, need a canvas tag that is, in some way, dedicated to thumbnails.  Any of these methods will work:

```
<canvas thumbnail></canvas>

<canvas for = "thumbnail"></canvas>

<!-- preferred -->
<canvas id = "thumbnail"></canvas>

<canvas name = "thumbnail"></canvas>

<canvas class = "thumbnail"></canvas>

<canvas data-thumbnail></canvas>
```

Once you have a canvas, you can use your favorite tools to draw something on it.  The only rule is that your canvas may not be tainted with cross-origin data.  This usually happens when you draw an HTML image without the `crossorigin` flag set.

If the thumbnail is tainted, then a warning popup will appear when you save or preview the canvas.

## Step 3: Save

Hit the save button, and your thumbnail will automatically be generated.  Now, when you look at your webpage in your projects page or the Hot List, it will appear exactly how you want.

## Options

What?

It didn't appear *exactly* how you wanted?

Well, fortunately, this can be fixed.  Come back later to learn how :D