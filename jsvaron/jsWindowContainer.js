/*
NOTES:
overflow: hidden doesnt work in mozilla for container objects inside with overflow auto or scroll
overflow doesnt work in IE in compliant mode for container children if parent container has position:relative
*/
function jsWindowContainer(idWindow, width, height,posx,posy)
{
	
	this.tree = new cTree(this);
	this.idWindow = idWindow;
	
	this.width = width;
	this.height = height;
	
	this.posx = posx;
	this.posy = posy;

	this.HTMLObject = null;
	this.tempRect = null;
	this.hotspot = null;
	
	this.removeNode = function(windowObj)
	{
		this.tree.removeNode(windowObj.containerNode);
	};
	
	this.isInside = function(point)
	{		
		return ((point[0] > this.posx && point[0] < (this.posx + this.width)) && (point[1] > this.posy && point[1] < (this.posy + this.height)));
	};
		
	//called when a window is dropped inside the container
	this.insertWindow  = function(windowObj,parentNodeId,position)
	{		 
		windowObj.Dock(true);
		this.tree.insertNode(parentNodeId,windowObj, position);		 
	};
	
	//shows drop area
	this.createRectangle = function(r)
	{
		if ((!this.hotspot)||(r[0]!=this.hotspot[0]) || (r[1]!=this.hotspot[1]) || (r[2]!=this.hotspot[2]) || (r[3]!=this.hotspot[3]) )
		{			
			this.destroyRectangle();
			this.hotspot = r;
			
			this.tempRect = document.createElement('div');
			this.tempRect.setAttribute('id',this.idWindow+"_tempRect");
			this.tempRect.style.cssText = "border:"+myGuiManager.getDockBorderStyle()+"width:"+(r[2]- 2*myGuiManager.getDockBorderWidth()) +"px;height:"+(r[3]- 2*myGuiManager.getDockBorderWidth())+"px; position:absolute; left:"+(r[0]+myGuiManager.getContainerBorderWidth())+"px; top:"+(r[1]+myGuiManager.getContainerBorderWidth())+"px;"+myGuiManager.getDockBorderOpacity();//weird hack setAttribute doesnt work in IE for style
			document.body.appendChild(this.tempRect);
			this.tempRect.style.zIndex = 1000;
			debugOut("Rectangle Created..." + this.hotspot);
		}		
	};
	
	this.destroyRectangle = function()
	{
		if (this.tempRect)
		{
			//debugOut("Rectangle Destroyed...");
			document.body.removeChild(this.tempRect);
			this.tempRect = null;
			this.hotspot = null;
		}
	};
	
	this.getRect = function()
	{		
		l = this.HTMLObject.style.left;
		t = this.HTMLObject.style.top;
		return [parseInt(l.substring(0,l.length - 2),10),parseInt(t.substring(0,t.length - 2),10),this.width,this.height];
	};
	
	this.onChildDrag = function(childWindow)
	{
		windowPos = childWindow.getPosition();
		
		hotspot = (this.isInside(windowPos))?this.tree.getHotspot(windowPos):null;
				
		if(hotspot)
		{
			this.createRectangle(hotspot);
		}
		else
		{
			this.destroyRectangle();
		}
	
	};
	
	this.onChildDrop = function(childWindow)
	{
		if (this.isInside(childWindow.getPosition()))
		{
			//if over a  hotspot
			if (this.hotspot)
			{
				//params: windowObj,nodeID, cardinal direction (_NORTH|_SOUTH|_EAST|_WEST)
				this.insertWindow(childWindow,this.hotspot[5],this.hotspot[4]);
				this.destroyRectangle();
			}
		}
	};
	
	this.setWidth = function(width)
	{
		
		this.width = width;
		
		this.HTMLObject.style.width = this.width+"px";
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
	}
	this.getHTMLObject = function()
	{
		return this.HTMLObject;
	}
	
	this.redraw = function() //redraws content
	{
		
		
	}
	
	this.createContainer = function(idParent)
	{
			this.createMainContainer();
			pObject = document.getElementById(idParent);
			pObject.appendChild(this.HTMLObject);
	}
	
	this.createMainContainer = function()
	{
		this.HTMLObject = document.createElement('div');
		this.HTMLObject.setAttribute('id',this.idWindow);
		
		this.HTMLObject.style.cssText = myGuiManager.getContainerBorderStyle()+" position:absolute; width:"+this.width+"px; height:"+this.height+"px; left:"+this.posx+"px; top:"+this.posy+"px; "+myGuiManager.getContainerOpacity();//weird hack setAttribute doesnt work in IE for style
		
	}
		
}
