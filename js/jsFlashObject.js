function jsFlashObject (width,height, value)
{

	this.container = null;
	this.width = width;
	this.height = height
	this.value = value



	this.setContainer = function(container)
	{
			this.container = container;
	}

	this.getContent = function()
	{
		return this.getHTML()
	}

	this.contentChanged = function()
	{
			this.container.redraw();
	}

	this.getHTML = function()
	{
		//to do: add text properties to the syle attribute

		outp = '<object width="'+this.width+'" height="'+this.height+'"><param name="movie" value="'+this.value+'"></param><param name="allowFullScreen" value="false"></param><param name="allowscriptaccess" value="always"></param><embed src="'+this.value+'" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="false" width="'+this.width+'" height="'+this.height+'"></embed></object>';

		return outp;
	}


}