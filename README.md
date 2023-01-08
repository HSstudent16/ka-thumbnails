# KAThumbnail.JS

Welcome to the Github repo for `KAThumbnail.JS`!  This little module allows you to to have direct control over how your thumbnails appear, with little work needed.  `KAThumbnail.JS` is compatible with every reasonable HTML 5 canvas libary, and requires almost no code to implement.

## Getting started

So you want to use it, huh?  Well, first, you'll need to import the library.  Khan Academy's CORS policy requires that this be done with JSDelivr.
```
<script src = "https://cdn.jsdelivr.net/gh/hsstudent16/ka-thumbnails@latest/ka-thumbnail.min.js"></script>
```
Second, you need to create a canvas for your thumbnail.
```
<canvas id = "thumbnail"></canvas>
```
Finally, you'll need a little JavaScript to decorate the canvas!  This is not at all necessary for `KAThumbnail.JS` to work, but forgetting this step will give you a blank thumbnail.  Yuck!
```
<script>
  var myThumbnail = document.getElementById("thumbnail");
  var ctx = myThumbnail.getContext("2d");
  
  // Drawing goes here! :D
</script>
```

## I don't like the Canvas API

No problem!  You can use any library for the thumbnail canvas.  Here are some common ones:

### p5.js

```
<script
