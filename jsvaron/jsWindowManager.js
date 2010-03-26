var tempX,tempY;
var dragW = null; //this should reference a window object instead of a string id in order to avoid so many getWindowObject Calls
var myGuiManager = new guiManager();
var myWindowManager = new windowManager();
var rlr = false;
var rl = false;

function windowManager()
{
  this.windowList = new Array();
  //I dont think this method is being used at all. Please check
  this.notifyDrag = function(idWindow)
	{
		wObj = this.getWindowObject(idWindow);
		
		if (wObj !== null)
		{
			wObj.notifyDrag();
		}
	};
	//I dont think this method is being used at all. Please check
	this.notifyDrop = function(idWindow)
	{
		wObj = this.getWindowObject(idWindow);
		
		if (wObj !== null)
		{
			wObj.notifyDrop();
		}
	};
  
  this.checkResize = function()
  {
	if (rlr)
	{
		rl = true;
	}
  };
  this.stopResize = function()
  {
	rl = false;
  };
  this.getTopWindow = function()
  {
	if (this.windowList.length > 0)
	{
		return this.windowList[this.windowList.length-1]
	}
	return null;
  }
  
  this.createWindows = function()
  {
	for(var i = 0; i< this.windowList.length; i++)
	{
		
		this.windowList[i].createWindow('dynamicW'+i); 
		this.windowList[i].setZ(i*10)
		this.windowList[i].redraw();
	}
  }
  this.toggleMinimize = function(winId)
  {
	button = document.getElementById(winId +'_min');
	button.src= myGuiManager.getMinOverImage();
	client = document.getElementById(winId + '_client');
	if(client.style.display == 'none')
	{
		client.style.display = 'block'; 
	} 
	else 
	{ 
		client.style.display ='none';
		/*browser doesnt render this object so it won't capture events as opposed to 
		visibility false (on mozilla)*/
	}
  }
  
  this.closeWindow = function(winId)
  {
	
	button = document.getElementById(winId +'_close');
	button.src= myGuiManager.getCloseOverImage();
	win = document.getElementById(winId);
	win.style.display = 'none';
  }

  this.addWindow = function(windowObj)
  {
	this.windowList.push(windowObj);
	return this.windowList.length;
  }
  
  this.getWindowObject = function(idWindow)
  {
	for(var i = 0; i< this.windowList.length; i++)
	{
		if (this.windowList[i].idWindow == idWindow)
		{
			return this.windowList[i];
		}
	}
	return null;
  }
  this.reorderWindows = function(idWindow)
  {

	var found = false;
	var activeWindow = null;
	var numInactiveWindows = this.windowList.length - 1
	for(var i = 0; i < numInactiveWindows; i++)
	{		
		if (!found)
		{
			
			if (this.windowList[i].idWindow == idWindow)
			{
				activeWindow = this.windowList[i];				
				found = true;
				//alert(activeWindow.HTMLObject.style.zIndex)
			}
			
		}
		else// found
		{
			this.windowList[i].setZ((i- 1)*10); //assign new z-index
			this.windowList[i- 1] = this.windowList[i]; //push back
			
		}
	}
	
	if (found)
	{
		this.windowList[numInactiveWindows].setZ((numInactiveWindows- 1)*10)//separate each window 10 layers away from each other just in case
		this.windowList[numInactiveWindows].setInactiveLook();// previous active window
		this.windowList[numInactiveWindows-1] = this.windowList[numInactiveWindows]
		
		this.windowList[numInactiveWindows] = activeWindow; // put active window on top of the list
		activeWindow.setZ(numInactiveWindows*10);
	}
	//else do nothing because the window clicked was already active	
	this.windowList[numInactiveWindows].setActiveLook();
  }


}



function dragWindowHandler()
{

	 /*Mozilla based browsers receive the event object "e" as a parameter
	   for mozilla browsers you need to make sure when making an inline assignment 
	   of the function to a tag's event  you need to pass the word "event" as the function's parameter.
		
	   example:
		<TAG id="myTag"  onsomeevent = "yourFunction(event )"  >
	                 
		      When making a dot syntax assignment this is not necessary
					example:	  
					document.getElementById("myTag").onsomeotherevent = yourOtherFunction;
		
		    Event propagation works like this:
			
					if (window.event) event.cancelBubble=true
					else if (e.stopPropagation) e.stopPropagation()
					target = e.target != null ? e.target : e.srcElement;
	*/
	 if (dragW != null)
	 {
		 	 
	  
		 wind = myWindowManager.getWindowObject(dragW);

		 if (wind != null)
		   {
				
				wind.setPosition(tempX- 10,tempY- 10);				
				wind.notifyDrag();
				
		   }
			
	}

}






function intersectRect(rect1,rect2)
{
	return (rect2[0] > rect1[0]) && (rect2[0]< rect1[0] + rect1[2])&&(rect2[1] > rect1[1]) && (rect2[1]< rect1[1] + rect1[3]);
}

function mouseMoveHandler(e) 
{
	
		
	e = e||window.event;//IE event object 
	
	tempX = e.clientX;
	tempY = e.clientY;
	 
	dragWindowHandler(); //dragging functionality
	resizeWindowHandler(); //resize functionality
	
	
   return false;
}

function dragWindow(idWindow)
{
	dragW = idWindow;
	/*dragW is a global variable that stores the id of the window that is being dragged
	 * if null it means no window is being dragged at the moment
	 * 
	 * check global function dragWindowHandler
	 */
	
    wind = myWindowManager.getWindowObject(dragW);
	
	if (wind)
	{
		if (wind.isDocked())
		{
			wind.parentObj.removeNode(wind);
		}	
		wind.setPosition(tempX- 10,tempY- 10);
	}	
	return false;	
}

function dropWindow()
{
	myWindowManager.notifyDrop(dragW);
	dragW = null;
	return false;	
}

function guiManager()
{
	this.getClientPadding = function()
	{
		return 10;
	};
	this.getDefaultIcon = function()
	{
		return "./images/png/ie_16.png";
	};
	this.getActiveWindowHeaderBg = function()
	{
		return "rgb(21,42,246)";
	};
	
	this.getInactiveWindowHeaderBg = function()
	{
		return "rgb(166,172,223)";
	}
	this.getWindowBorderColor = function()
	{
		return "rgb(0,0,0)";
	}
	
	this.getWindowBorderStyle = function()
	{
		return "solid " +this.getWindowBorderWidth()+"px "+this.getWindowBorderColor();
	}
	
	this.getWindowBorderWidth = function()
	{
		return 1;
	}
	
	this.getWindowHeaderHeight = function()
	{
		return 20;
	}
	this.getMinOverImage = function()
	{
		return "./images/button/minOver.png";
	}
	this.getMinOutImage = function()
	{
		return "./images/button/minOut.png";
	}
	this.getMinDownImage = function()
	{
		return "./images/button/minDown.png";
	}
	
	this.getCloseOverImage = function()
	{
		return "./images/button/closeOver.png";
	}
	this.getCloseOutImage = function()
	{
		return "./images/button/closeOut.png";
	}
	this.getCloseDownImage = function()
	{
		return "./images/button/closeDown.png";
	}
	this.getWindowClientAreaBg = function()
	{
		return  "rgb(255,255,255)";//"url('./images/transparentpixel.png')";//
	}
	this.getWindowDragImage = function()
	{
		return "./images/button/drag.png";
	}
	this.getWindowOpacity = function()
	{
		return "";//"filter:alpha(opacity=50);-moz-opacity:.50;opacity:.50;"
	}
	this.getContainerOpacity = function()
	{
		return "";//"filter:alpha(opacity=30);-moz-opacity:.30;opacity:.30;"
	}
	this.getContainerBorderWidth = function()
	{
		return 5;//"";//
	};
	this.getContainerBorderStyle = function()
	{
		return "border:"+this.getContainerBorderWidth()+"px dashed;"//"";//
	};
	
	this.getDockBorderOpacity = function()
	{
		return "filter:alpha(opacity=70);-moz-opacity:0.7;opacity:0.7;"
	}
	this.getDockBorderWidth = function()
	{
		return 5;
	}
	this.getDockBorderColor = function()
	{
		return "rgb(0,0,255)";
	}
	this.getDockBorderStyle = function()
	{
		return this.getDockBorderWidth()+"px solid "+this.getDockBorderColor()+";"
	}
	 
}

function resizeWindowHandler()
{
	topWindow = myWindowManager.getTopWindow();
		
		if (!topWindow.isDocked())
		{
			t = topWindow.HTMLObject.style.left
			x1i = parseInt(t.substring(0,t.length - 2));
			x1f = x1i + 10;
			
			t = topWindow.getWidth();
			x2f = x1i + t;
			x2i = x2f - 10;
			
			t = topWindow.HTMLObject.style.top
			y1i = parseInt(t.substring(0,t.length - 2));
			y1f = y1i + 10;
			
			t = topWindow.getHeight();
			y2f = y1i + t;
			y2i = y2f - 10;
			
			
			if (!rl)
			{
				if (tempX > x1i+1  && tempX < x1f && tempY > y1i && tempY < y2f)
				{
					
					document.body.style.cursor = "w-resize";
					rlr = true;
				}
				else
				{
					document.body.style.cursor = "default";
					rlr = false;
					
				}
				
			}
			else
			{
				newWidth = x2f - tempX + 5;
				
				if (newWidth > 120)
				{
					topWindow.HTMLObject.style.left = parseInt(tempX) - 5 + "px";
					topWindow.setWidth(newWidth);
				}
			}
			return rl
	
		}
}

