/*
PartialViewSLider: https://github.com/VeeK727/partialViewSlider
Author: Vipul Kapoor (@MrVipulKapoor)
Licenced under: MIT License

Copyright (c) 2018 Vipul Kapoor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

;(function ($, window, doucment, undefined) {
	var pluginName = 'partialViewSlider',
    defaults = {
    	auto: false,
      delay: 4000,
      controls: true,
      controlsPosition: 'inside', //inside, outside, neighbors
      prevHtml: '<i class="material-icons">chevron_left</i>',
      nextHtml: '<i class="material-icons">chevron_right</i>',
      width: 70,
      transitionSpeed: 400,
      backdrop: true,
      perspective: false,
      pauseOnHover: true,
      keyboard: true,
      onLoad: function() {},
      onSlideEnd : function() {}
    };

  function Plugin( element, options ) {
    this.element = element;
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  $.extend( Plugin.prototype, {
		init: function() {
			var self, el;
			self = this;

    	el = $(this.element);
	    el.wrap('<div class="partialViewSlider-outerwrapper"><div class="partialViewSlider-wrapper"></div></div>');

	    this.outerWrapper = el.closest('.partialViewSlider-outerwrapper'),
	    this.wrapper = el.closest('.partialViewSlider-wrapper');

	    if(this.options.controlsPosition == 'outside'){
	    	$(this.outerWrapper).addClass('partialViewSlider-outsideControls');
	    } else if(this.options.controlsPosition == 'neighbors'){
	    	$(this.outerWrapper).addClass('partialViewSlider-neighborControls');
	    }

	    var first_slide = el.find("li").slice(0,2),
		  	last_slide = el.find("li").slice(-2);
		  el.prepend(last_slide.clone().addClass('partialViewSlider-clone'));
		  el.append(first_slide.clone().addClass('partialViewSlider-clone'));

	    if(this.options.perspective){
	    	$(this.wrapper).addClass('partialViewSlider-perspective');
	    }

	    if(this.options.controls){
		    $(this.outerWrapper).append('<a href="#" class="partialViewSlider-nav partialViewSlider-prev">'+this.options.prevHtml+'</a>');
		    $(this.outerWrapper).append('<a href="#" class="partialViewSlider-nav partialViewSlider-next">'+this.options.nextHtml+'</a>');
		  }

	    if(this.options.backdrop){
		    $(this.wrapper).append('<div class="partialViewSlider-backdrop"></div>');
		    $(this.wrapper).append('<div class="partialViewSlider-backdrop partialViewSlider-right"></div>');
		  }

		  self.calculateNumbers();

	    setTimeout(function() {
	    	el.css('transition-duration', self.options.transitionSpeed+'ms');
	    	$(self.slides).css('transition-duration', self.options.transitionSpeed+'ms');
	    }, 20);

	    if(this.options.auto){
	    	self.looper = setInterval(function(){
	    		self.moveSlider('forward');
	    	}, this.options.delay);

	    	if(this.options.pauseOnHover){
	    		$(self.wrapper).on('mouseenter', function(){
	    			clearInterval(self.looper);
	    		});
	    		$(self.wrapper).on('mouseleave', function(){
	    			self.looper = setInterval(function(){
			    		self.moveSlider('forward');
			    	}, self.options.delay);
	    		});
	    	}
	    }

	    $(this.outerWrapper).on('click', '.partialViewSlider-next', function(e){
	    	e.preventDefault();
	    	self.moveSlider('forward');
	    });

	    $(this.outerWrapper).on('click', '.partialViewSlider-prev', function(e){
	    	e.preventDefault();
	    	self.moveSlider('backward');
	    });

	    if(this.options.keyboard){
	    	$(document).on('keyup', function(e){
          if(!$(':focus').is('input, textarea')) {
            if (e.keyCode === 37) {
              self.moveSlider('backward');
            } else if (e.keyCode === 39) {
              self.moveSlider('forward');
            }
          }
        });
	    }

	    var resize;
	    $(window).on('resize orientationchange', function(){
	    	clearTimeout(resize);
	    	resize = setTimeout(function() {
	    		self.calculateNumbers();
	    	}, 500);
	    });

	    this.options.onLoad.call(el);
	  },
	  calculateNumbers: function(){
	  	var el = $(this.element);

	    this.slides = el.find('li');
	  	this.numElements = this.slides.length,
    	this.numSlides = this.numElements-4,
    	this.wrapperWidth = $(this.wrapper).width(),
    	this.slideWidth = this.wrapperWidth*(this.options.width)/100,
    	this.sideWidth = this.wrapperWidth*((100 - this.options.width)/2)/100;
	    el.width(this.numElements*this.slideWidth);
	    $(this.slides).width(this.slideWidth);

	    this.index = 0;
	    this.slideMovement = this.wrapperWidth*this.options.width/100;
	    this.firstMovement = this.currentPosition = -(this.slideWidth-this.sideWidth+this.slideWidth);
	    el.css('transform', 'translateX('+(this.firstMovement)+'px)');
	    $(this.slides[2]).addClass('active');

	    el.siblings('.partialViewSlider-backdrop').css('width', this.sideWidth);
	  },
	  moveSlider: function(direction){
	  	var self = this;
	  	var el = $(this.element);

    	if(direction == 'forward'){
	    	this.index++;
	    	this.currentPosition -= this.slideWidth;
    	} else if(direction == 'backward'){
	    	this.index--;
	    	this.currentPosition += this.slideWidth;
    	}
    	$(this.slides[this.index+2]).addClass('active').siblings().removeClass('active');
    	el.css('transform', 'translateX('+this.currentPosition+'px)');

    	setTimeout(function() {
	    	if(self.index > self.numSlides-1){
	    		self.index = 0;
	    		self.currentPosition = self.firstMovement;
	    		var loop = true;
	    	} else if(self.index < 0){
	    		self.index = self.numSlides-1;
	    		self.currentPosition -= self.numSlides*self.slideWidth;
	    		var loop = true
	    	} else {
	    		var loop = false;
	    	}
	    	if(loop){
	    		$(self.slides).css('transition-duration', '0ms');
	    		$(self.slides[self.index+2]).addClass('active');
	    		el.css({
	    			'transition-duration': '0ms',
	    			'transform': 'translateX('+self.currentPosition+'px)'
	    		});
	    		setTimeout(function() {
	    			el.css('transition-duration', self.options.transitionSpeed+'ms');
	    			$(self.slides).css('transition-duration', self.options.transitionSpeed+'ms');

	    		}, 20);
	    	}

    		self.options.onSlideEnd.call(self.element);
    	}, this.options.transitionSpeed);
	  },
	  prev: function(){
	  	this.moveSlider('backward');
	  },
	  next: function(){
	  	this.moveSlider('forward');
	  },
	  play: function(){
	  	var self = this;
	  	this.looper = setInterval(function(){
    		self.moveSlider('forward');
    	}, self.options.delay);
	  },
	  pause: function(){
	  	clearInterval(this.looper);
	  }
  });

  $.fn[pluginName] = function ( options ) {
  	var plugin;
    this.each(function () {
      plugin = $.data(this, 'plugin_' + pluginName);
	    if (!plugin) {
	      plugin = new Plugin(this, options);
	      $.data(this, 'plugin_' + pluginName, plugin);
	    }
    });

    return plugin;
  }
}(jQuery, window, document));