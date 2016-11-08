# threejs-labels_anchorable
THREE JS 2D buttons and labels achorable library

# Impletentation example:

´´´javascript
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
´´´