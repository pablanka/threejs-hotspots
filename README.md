# What is it?

THREE JS 2D buttons and labels achorable library

# How to use it:

First import the script after threejs library in your html:

```html
<script src="three.min.js"></script>
<script src="hotspots.js"></script>
```
Then you can use it like so:

```javascript

// set render auto clear false.
renderer.autoClear = false;

// new hotspot container instance
allHotspots = new THREE.Hotspots(renderer, camera);

// set a image
var hotspot = new allHotspots.add('imageUrl.png');

// set a label  
// the properties are like css style
var text = {
   text: "Hello world!",
   color: "red",
   fontWeight: "900",
   fontSize: "14pt",
   width: 64
}

var label = new allHotspots.add(text);

// or only create an instance
var nothing = new allHotspots.add();

// set image, texture or text object
// use for set the image for instanced hotspot
nothing.set('icon.png')

// set position in orthoscene
hotspot.position.set(10, 0, 0);

// set offset.x and offset.xy
// for set postion relative
// by omision: 0
hotspot.offset.x = 100;
hotspot.offset.y = 150;

// angle of visibility
// by omision: 360
hotspot.rangeAngle = 360;

// step of opacity?
// by omision: 180
hotspot.directionAngle = -90;

// set pivot point.
// by omision: 'left'
hotspot.pivotPoint = "center";

// set fired area as disk
// by omision: false
hotspot.rounded = true;

// set width of fired area
// by omision: the material.map.width * proportion
hotspot.width = 110;

// set height of fired area
// by omision: the material.map.height * proportion
hotspot.height = 110;

// set scale respect the bitmap size
// by omision: 1
hotspot.proportion = 0.5;

// call for "dummy mode"
hotspot.disable();

// call for "normal mode"
// hotspot.enable();

// set 0 for make invisible
// by omision: 1
// or use: hotspot.hide() for set 0; hotspot.show() for set 1
hotspot.alpha = 1;

// set false for disable defaults effects:
// - highlight material on mouse down
// - change the cursor to "pointer"
// by omision: true
hotspot.fx = true;

// event fired "on click" the hotspot
hotspot.onClick = function() {
   console.log('click')
};

// event fired "on mouse down" the hotspot
hotspot.onMouseDown = function() {
   console.log('mouse down')
};

// event fired "on mouse up" the hotspot
hotspot.onMouseUp = function() {
   console.log('mouse up')
};

// event fired "on mouse over" the hotspot
hotspot.onMouseOver = function() {
   console.log('mouse over')
};

// event fired "on mouse out" the hotspot
hotspot.onMouseOut = function() {
   console.log('mouse out')
};


// hotspots in main update
function update() {
   // update one hotspot
   hotspot.update();

   // or update all child hotspots
   // of parent instance in one call
   allHotspots.updateAll();

   // first render main scene
   renderer.clear();
   renderer.render(scene, camera);

   // call hotspots render
   allHotspots.render();
}

// on resize window
window.addEventListener("resize", function(event) {
   camera.aspect = renderer.domElement.width() / renderer.domElement.height();
   camera.updateProjectionMatrix();

   // call hotspot on resize function
   allHotspots.onResizeFunc();

   renderer.setSize(renderer.domElement.width(), renderer.domElement.height());
});
```
## Authors

* [**Pablo Acuña**](https://github.com/pablanka/)

* [**Jorge Mayoraz**](https://github.com/GnomoMZ)

* [**Luciano Rodriguez**](https://github.com/serweb-labs)
