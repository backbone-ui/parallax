// Backbone.js Parallax extension
//
// Initiated by: Lyndel Thomas (@ryndel)
// Source: https://github.com/backbone-ui/parallax
//
// Licensed under the MIT license:
// http://makesites.org/licenses/MIT

(function($, _, Backbone) {

	// fallbacks
	if( _.isUndefined( Backbone.UI ) ) Backbone.UI = {};
	// Support backbone app (if available)
	var View = ( typeof APP != "undefined" && !_.isUndefined( APP.View) ) ? APP.View : Backbone.View;

	Backbone.UI.Parallax = View.extend({

		el : ".ui-parallax",

		options : {
			speed: 1, // the relative speed of the layers
			time: 10 // interval between loops ( in seconds )
		},

		initialize: function( options ){
			// fallbacks
			options = options || {};
			// binds
			_.bindAll(this, 'onStopParallax');
			// extend options
			if( options.speed ) this.options.speed = options.speed;
			//
			this.render();
			return View.prototype.initialize.call(this, options);
		},

		params: View.prototype.params || new Backbone.Model(),


		preRender: function() {

		},

		//render: View.prototype.render || function() {
		render: function() {
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

		startParallax: function( direction ){
			direction = direction || false;
			if( direction ){
				this.setParam({
					direction: direction
				});
			}
			// trigger event
			this.onStartParallax();
		},


		onStartParallax: function(){
			this._parallaxAnimation();
		},

		onStopParallax: function(){
			this._parallaxReset();
		},

		// updates params on the "namespace of the plugin
		setParam: function( data ){
			data = data || {};
			var params = this.params.get("parallax");
			params = _.extend({}, params, data);
			this.params.set({
				parallax: params
			});
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
			var parallax = $(this.el)[0];
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
			$(this.el).getPath() +' {'+
			'	-webkit-animation-name: '+ id +';'+
			'	-webkit-animation-duration: '+ this.options.time +'s;'+
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

	function getSelector( node ){
		// get tag name
		var selector = node.localName || node.tagName.toLowerCase();
		// add id
		var id = node.id || false;
		if( id ) selector += "#"+ id;
		// add classes
		var classes = node.classList;
		for(var i in classes){
			// FIX: classList contains methods too :P
			if( isNaN(i) ) continue;
			selector += "."+ classes[i];
		}

		return selector;
	}

	$.fn.getPath = function () {
		if (this.length != 1) throw 'Requires one element.';

		var path, $el = this, node = $el[0], parent = $el.parent()[0];

		// get selector for parent & el...
		path = getSelector( parent ) +" > "+ getSelector( node );

		//that should be enough?
		return path;
	};

})(this.$, this._, this.Backbone);