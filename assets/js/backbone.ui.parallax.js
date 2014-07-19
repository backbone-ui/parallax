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

		el : '.main',

		options : {
			parallaxEl : "#parallax",
			amount: 1,
			step: 1
		},

		initialize: function( options ){
			var self = this;
			
			// var amt = this.options.amount;
			// var pause = true;
			// var orientation;
			// var parallax = this.options.parallaxEl;
			// start animation loop	
			// this.tick();
			console.log("I'm parallaxing here");
			
			
			
    		_.bindAll(this, 'keyAction');
    		$(document).bind('keydown', this.keyAction);
			
			
			
			

			return View.prototype.initialize.call(this, options);
		},

		events: {
			// 'keydown': 'keyAction',
		},
		
		keyAction: function(e) {
			
        	var code = e.keyCode || e.which;
				if( code === 37 ) { 
					console.log("left");
            		// this.move("left");
        		}
				
				if ( code === 39 ) {
					console.log("right");
					// this.move("right");
				}
				
				if ( code === 38 ) {
					console.log("up");
					// this.move("up");
				}
				
				if ( code === 40 ) {
					console.log("down");
					// this.move("down");
				}
		},
		
		tick: function() {
			// rendering
  			this.render();
  			// Do whatever
  			window.requestAnimationFrame(this.tick);
		},
		
		render: function() {
			if( this.pause ) return;
			this.updateBackground(this.orientation, this.amt);
		},
		
		updateBackground: function( o, a ) {
			console.log(o);
				if ( (o == "left") || (o == "right") ) {
					parallax.style.backgroundPosition =  this.amt * 5 + "px bottom," + this.amt * 4 + "px bottom, " + this.amt * 3 + "px bottom," + this.amt * 2 + "px bottom," + this.amt * 1 + "px bottom";
				} else {
					parallax.style.backgroundPosition =  this.amt * 5 + "px bottom," + this.amt * 4 + "px bottom, " + this.amt * 3 + "px bottom," + this.amt * 2 + "px bottom," + this.amt * 1 + "px bottom";
					// parallax.style.backgroundPosition =  "left" + this.amt * 5 + "px", "left" + this.amt * 4 + "px" , "left" + this.amt * 3 + "px" ,"left" + this.amt * 2 + "px" ,"left" + this.amt * 1 + "px";
				}
		},
		
		move: function( direction ) {
			switch( direction ){
				case "left":
					amt += this.options.step;
					orientation = "left";
					pause = false;
				break;
				case "right":
					amt -= this.options.step;
					orientation = "right";
					pause = false;
				break;
				case "up":
					amt += this.options.step;
					orientation = "up";
					pause = false;
				break;
				case "down":
					amt -= this.options.step;
					orientation = "down";
					pause = false;
				break;
				default:
					pause = true;
				break;
			}
		},
		
		
		
	
		
		
		
		
		

		

		/*postRender: function() {
			
		}*/
	});

})(this._, this.Backbone);