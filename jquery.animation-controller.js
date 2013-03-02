/*!
 * Animation-controller jQuery plugin v0.1
 *
 * Copyright 2011 by filod <filod33@gmail.com>
 *
 * forked from  Pause by tobia  (https://github.com/tobia/Pause)
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 2 of the License, or(at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */
/* Changelog:
 *
 *
 */
(function($) {
	var cId = 'jQuery.animation-controller', 
	ffrate=rrate=0.1; //
	// Animations created synchronously will run synchronously
	var fxNow;
	
	function createFxNow() {
		setTimeout( clearFxNow, 0 );
		return ( fxNow = jQuery.now() );
	}
	
	function clearFxNow() {
		fxNow = undefined;
	}
	function now() {
		return new Date().getTime();
	}
	//override jQuery.fx.prototype.step to implement rewind & fast forward & pause
	$.fx.prototype.step = function(gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				
				
				//↓↓↓↓ code by filod ↓↓↓↓
				n = elem.pn ? elem.pn : t - this.startTime;
				if(elem.pausing){
					this.startTime = t - n;
					elem.pn = n;
					return true;
				}else{
					elem.pn = false;
				}
				if(elem.ff){
					var fftime = n+options.duration*ffrate;
					this.state = fftime / options.duration;
					elem.ff--;
					this.startTime -= options.duration*ffrate;
				}else if (elem.rewind){
					var rtime = ((n-options.duration*rrate)>0) ? (n-options.duration*rrate) : 0;
					this.state = rtime / options.duration;
					elem.rewind--;
					this.startTime += ((n-options.duration*rrate)>0) ? (options.duration*rrate) : 0;
				}else{
					this.state = n / options.duration;
				}
				//↑↑↑↑ code by filod ↑↑↑↑
				
				
				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	};
	$.fn.pause = function() {
		return this.each(function() {
			if(!this['pausing']){
				this.pausing = 1;	
			}
		});
	};
	$.fn.resume = function() {
		return this.each(function() {
			if(this['pausing']){
				this.pausing = 0;	
			}
		});
	};

	$.fn.fastForward = function() {
		
		return this.each(function() {
			if(!this.pausing){	
				if(!this['ff']){
					this.ff = 1;	
				}
			}
		}); 
	};
	$.fn.rewind = function() {

		return this.each(function() {
			if(!this.pausing){
				if(!this['rewind']){
					this.rewind = 1;
				}
			}
			
		});
	};
})(jQuery);
