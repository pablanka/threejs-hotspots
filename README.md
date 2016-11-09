# What is it?

THREE JS 2D buttons and labels achorable library

# How to use it:

First import the script after threejs library in your html:

```html
<script src="three.min.js"></script>
<script src="hotspots.min.js"></script>
```
Then you can use it like so:

```javascript
// set render auto clear false.
renderer.autoClear = false;

// new hotspot instance
hotspot = new THREE.Hotspot('img/example.png', 360, 180);
hotspot.position.set(10,0,0); // set 3D hotspot position.

// set pivot point.
hotspot.pivotPoint = THREE.HotspotPivotPoints.CENTER; 
hotspot.onClick = function(){
    // actions
};

// mouse events
hotspot.onMouseDown = function(){
    // actions
};
hotspot.onMouseUp = function(){
    // actions
};
hotspot.onMouseOver = function(){
    // actions
};

// main update
function update()
{
    requestAnimationFrame(update);

    // hotspot instance update.
    hotspot.update();

    // first render main scene
    renderer.clear();
    renderer.render(scene, camera);

    // call hotspots update
    THREE.HotspotGlobals.update();
}

// on resize window
window.addEventListener("resize", function(event){
    camera.aspect = threejsCanvas.width() / threejsCanvas.height();
    camera.updateProjectionMatrix();

    // call hotspot on resize function
    THREE.HotspotGlobals.onResizeFunc();

    renderer.setSize(threejsCanvas.width(), threejsCanvas.height());
});
```
## Authors

* [**Pablo Acuña**](https://github.com/pablanka/)

* [**Jorge Mayoraz**](https://github.com/GnomoMZ)

* [**Luciano Rodriguez**](https://github.com/serweb-labs)
