// Backbone.js Parallax extension
//
// Initiated by: Lyndel Thomas (@ryndel)
// Source: https://github.com/backbone-ui/parallax
//
// Licensed under the MIT license:
// http://makesites.org/licenses/MIT

(function(_, Backbone) {

	// fallbacks
	if( _.isUndefined( Backbone.UI ) ) Backbone.UI = {};
	// Support backbone app (if available)
	var View = ( typeof APP != "undefined" && !_.isUndefined( APP.View) ) ? APP.View : Backbone.View;

	Backbone.UI.Parallax = View.extend({

		el : ".ui-parallax",

		options : {
			parallaxEl : "#parallax",
			speed: 1,
			//multiplier
			amount: 1,
			step: 1
		},

		initialize: function( options ){
			// fallbacks
			options = options || {};
			// binds
			_.bindAll(this, 'keyAction', 'onStopParallax');
			// extend options
			if( options.speed ) this.options.speed = options.speed;
			// var amt = this.options.amount;
			this.pause = true;
			// var orientation;
			// var parallax = this.options.parallaxEl;
			// start animation loop
			//this.tick();
			console.log("I'm parallaxing here");
			this.render();

			$(document).bind('keydown', this.keyAction);
			$(document).bind('keyup', this.onStopParallax);
			return View.prototype.initialize.call(this, options);
		},

		events: {
			// 'keydown': 'keyAction',
		},

		keyAction: function(e) {

			var code = e.keyCode || e.which;
				if( code === 37 ) {
					//console.log("left");
					this.move("left");
				}

				if ( code === 39 ) {
					//console.log("right");
					this.move("right");
				}

				if ( code === 38 ) {
					//console.log("up");
					this.move("up");
				}

				if ( code === 40 ) {
					//console.log("down");
					this.move("down");
				}
		},

		params: View.prototype.params || new Backbone.Model(),

		tick: function() {
			// rendering
			var self = this;
			this.render();
			// Do whatever
			window.requestAnimationFrame(function(){
				self.tick();
			});
		},

		preRender: function() {

		},

		//render: View.prototype.render || function() {
		render: function() {
			//if( this.pause ) return;
			//var amount = this.options.amount;
			//this.updateBackground(this.orientation, amount);
			this.preRender();
			this.postRender();
		},

		postRender: function() {
			var $el = $(this.el);
			var params = this.params.get("parallax") || {};
			//
			$el.addClass("ui-parallax");
			// count backgrounds
			var backgrounds = getStyle( $el[0], 'background-image').split(",");
			// find image sizes
			params.sizes = [];
			for( var i in backgrounds ){
				this._getSize( backgrounds[i], i );
			}
			params.count = backgrounds.length;
			//
			this.params.set({
				parallax: params
			});
		},

		onStartParallax: function(){
			this._parallaxAnimation();
		},

		onStopParallax: function(){
			this._parallaxReset();
		},
		// internal

		_parallaxAnimation: function() {
			var self = this;

			var random = ( new Date() ).getTime() + Math.abs( Math.random() * 1000 );
			// get params
			var params = this.params.get("parallax") || {};
			var direction = params.direction;
			var speed = this.options.speed || 1;
			// get existing positions;
			var positions = getStyle( $(this.el)[0], 'background-position');
			positions = positions.split(",");
			//
			var id = params.id || false;
			// set animation
			var parallax = $(this.options.parallaxEl)[0];
			// start
			var fromPos = "";
			// end
			var toPos = "";
			//
			for( var i = 0; i < params.count; i++ ){
				// first check that we have the image dimensions
				var size = params.sizes[i];
				if( !size ){
					// wait until all images are loaded
					return setTimeout(function(){
						self._parallaxAnimation();
					}, 200);
				}
				// start from the existing position
				pos = positions[i];
				// FIX: remove empty space
				pos = pos.split(" ");
				if( _.isEmpty( pos[0] ) ) pos.shift();
				var x = 0;
				var y = 0;
				var s = ( speed instanceof Array ) ? speed[i] : speed;
				switch( direction ){
					case "left":
						x = parseInt(pos[0]) + s * size[0] +"px";
						y = pos[1];
					break;
					case "right":
						x = parseInt(pos[0]) - s * size[0] +"px";
						y = pos[1];
					break;
				}

				fromPos += positions[i];
				toPos += x +" "+ y;
				//
				if( i < params.count-1 ){
					fromPos += ", ";
					toPos += ", ";
				}
			}
			// remove existing animation
			if( id ){
				this._parallaxReset();
			}
			// new id
			var sequence = ( new Date() ).getTime() + Math.round( Math.random() * 1000 );
			id = "ui-parallax-"+ sequence;
			// create new animation
			var cssAnimation = document.createElement('style');
			cssAnimation.setAttribute("id", id);
			cssAnimation.type = 'text/css';
			// css rules
			var rules = document.createTextNode('@-webkit-keyframes '+ id +' {'+
			'from { background-position: '+ fromPos +'; }'+
			'to { background-position: '+ toPos +'; } '+
			'} ' +"\n"+
			'#parallax {'+
			'	-webkit-animation-name: '+ id +';'+
			'	-webkit-animation-duration: 10s;'+
			'	-webkit-animation-timing-function: linear;'+
			'	-webkit-animation-iteration-count: infinite;'+
			'}'
			);
			cssAnimation.appendChild(rules);
			document.getElementsByTagName("head")[0].appendChild(cssAnimation);
			// update params
			params.id = id;
			params.running = true;
			this.params.set({
				parallax: params
			});
console.log("animation");
			//if ( direction == "left" || direction == "right" ) {
			//parallax.style.backgroundPosition =  a * 5 + "px bottom," + a * 4 + "px bottom, " + a * 3 + "px bottom," + a * 2 + "px bottom," + a * 1 + "px bottom";

		},

		_parallaxReset: function(){
			var params = this.params.get("parallax");
			var id = params.id;
			var existing = document.getElementById( id );
			if( existing ){
				// commit to the existing background position
				var positions = getStyle( $(this.el)[0], 'background-position');
				$(this.el).css("backgroundPosition", positions);
				// remove node
				existing.parentNode.removeChild( existing );
				// update params
				params.running = false;
				this.params.set({
					parrallax: params
				});
			}
		},

		updateBackground: function( o, a ) {
			var parallax = $(this.options.parallaxEl)[0];
			//console.log(parallax);

				if ( (o == "left") || (o == "right") ) {
					parallax.style.backgroundPosition =  a * 5 + "px bottom," + a * 4 + "px bottom, " + a * 3 + "px bottom," + a * 2 + "px bottom," + a * 1 + "px bottom";
				} else {
					parallax.style.backgroundPosition =  a * 5 + "px bottom," + a * 4 + "px bottom, " + a * 3 + "px bottom," + a * 2 + "px bottom," + a * 1 + "px bottom";
					// parallax.style.backgroundPosition =  "left" + this.amt * 5 + "px", "left" + this.amt * 4 + "px" , "left" + this.amt * 3 + "px" ,"left" + this.amt * 2 + "px" ,"left" + this.amt * 1 + "px";
				}
		},

		move: function( direction ) {
			var direction_change = false;
			var params = this.params.get("parallax");

			switch( direction ){
				case "left":
					direction_change = (params.direction !== "left");
					params.direction = "left";
				break;
				case "right":
					direction_change = (params.direction !== "right");
					params.direction = "right";
				break;
				case "up":
					direction_change = (params.direction !== "up");
					params.direction = "up";
				break;
				case "down":
					direction_change = (params.direction !== "down");
					params.direction = "down";
				break;
				default:
				break;
			}

			// update params
			this.params.set({
				parallax: params
			});

			// update animation only if we have to
			if( direction_change || !params.running ){
				this.onStartParallax();
			}
		},

		_getSize: function( css, order ){

			var self = this;
			// find "pure" url;
			var url = css.replace(/ |url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];

			var image = new Image();
			image.src = url;

			image.onload = function(){
				var params = self.params.get("parallax");
				params.sizes[order] = [this.width, this.height];
				self.params.set({
					parallax: params
				});
			}

		}

	});

	function getStyle(x, styleProp) {
		if (x.currentStyle) var y = x.currentStyle[styleProp];
		else if (window.getComputedStyle) var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
		return y;
	}

})(this._, this.Backbone);