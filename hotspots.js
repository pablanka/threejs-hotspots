/*
 * @author Pablo Acuña - pbk.pablo.a@gmail.com | https://github.com/pablanka
 * @author Jorge Mayoraz - jorge.emh@hotmail.com | https://github.com/GnomoMZ
 * @author Luciano Rodriguez - luciano.rdz@gmail.com | https://github.com/serweb-labs
 */

"use strict";

THREE.Hotspots = function(renderer, camera) {

  if (typeof renderer == 'undefined' || !renderer) {
  	throw "argument 'renderer' is need";
  }

  if (typeof camera == 'undefined' || !camera) {
  	throw "argument 'camera' is need";
  }

  this.renderer = renderer;
  this.camera = camera;
  this.container = renderer.domElement;
  this.orthoScene = new THREE.Scene();
  this.list = [];

  var parent = this;

  if (window.devicePixelRatio > 1) {
      this.orthoCamera = new THREE.OrthographicCamera(-this.container.offsetWidth / 2, this.container.offsetWidth / 2, this.container.offsetHeight / 2 + 50, -this.container.offsetHeight / 2 - 50, 1, 1000000);
  }
  else {
      this.orthoCamera = new THREE.OrthographicCamera(-this.container.offsetWidth / 2, this.container.offsetWidth / 2, this.container.offsetHeight / 2, -this.container.offsetHeight / 2, 1, 1000000);
  }

  this.orthoCamera.position.z = 10;
  this.init(this.container);

  this.add = function(img) {
    return new HotspotChild(img, parent)
  }
}

THREE.Hotspots.prototype.onResizeFunc = function() {
  this.orthoCamera.left = -this.container.offsetWidth / 2;
  this.orthoCamera.right = this.container.offsetWidth / 2;
  this.orthoCamera.top = this.container.offsetHeight / 2;
  this.orthoCamera.bottom = -this.container.offsetHeight / 2;
  this.orthoCamera.updateProjectionMatrix();
};

THREE.Hotspots.prototype.render = function() {
  this.renderer.clearDepth();
  this.renderer.render(this.orthoScene, this.orthoCamera);
};

THREE.Hotspots.prototype.updateAll = function() {
	for (var i = 0; i < this.list.length; i++) {
		var hs = this.list[i];
	    hs.controller.updateElementPos();
	    hs.controller.updateElementAlpha();
	    hs.controller.checkIfBehindCamera();
	}
};

THREE.Hotspots.prototype.init = function() {
  var HTSPTG = this;
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector3();
  var obj = {};
  var contPos = getPos(HTSPTG.container);
  var canvas = this.container;

  this.over = false;
  this.down = false;

  canvas.addEventListener("mousemove", function(e) {
      var _event = {};
      _event.clientX = e.clientX - contPos.x;
      _event.clientY = e.clientY - contPos.y;
      onMouseMove(_event);
  });

  canvas.addEventListener('mousedown', function(e) {
      var _event = {};
      _event.clientX = e.clientX - contPos.x;
      _event.clientY = e.clientY - contPos.y;
      onMouseDown(_event);
  }, false);

  canvas.addEventListener("mouseup", function(e) {
      var _event = {};
      _event.clientX = e.clientX - contPos.x;
      _event.clientY = e.clientY - contPos.y;
      onMouseUp(_event);
  });

  canvas.addEventListener('touchstart', function(e) {
      var _event = {};
      _event.clientX = e.changedTouches[0].pageX - contPos.x;
      _event.clientY = e.changedTouches[0].pageY - contPos.y;
      onTouchStart(_event);
  }, false);

  canvas.addEventListener('touchend', function(e) {
      var _event = {};
      _event.clientX = e.changedTouches[0].pageX - contPos.x;
      _event.clientY = e.changedTouches[0].pageY - contPos.y;
      onMouseUp(_event);
  }, false);

  function onMouseMove(event) {
      var detected = false;
      var m = mouse;
      m.x = (event.clientX - (HTSPTG.container.offsetWidth / 2));
      m.y = -(event.clientY - (HTSPTG.container.offsetHeight / 2));
      m.z = 10;

      if (HTSPTG.list.length > 0) {

          for (var i = 0; i < HTSPTG.list.length; i++) {

              var obj = HTSPTG.list[i];
              var width = obj.controller.width || obj.scale.x;
              var height = obj.controller.height || obj.scale.y;
              var right = obj.position.x + (width/2);
              var left = obj.position.x - (width/2);
              var up = obj.position.y + (height/2);
              var down = obj.position.y - (height/2);

              // collision detection
           	  // and fire events

              // use bounding box for square / rectangular hotspots
              // use raycaster for rounded hotspots

              if (obj.controller.rounded) {
                var dest = new THREE.Vector3(0, 0, -1);
                raycaster.set(m, dest);
                var intersects = raycaster.intersectObjects([obj]);
                if (intersects.length == 0) {
                  continue;
                }
              }
              else if (m.x > right || m.x < left || m.y > up || m.y < down) {
				continue;
			  }

              if (obj.controller.itsActive && obj.material.opacity) {
                  if (HTSPTG.over) {
                      if (HTSPTG.over.controller.selector != obj.controller.selector) {

                          HTSPTG.container.style.cursor = 'auto';

                          if (isFunction(HTSPTG.over.controller.onMouseOut)) {
                              HTSPTG.over.controller.onMouseOut();
                          }

                          HTSPTG.over = false;
                      }

                  }

                  if (obj.controller.fx) {
                      HTSPTG.container.style.cursor = 'pointer';
                  }
                  else {
                      HTSPTG.container.style.cursor = 'auto';
                  }

                  if (HTSPTG.down && obj.controller.fx) {
                    if (obj.controller.selector === HTSPTG.down.controller.selector) {
                        obj.material.color.setHex(0xb2b2b2);
                    }
                  }

                  if (isFunction(obj.controller.onMouseOver)) {
                      obj.controller.onMouseOver();
                  }

                  HTSPTG.over = obj;
                  detected = true;

                  break;
              }

          }

          if (!detected) {
              if (HTSPTG.over) {

                  HTSPTG.container.style.cursor = 'auto';
                  HTSPTG.over.material.color.set(HTSPTG.over.material.oc);

                  if (isFunction(HTSPTG.over.controller.onMouseOut)) {
                      HTSPTG.over.controller.onMouseOut();
                  }

                  HTSPTG.over = false;
              }
          }

      }
  }

  function onMouseDown() {
      if (!HTSPTG.over) { return; }

      var obj = HTSPTG.over;

      if (obj.controller.itsActive && obj.material.opacity) {

          HTSPTG.down = obj;

          if (obj.controller.fx) {
              obj.material.color.setHex(0xb2b2b2);
          }

          if (isFunction(obj.controller.onMouseDown)) {
              obj.controller.onMouseDown();
          }

      }
  }


  function onMouseUp(event) {

      var m = mouse;
      m.x = (event.clientX - (HTSPTG.container.offsetWidth / 2));
      m.y = -(event.clientY - (HTSPTG.container.offsetHeight / 2));
      m.z = 10;

      for (var i = 0; i < HTSPTG.list.length; i++) {

			var obj = HTSPTG.list[i];


			if (isFunction(obj.controller.onMouseUp)) {
			  obj.controller.onMouseUp();
			}

			if (!HTSPTG.down) { break; }

			var width = obj.controller.width || obj.scale.x;
			var height = obj.controller.height || obj.scale.y;

			var right = obj.position.x + (width/2);
			var left = obj.position.x - (width/2);
			var up = obj.position.y + (height/2);
			var down = obj.position.y - (height/2);

			if( m.x > right || m.x < left || m.y > up || m.y < down){
			 continue;
			}

			if(obj.controller.rounded) {
				var dest = new THREE.Vector3(0, 0, -1);
				raycaster.set(m, dest);
				var intersects = raycaster.intersectObjects([obj]);
				if (intersects.length == 0) {
				  continue;
				}
			}

			if (obj.controller.itsActive && obj.material.opacity) {

			    if (obj.controller.fx) {
			        obj.material.color.set(obj.material.oc);
			    }

			    if (!isFunction(obj.controller.onClick)) {
			        break;
			    }

			    if (HTSPTG.down.controller.selector == obj.controller.selector) {
			        if (isFunction(obj.controller.onClick)) {
			            obj.controller.onClick();
			        }
			    }
			    else {
			      if (HTSPTG.down.controller.fx) {
			          HTSPTG.down.material.color.set(obj.material.oc);
			      }
			    }

			    break;
			}
        }

        HTSPTG.down = false;
  };

  function onTouchStart(event) {
    onMouseMove(event);
    onMouseDown();
  }

  function getPos(el) {
      for (var lx = 0, ly = 0; el != null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
      return {
          x: lx,
          y: ly
      };
  };

  HTSPTG.initialized = true;
};


var HotspotChild = function(img, parent) {
    THREE.Object3D.call(this);

    // API
    this.rangeAngle = 360;
    this.directionAngle = 180;
    this.alpha = 1;
    this.fx = true;
    this.width;
    this.height;
    this.proportion = 1;
    this.pivotPoint = 'left';

    this.offset = {
        x: 0,
        y: 0
    };

    // Internals
    this.myParent = parent;
    this.itsActive = true;
    this.selector = generateUUID();
    this.renderer = parent.renderer;
    this.camera = parent.camera;
    this.container = parent.renderer.domElement;
    this.mySprite = new THREE.Sprite();
    this.mySprite.controller = this;

    // set texture
    if (img) {
    	this.set(img);
    }

    // initialice
    parent.orthoScene.add(this.mySprite);
    parent.list.push(this.mySprite);
};

HotspotChild.prototype = Object.create(THREE.Object3D.prototype);

HotspotChild.prototype.update = function() {
    this.updateElementPos();
    this.updateElementAlpha();
    this.checkIfBehindCamera();
};

HotspotChild.prototype.updateElementPos = function() {

    var halfWidth = this.container.offsetWidth / 2;
    var halfHeight = this.container.offsetHeight / 2;

    if (this.autoUpdate != false) {
        var proj = this.toScreenPosition();
    }

    var x = 0,
        y = 0;

    switch (this.pivotPoint) {
        case 'top_left':
            x = proj.x + (this.hosptWidth / 2);
            y = proj.y + (this.hosptHeight / 2);
            break;
        case 'top':
            x = proj.x;
            y = proj.y + (this.hosptHeight / 2);
            break;
        case 'top_right':
            x = proj.x - (this.hosptWidth / 2);
            y = proj.y + (this.hosptHeight / 2);
            break;
        case 'right':
            x = proj.x - (this.hosptWidth / 2);
            y = proj.y;
            break;
        case 'bottom_right':
            x = proj.x - (this.hosptWidth / 2);
            y = proj.y - (this.hosptHeight / 2);
            break;
        case 'bottom':
            x = proj.x;
            y = proj.y - (this.hosptHeight / 2);
            break;
        case 'bottom_left':
            x = proj.x + (this.hosptWidth / 2);
            y = proj.y - (this.hosptHeight / 2);
            break;
        case 'left':
            x = proj.x + (this.hosptWidth / 2);
            y = proj.y;
            break;
        case 'center':
            x = proj.x;
            y = proj.y;
            break;
    }

    var rpx = -(halfWidth - (x + this.offset.x));
    var rpy = (halfHeight - (y - this.offset.y));

    this.mySprite.position.set(rpx, rpy, 0);
};

HotspotChild.prototype.checkIfBehindCamera = function(){

        var cameraFoward = this.camera.getWorldDirection();

        var vectorToHotspot = new THREE.Vector3();

        vectorToHotspot.subVectors(this.position, this.camera.position);

        if (cameraFoward.dot(vectorToHotspot) < 0) {
          this.mySprite.visible = false;
        }
        else {
            this.mySprite.visible = true;
        }
}

HotspotChild.prototype.toScreenPosition = function() {
    var vector = new THREE.Vector3();

    this.widthHalf = 0.5 * this.renderer.context.canvas.width;
    this.heightHalf = 0.5 * this.renderer.context.canvas.height;

    this.updateMatrixWorld();
    vector.setFromMatrixPosition(this.matrixWorld);

    vector.project(this.camera);

    vector.x = (vector.x * this.widthHalf) + this.widthHalf;
    vector.y = -(vector.y * this.heightHalf) + this.heightHalf;

    vector.x = (vector.x / window.devicePixelRatio);
    vector.y = (vector.y / window.devicePixelRatio);

    return {
        x: vector.x,
        y: vector.y
    };
};


HotspotChild.prototype.updateElementAlpha = function() {
    if (this.itsActive) {
        if (this.rangeAngle !== 360) {
            var angleDeg = Math.atan2(this.camera.position.z - this.position.z, this.camera.position.x - this.position.x) * 180 / Math.PI;
            var angle = angleDeg + 90 + this.directionAngle;

            if (angle > 360)
                angle = -(angle - 360);
            if (angle < 0)
                angle = 360 + angle;

            if (angle >= 180) {
                if (angle <= (this.rangeAngle + 180))
                    this.alpha = (((Math.abs((this.rangeAngle + 180) - angle) * 100)) / this.rangeAngle) / 100;
                else
                    this.alpha = 0;
            } else {
                if (angle >= (180 - this.rangeAngle))
                    this.alpha = (((Math.abs((360 - this.rangeAngle - 180) - angle) * 100)) / this.rangeAngle) / 100;
                else
                    this.alpha = 0;
            }

            if (angle <= 0)
                this.alpha = 0;

            this.mySprite.material.opacity = this.alpha;
        } else {
            this.mySprite.material.opacity = 1;
        }
    }
};

HotspotChild.prototype.set = function(img) {
	var HP = this;
	var texture;

    if (!img) {
    	throw "image url or texture not specified";
    }

	if (img instanceof THREE.Texture) {
	  texture = img;
	  texture.needsUpdate = true;
	  HP.hosptWidth = texture.image.width * HP.proportion;
      HP.hosptHeight = texture.image.height * HP.proportion;
      HP.mySprite.scale.set(HP.hosptWidth, HP.hosptHeight, 1);
	}

	else if (typeof img === "object") {
	  texture = HP.makeText(img);
	  texture.needsUpdate = true;
	  HP.hosptWidth = texture.image.width * HP.proportion;
      HP.hosptHeight = texture.image.height * HP.proportion;
      HP.mySprite.scale.set(HP.hosptWidth, HP.hosptHeight, 1);
	}

	else if (typeof img === "string") {
	  var loader = new THREE.TextureLoader();
	  texture = loader.load(img, function(texture) {
	      HP.hosptWidth = texture.image.width * HP.proportion;
	      HP.hosptHeight = texture.image.height * HP.proportion;
	      HP.mySprite.scale.set(HP.hosptWidth, HP.hosptHeight, 1);
      })
	}

	else {
		throw "image error";
	}

	this.mySprite.material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });    

    this.mySprite.material.oc = new THREE.Color(
        this.mySprite.material.color.r,
        this.mySprite.material.color.g,
        this.mySprite.material.color.b
    );

    this.update();
};

HotspotChild.prototype.disable = function() {
    this.itsActive = false;
};

HotspotChild.prototype.enable = function() {
    this.itsActive = true;
};

HotspotChild.prototype.hide = function() {
    this.mySprite.material.opacity = 0;
};

HotspotChild.prototype.show = function() {
    this.mySprite.material.opacity = 1;
};

HotspotChild.prototype.makeText = function (params) {

  var parameters = params || {};

  var text = parameters.hasOwnProperty("text") ? parameters.text : "";
  var width = parameters.hasOwnProperty("width") ? parameters.width : '256';
  var height = parameters.hasOwnProperty("height") ? parameters.height : '128';
  var fontSize = parameters.hasOwnProperty("fontSize") ? parameters.fontSize : '10pt';
  var fontFamily = parameters.hasOwnProperty("fontFamily") ? parameters.fontFamily : 'sans-serif';
  var color = parameters.hasOwnProperty("color") ? parameters.color : 'red';
  var fontWeight = parameters.hasOwnProperty("fontWeight") ? parameters.fontWeight : 'Normal';
  var textAlign = parameters.hasOwnProperty("textAlign") ? parameters.textAlign : 'center';
  var textBaseline = parameters.hasOwnProperty("textBaseline") ? parameters.textBaseline : 'middle';

  var canvas = document.createElement('canvas');

  // set canvas size
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  var context = canvas.getContext('2d');

  context.font = fontWeight + " " + fontSize + ' ' + fontFamily;
  context.textAlign = textAlign;
  context.textBaseline = textBaseline;
  context.fillStyle =  color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  return new THREE.Texture(canvas) ;
}

// check if argument is a valid function
function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

// create a unique identifier
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

