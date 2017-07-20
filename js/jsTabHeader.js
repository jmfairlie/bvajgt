/**
 * @author JEAN
 */
function jsTabHeader(width, height, pNode)
{
	this.width = width;
	this.height = height;
	this.HTMLObject = null;
	this.tabList  = new Array();
	this.parentNode = pNode;
	
	this.setHeight = function(height)
	{
		this.height = height;
	};
	
	this.setWidth = function(width)
	{
		this.width = width;
		this.HTMLObject.style.width = this.width+"px";
	};
	
	this.create = function()
	{
		this.HTMLObject = document.createElement('div');
		this.HTMLObject.style.width = this.width+"px";
		this.HTMLObject.style.height = this.height+"px";
	};
	this.insertTab = function(title, idWindow)
	{		
		var newTextNode = document.createElement('div');
		newTextNode.style.width = "80%";
		newTextNode.style.textOverflow = "ellipsis";
		newTextNode.style.whiteSpace = "nowrap";
		newTextNode.style.overflow = "hidden";
		newTextNode.innerHTML = title;
		
		var newTabNode = document.createElement('div');
		newTabNode.pNode = this.parentNode;
		newTabNode.idWindow = idWindow;
		newTabNode.style.width = "20%";//this.width/4+"px";
		newTabNode.style.backgroundColor = myGuiManager.getInactiveWindowHeaderBg();
		newTabNode.style.height = "20px";
		newTabNode.style.border = "1px solid black";
		newTabNode.style.overflow = "hidden";
		newTabNode.style.cssFloat = "left";
		newTabNode.onmousedown =  function ()
		{
			this.pNode.selectTab(this.idWindow);
		};
		newTabNode.appendChild(newTextNode);
		this.HTMLObject.appendChild(newTabNode);
	};
	this.create();
}