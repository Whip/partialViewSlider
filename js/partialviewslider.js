/*
MIT License

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

(function ($) {
  $.fn.partialViewSlider = function(options) {
  	var settings = $.extend({
      // defaults.
      auto: true,
      delay: 4000,
      controlsPosition: 'inside',
      prevHtml: '<i class="material-icons">chevron_left</i>',
      nextHtml: '<i class="material-icons">chevron_right</i>',
      width: 70,
      transitionSpeed: 400,
      onSlideEnd : function() {
      	console.log('slide ended');
      }
    }, options);

  	this.each(function(){
	    var el = $(this);
	    el.wrap('<div class="partialViewSlider-outerwrapper"><div class="partialViewSlider-wrapper"></div></div>');

	    var outerWrapper = el.closest('.partialViewSlider-outerwrapper'),
	    	wrapper = el.closest('.partialViewSlider-wrapper'),
	    	numSlides = el.find('li').length,
	    	numElements = numSlides+4,
	    	wrapperWidth = wrapper.width(),
	    	slideWidth = wrapperWidth*(settings.width)/100,
	    	sideWidth = wrapperWidth*((100 - settings.width)/2)/100;
	    console.log(outerWrapper);
	    console.log(numSlides+' slides');
	    console.log(wrapperWidth+'px wrapper');
	    console.log(slideWidth+'px wide');

	    var first_slide = el.find("li").slice(0,2),
		  	last_slide = el.find("li").slice(-2);
		  el.prepend(last_slide.clone().addClass('partialViewSlider-clone'));
		  el.append(first_slide.clone().addClass('partialViewSlider-clone'));

	    el.width(numElements*slideWidth);
	    el.find('li').each(function(){
	    	$(this).width(slideWidth);
	    });

	    //first move
	    var index = 0;
	    var slideMovement = wrapperWidth*settings.width/100;
	    var firstMovement = currentPosition = -(slideWidth-sideWidth+slideWidth);
	    el.css('transform', 'translateX('+(firstMovement)+'px)');

	    outerWrapper.append('<a href="#" class="partialViewSlider-nav partialViewSlider-prev">'+settings.prevHtml+'</a>');
	    outerWrapper.append('<a href="#" class="partialViewSlider-nav partialViewSlider-next">'+settings.nextHtml+'</a>');
	    wrapper.append('<div class="partialViewSlider-backdrop" style="width:'+sideWidth+'px"></div>');
	    wrapper.append('<div class="partialViewSlider-backdrop partialViewSlider-right" style="width:'+sideWidth+'px"></div>');

	    function moveSlider(direction){
	    	if(direction == 'forward'){
		    	index++;
		    	currentPosition -= slideWidth;
	    	} else if(direction == 'backward'){
		    	index--;
		    	currentPosition += slideWidth;
	    	}
	    	console.log(index);
	    	el.css('transform', 'translateX('+currentPosition+'px)');
	    	setTimeout(function() {
		    	if(index > numSlides-1){
		    		index = 0;
		    		currentPosition = firstMovement;
		    		var loop = true;
		    	} else if(index < 0){
		    		index = numSlides-1;
		    		currentPosition -= numSlides*slideWidth;
		    		var loop = true
		    	} else {
		    		var loop = false;
		    	}
		    	if(loop){
		    		console.log(index);
		    		el.css({
		    			'transition-duration': '0ms',
		    			'transform': 'translateX('+currentPosition+'px)'
		    		});
		    		setTimeout(function() {
		    			el.css('transition-duration', settings.transitionSpeed+'ms');
		    		}, 20);
		    	}

	    		settings.onSlideEnd.call(el);
	    	}, settings.transitionSpeed);

	    }

	    if(settings.auto){
	    	setInterval(function(){
	    		moveSlider('forward');
	    	}, settings.delay);
	    }

	    outerWrapper.on('click', '.partialViewSlider-next', function(e){
	    	e.preventDefault();
	    	moveSlider('forward');
	    });

	    outerWrapper.on('click', '.partialViewSlider-prev', function(e){
	    	e.preventDefault();
	    	moveSlider('backward');
	    });
  	});

    return this;
  };
}(jQuery));