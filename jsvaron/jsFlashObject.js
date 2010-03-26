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
		outp = "<center><embed  allownetworking='internal' src='"+this.value+"' type='application/x-shockwave-flash' wmode='transparent' width='"+this.width+"' height='"+this.height+"'></center>"
		 
		return outp;
	}
	
	
}