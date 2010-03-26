
/*
NOTES:
overflow: hidden doesnt work in mozilla for container objects inside with overflow auto or scroll
overflow doesnt work in IE in compliant mode for container children if parent container has position:relative

*/
function jsWindow(idWindow, parentObj, title, width, height,icon,posx,posy)
{
	
	this.idWindow = idWindow;
	this.parentObj = parentObj;
	/*
	 * references an instance of jsWindowContainer
	 */
	this.containerNode = null;
	/*
	 * node object that encapsules the window when docked in a window container
	 * check class cNode for details
	 */
	this.title = title;
	this.width = width;
	this.height = height;
	this.oheight = height;
	this.owidth = width;
	this.icon =(icon === null)?myGuiManager.getDefaultIcon():icon;
	this.posx = posx;
	this.posy = posy;
	this.active = true;
	this.content = null;
	this.HTMLObject = null;
	this.docked = false;
	
	this.setPosition = function(x,y)
	{
		this.HTMLObject.style.left = x+"px";
		this.HTMLObject.style.top = y+"px";
		this.posx = x;
		this.posy = y;
	};
	
	this.getPosition = function()
	{
		return [this.posx,this.posy];
	};
	this.restoreSize = function()
	{
		this.setWidth(this.owidth);
		this.setHeight(this.oheight);
	};
	this.isDocked = function()
	{
		return this.docked;
	};
	this.Dock = function(bool)
	{
		this.docked = bool;
		//this.showMinButton(bool);
		this.showCloseButton(bool);	
	};
	this.getRect = function()
	{
		l = this.HTMLObject.style.left;
		t = this.HTMLObject.style.top;
		return [parseInt(l.substring(0,l.length - 2),10),parseInt(t.substring(0,t.length - 2),10),this.width,this.height];
	};
	this.notifyDrag = function()
	{
		if(this.parentObj !== null)
		{
			this.parentObj.onChildDrag(this);
		}
	};
	
	this.notifyDrop = function()
	{
		//if there is a container
		if(this.parentObj !== null)
		{
			this.parentObj.onChildDrop(this);
		}
	};
	
	this.setWidth = function(width)
	{
		this.width = width;
		document.getElementById(this.idWindow+"_client").style.width = this.getClientWidth()+"px";
		document.getElementById(this.idWindow+"_header").style.width = this.getHeaderWidth()+"px";
		//this.HTMLObject.style.width = this.width+"px";
	};
	
	this.setHeight = function(height)
	{
		this.height = height;
		document.getElementById(this.idWindow+"_client").style.height = this.getClientHeight()+"px";
		//this.HTMLObject.style.height = this.height+"px";
	};
	
	this.getHeight = function()
	{
		return this.height;
	};
	
	this.getWidth = function()
	{
		return this.width;
	};
	
	this.setZ = function(z)
	{
		
		this.HTMLObject.style.zIndex = z;	
	};
	
	this.getHTMLObject = function()
	{
		return this.HTMLObject;
	};
	
	this.getClientWidth = function()
	{
		//no padding no border no margin (CSS1 compliant)
		return this.width - 2*(myGuiManager.getClientPadding()+myGuiManager.getWindowBorderWidth());
	};
	
	this.getHeaderWidth = function()
	{
		//no padding no border no margin (CSS1 compliant)
		return this.width - 2*(myGuiManager.getWindowBorderWidth()) - 5;
	};
	
	this.getClientHeight = function()
	{
		//no padding no border no margin (CSS1 compliant)
		return this.height - myGuiManager.getWindowHeaderHeight() - 2*myGuiManager.getClientPadding()- 3*myGuiManager.getWindowBorderWidth();
		
	};
	
	this.setActiveLook = function()
	{
		h = document.getElementById(this.idWindow+"_header");
		if (h !== null)
		{
			h.style.background = myGuiManager.getActiveWindowHeaderBg();
		}
	}
	this.setInactiveLook = function()
	{
		h = document.getElementById(this.idWindow+"_header");
		if (h != null)
		{
			h.style.background = myGuiManager.getInactiveWindowHeaderBg();
		}
	}
		
	this.setContent = function(content)
	{
		
		this.content = content;
		content.setContainer(this);
		//TO DO :  do we need to destroy any previous content??? check for memory leaks and garbage collection in js
		
		if (this.HTMLObject != null) // if HTML instance of window already exists
		{
			this.redraw();
		}
		else
		{
			this.createCode();
			
		}
		
	}
	this.redraw = function() //redraws content
	{
		//should be changed to work with DOM objects instead of HTML text
		if (this.content != null)
		{
			document.getElementById(this.idWindow+"_client").innerHTML = this.content.getContent();
		}
	}
	
	this.scrollDown = function()
	{
		if (this.content != null)
		{
			client = document.getElementById(this.idWindow+"_client")
			client.scrollTop = client.scrollHeight;
			
		}
	}
	
	this.createWindow = function()
	{
			this.createMainContainer();			
			this.HTMLObject.innerHTML = this.code;
			document.body.appendChild(this.HTMLObject);					
	}
	
	this.createMainContainer = function()
	{
		this.HTMLObject = document.createElement('div');
		this.HTMLObject.setAttribute('id',this.idWindow);
		this.HTMLObject.style.cssText = "width:"+this.width+"px; position:absolute; left:"+this.posx+"px; top:"+this.posy+"px;"+myGuiManager.getWindowOpacity();//weird hack setAttribute doesnt work in IE for style
		this.HTMLObject.onmousedown = function()
		{
			myWindowManager.reorderWindows(this.id);//weird hack, setAttribute doesnt work in IE for events
			myWindowManager.checkResize();
		}		 
	}
	
	this.createCode = function()
	{
		if (this.content != null)
		{
			content = this.content.getContent();
		}
		else
		{
			content = "";
		}
		//width:"+this.width+"px;
		mainDivTag = "<div id='"+this.idWindow+"' style=' position:absolute; left:"+this.posx+"px; top:"+this.posy+"px;' onmousedown=myWindowManager.reorderWindows('"+this.idWindow+"')>"
		
		headerDivTag = "<div id='"+this.idWindow+"_header"+"' style='padding-left:5px; background:"+myGuiManager.getInactiveWindowHeaderBg()+"; height:"+myGuiManager.getWindowHeaderHeight()+"px ; width:"+this.getHeaderWidth()+"px; border:"+myGuiManager.getWindowBorderStyle()+"; overflow:auto'>"
		
		iconImageTag = "<IMG src='"+this.icon+"' align='left' onmousedown='return false'>"
		
		dragImageTag = "<IMG id='"+this.idWindow+"_drag"+"' src='"+myGuiManager.getWindowDragImage()+"'; style='cursor:move;' align='left' onmousedown=\"return dragWindow(\'"+this.idWindow+"\');\">"
	
		titleDivTag = "<div id ='"+this.idWindow+"_title' style='white-space:nowrap;float:left; cursor:default;text-overflow : ellipsis; overflow : hidden; width:60%' onmousedown='return false;'>"
		
		closeImageTag ="<IMG id='"+this.idWindow+"_close"+"' src='"+myGuiManager.getCloseOutImage()+"'; style='cursor:pointer;' align='right' onmouseover=\"this.src='"+myGuiManager.getCloseOverImage()+"'\" onmouseout= \"this.src= '"+myGuiManager.getCloseOutImage()+"'\" onmousedown=\"this.src='"+myGuiManager.getCloseDownImage()+"'\" onmouseup= myWindowManager.closeWindow('"+this.idWindow+"')>"

		minImageTag ="<IMG id='"+this.idWindow+"_min"+"' src='"+myGuiManager.getMinOutImage()+"'; style='cursor:pointer;' align='right' onmouseover=\"this.src='"+myGuiManager.getMinOverImage()+"'\" onmouseout=\" this.src= '"+myGuiManager.getMinOutImage()+"'\" onmousedown=\"this.src='"+myGuiManager.getMinDownImage()+"'\" onmouseup= myWindowManager.toggleMinimize('"+this.idWindow+"')>"
		
		clientDivTag = "<div id =\""+this.idWindow+"_client\" style=\" white-space:nowrap;padding:"+myGuiManager.getClientPadding()+"px; height:"+(this.height - myGuiManager.getWindowHeaderHeight() - 2*myGuiManager.getClientPadding()- 3*myGuiManager.getWindowBorderWidth()) +"px; width:"+this.getClientWidth()+"px; border-bottom:"+myGuiManager.getWindowBorderStyle()+";border-left:"+myGuiManager.getWindowBorderStyle()+";border-right:"+myGuiManager.getWindowBorderStyle()+"; overflow :auto; background:"+myGuiManager.getWindowClientAreaBg()+";\">"
		closeDivTag = "</div>"
		
		//outp = headerDivTag+"\n\r\t\t"+dragImageTag+"\n\r\t\t"+closeDivTag+"\n\r\t"+ clientDivTag+"\n\r"+content+"\n\r\t"+closeDivTag;

		outp = headerDivTag+"\n\r\t\t"+dragImageTag+"\n\r\t\t"+iconImageTag+"\n\r\t\t"+titleDivTag+"\n\r\t\t\t"+this.title+"\n\r\t\t"+closeDivTag+"\n\r\t\t"+closeImageTag+"\n\r\t\t"+minImageTag+"\n\r\t"+closeDivTag+"\n\r\t"+ clientDivTag+"\n\r"+content+"\n\r\t"+closeDivTag;
		this.code = outp;
		
	};
	this.showMinButton = function(bool)
	{
		var minButton = document.getElementById(this.idWindow+"_min");
		if (!bool)
		{
			minButton.style.display = "block";
		}
		else
		{
			minButton.style.display = "none";
		}
	};
	this.showCloseButton = function(bool)
	{
		var closeButton = document.getElementById(this.idWindow+"_close");
		if (!bool)
		{
			closeButton.style.display = "block";
		}
		else
		{
			closeButton.style.display = "none";
		}
	};
	
}
