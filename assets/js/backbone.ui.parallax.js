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
			this.pause = true;
			// var orientation;
			// var parallax = this.options.parallaxEl;
			// start animation loop
			//this.tick();
			console.log("I'm parallaxing here");
			_.bindAll(this, 'keyAction');
			$(document).bind('keydown', this.keyAction);
			return View.prototype.initialize.call(this, options);
		},

		events: {
			// 'keydown': 'keyAction',
		},

		/*postRender: function() {

		}*/

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

		render: function() {
			if( this.pause ) return;
			var amount = this.options.amount;
			this.updateBackground(this.orientation, amount);
		},

		_parallaxAnimation: function( direction ) {
			var random = ( new Date() ).getTime() + Math.abs( Math.random() * 1000 );
			// get params
			var params = this.params.get("parallax") || {};
			var id = params.id || false;
			// set animation
			var parallax = $(this.options.parallaxEl)[0];
			//console.log(parallax);
			// start
			var fromPos = "-100px 0";
			// end
			var toPos = "-100px 0";
			if ( direction == "left" ){
				// start
				var fromPos = "0 0";
				// end
				var toPos = "-100px 0";
			}
			if( direction == "right" ) {
				// start
				var fromPos = "0 0";
				// end
				var toPos = "100px 0";
			}

			// remove existing animation
			if( id ){
				var existing = document.getElementById( id );
				if( existing ) existing.parentNode.removeChild( existing );
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
			this.params.set({
				parallax: params
			});
console.log("animation");
			//if ( direction == "left" || direction == "right" ) {
			//parallax.style.backgroundPosition =  a * 5 + "px bottom," + a * 4 + "px bottom, " + a * 3 + "px bottom," + a * 2 + "px bottom," + a * 1 + "px bottom";


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
			var pause = true,
				amt = this.options.amount,
				orientation;

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

			this.options.amount = amt;
			// update animation only if we have to
			if( this.orientation != orientation ){
				this._parallaxAnimation( orientation );
			}
			this.orientation = orientation;
			this.pause = pause;

		},
	});

})(this._, this.Backbone);