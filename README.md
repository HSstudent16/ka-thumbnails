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

P5.js is the sister project of Processing, and is a great library for games and visualizations, especially for learning coders.  Khan Academy uses Processing.JS, an older version of p5.js that is no longer supported.
```
<script>
  function setup () {
    var myThumbnail = createCanvas(200, 200);
    
    KAThumbnail.setup({
      canvas: myThumbnail.elt
    });
  }
  
  function draw () {
    // Drawing goes here! :D
  }
</script>
```

### Ski.js

Ski.js is a lightweight spin-off of Processing.JS that closely wraps the native Canvas API, while still providing the beginner-friendliness of Processing.  Ski, [@TheLegendSki](https://www.khanacademy.org/profile/thelegendski/) is also a Khan Academy user, and has his own thumbnail script!  Check it out [here](https://github.com/thelegendski/thumbnail.js).
```
<script>
  size (200, 200);
  
  KAThumbnail.setup({
    canvas: canvas
  });
  
  draw = function () {
    // Drawing goes here! :D
  };
</script>
```
## Documentation

For now, there is none =P
The code snippets above are enough to create awesome thumbnails, though.
