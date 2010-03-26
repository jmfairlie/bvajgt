function jsTextField (text)
{
	
	this.container = null;
	this.text = text||"";
	this.font = null;
	
	
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
		outp = this.text
		return outp;
	}
	
	this.setText = function(text)
	{
		this.text = text;
		this.contentChanged();
	}
	this.newLine = function()
	{
		this.appendText("<BR>");
	}
	this.appendText = function(text)
	{
		this.text += text;	
		this.contentChanged();
	}
	
	this.setFont = function(font)
	{
		this.font = font;
		this.contentChanged();		
	}
	
}