/*
NOTES:
overflow: hidden doesnt work in mozilla for container objects inside with overflow auto or scroll
overflow doesnt work in IE in compliant mode for container children if parent container has position:relative

*/
//node layout

var _CENTER = 0;
var _NORTH = 1;
var _SOUTH = 2;
var _WEST = 3;
var _EAST = 4;



function cNode(id,parent,windowObj,position)
{
	this.id = id;
	this.height = (position < 3 && position > 0)?parent.height/2:parent.height; //north or south
	this.width = (position < 3)?parent.width:parent.width/2; //north or south or center
	this.leaf = true;
	this.parent = parent; //object reference
	this.windowObj = windowObj;
	this.windowObj.containerNode = this; //window gets a reference of the node its inserted in
	this.HTMLObject = null; //div element
	this.position = position;
	
	this.resize = function(vertical)
	{
		/*****to do*****/
		this.height = (vertical)?this.height*2:this.height; 
		this.width  = (vertical)?this.width:this.width*2; 
		this.HTMLObject.style.width = this.width+"px";
		if (this.windowObj)
		{
			this.windowObj.setHeight(this.height);
			this.windowObj.setWidth(this.width);
		}
		this.getCoords();
	}
	
	
	this.findAbsPos = function() 
	{
		var curleft = 0;
		var curtop = 0;
		var obj = this.HTMLObject;
		if (obj.offsetParent) 
		{
			curleft = obj.offsetLeft
			curtop = obj.offsetTop
			while (obj = obj.offsetParent) 
			{
				curleft += obj.offsetLeft
				curtop += obj.offsetTop
			}
		}
		return [curleft,curtop];
	}
	
	
	this.createContainer = function()
	{

			//create the new container			
			if (this.parent.setLeaf) // is this correct?
			{
				this.parent.setLeaf(false)// parent is not a leaf anymore
				this.parent.windowObj = null;
			}

			cssfloat = (this.position == _WEST)?"float:left;":"";			
			this.HTMLObject = document.createElement('div');
			this.HTMLObject.setAttribute('id',this.parent.id+"."+position);
			
			/*
			floated objects need a width!!
			If no width is set, the results can be unpredictable. Theoretically, a floated element with an undefined width should shrink to the widest element within it. This could be a word, a sentence or even a single character - and results can vary from browser to browser.
			*/
			//background: rgb("+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+");
			//the overflow hidden is strictly necessary for firefox to render the divs correctly
			this.HTMLObject.style.cssText = "overflow:hidden;width:"+this.width+"px;position:relative;" +cssfloat;//weird hack setAttribute doesnt work in IE for style
			
			//append container in new parent container
			parent.HTMLObject.appendChild(this.HTMLObject);
			
			//remove window from current parent (Body)
			if (this.windowObj.HTMLObject.parentNode)
			{
				this.windowObj.HTMLObject.parentNode.removeChild(this.windowObj.HTMLObject);	
			}
			//append and resize window in container
			this.HTMLObject.appendChild(this.windowObj.HTMLObject);
			
			//prepare window for insertion
			this.windowObj.HTMLObject.style.position = "relative";
			this.windowObj.HTMLObject.style.left = "";
			this.windowObj.HTMLObject.style.top = "";
			this.windowObj.setWidth(this.width);
			this.windowObj.setHeight(this.height);
			
			this.getCoords();
			
			
			
	}
	
	this.getCoords = function()
	{
			//this method needs to be called everytime a  node is resized or moved
			//absolute coordinates are calculated
			abscoord = this.findAbsPos();
			
			var x = abscoord[0];
			var y = abscoord[1];
			
			this.north = [x,y,this.width,this.height/4,_NORTH];
			this.south = [x,y + 3*this.height/4,this.width,this.height/4,_SOUTH];
			this.east = [x+ 3*this.width/4,y,this.width/4,this.height,_EAST];
			this.west = [x,y,this.width/4,this.height,_WEST];
			
			this.north2 = [x,y,this.width,this.height/2,_NORTH];
			this.south2 = [x,y + this.height/2,this.width,this.height/2,_SOUTH];
			this.east2 = [x + this.width/2,y,this.width/2,this.height,_EAST];
			this.west2 = [x,y,this.width/2,this.height,_WEST];
	}
	
	this.setLeaf = function(bool)
	{
		this.leaf = bool;
	}
	
	this.isParent = function()
	{
		return (!this.leaf)
	}
	this.pointIsNorth = function(point)
	{
		return ((point[0] > this.north[0] && point[0] < (this.north[0] + this.north[2])) && (point[1] > this.north[1] && point[1] < (this.north[1] + this.north[3])));		
	}
	this.pointIsSouth = function(point)
	{
		return ((point[0] > this.south[0] && point[0] < (this.south[0] + this.south[2])) && (point[1] > this.south[1] && point[1] < (this.south[1] + this.south[3])));		

	}
	this.pointIsEast = function(point)
	{
		return ((point[0] > this.east[0] && point[0] < (this.east[0] + this.east[2])) && (point[1] > this.east[1] && point[1] < (this.east[1] + this.east[3])));		
	}
	this.pointIsWest = function(point)
	{
		return ((point[0] > this.west[0] && point[0] < (this.west[0] + this.west[2])) && (point[1] > this.west[1] && point[1] < (this.west[1] + this.west[3])));		
	}
	
	this.getHotspot = function(point)
	{
		if(this.pointIsNorth(point))
		{
			return this.north2;
		}
		else if (this.pointIsSouth(point))
		{
			return this.south2;
		}
		else if (this.pointIsEast(point))
		{
			return this.east2;
		}
		else if (this.pointIsWest(point))
		{
			return this.west2;
		}
		else 
		{
			return null;// no match
		}
		
	}
	//node need to be created in correct order, N then S and West Then East
	this.createContainer();
}

/*Container Tree
It manages the layout of the elements inside the container.
each node of the tree is a DIV element.
each node can be in 1 of 2 states:

1.- Holding 1 Window : div contains one window
2.- Holding two other Nodes : div contains other 2 Divs

Child nodes can be laid out in 2 different ways:

1.- North-South
2.- East-West
*/
function cTree(mainContainer)
{
	
	this.container = mainContainer;
	this.nodeArray = new Array();

	this.getNodeById = function(id)
	{
		for (var i=0; i<this.nodeArray.length; i++)
			{
				if (this.nodeArray[i].id == id)
				{
					return this.nodeArray[i];
				}
			}
			return null;
	}
	//Inserts a new node in a given container, this container already contains a  window, so this window is moved down one level (to another new node)  next to the new node
	this.insertNode = function(parentId,windowObj, position)
	{		

		if (this.nodeArray.length)
		{
			
			parentObj = this.getNodeById(parentId);
			prevWindowObj = parentObj.windowObj; //window inside container
			
			//remove parent window from current parent 
			prevWindowObj.HTMLObject.parentNode.removeChild(prevWindowObj.HTMLObject);
			
			if(position == _NORTH || position == _WEST)
			{
				//new node needs to be inserted first
				this.nodeArray.push(new cNode(parentId+"."+"1",parentObj,windowObj,position)); //insert new window
				this.nodeArray.push(new cNode(parentId+"."+"2",parentObj,prevWindowObj,position + 1)); //relocate prev window
			}
			else  
			{
				//new node needs to be inserted last
				this.nodeArray.push(new cNode(parentId+"."+"1",parentObj,prevWindowObj,position - 1)); //relocate prev window
				this.nodeArray.push(new cNode(parentId+"."+"2",parentObj,windowObj,position)); //insert new window
			}	
		}
		else // root
		{
			
			this.nodeArray.push(new cNode(parentId+".0",this.container,windowObj,position)); //insert new window
		}
		
		
	
	}
	//removes the given window and makes the sibling node take the position of the parent.
	this.removeNode = function(node)
	{		
		//window needs to be removed
		var window = node.windowObj;
		window.HTMLObject.parentNode.removeChild(window.HTMLObject);
		//node container div needs to be removed
		node.HTMLObject.parentNode.removeChild(node.HTMLObject);
		//window needs to be resized , undocked,  absoluted and inserted in doc body.
		document.body.appendChild(window.HTMLObject);
		window.HTMLObject.style.position = "absolute";
		window.Dock(false);
		window.restoreSize();
		
		//sibling node needs to be removed  temporarily
		var siblingNodes = this.getSiblings(node.id); 
		
		if (siblingNodes.length)
		{
			var siblingNode = siblingNodes[0]; //one sibling at most... for now
			var siblingHTMLObj = siblingNode.HTMLObject; 
			
			
			
			//grandparent needs to be identified and parent needs to be removed 
			
			var grandParentHTMLObject = node.parent.parent.HTMLObject;
			var parentNodeHTMLObject = node.parent.HTMLObject;
			var parentPosition = node.parent.position;
			debugOut(parentNodeHTMLObject.style.cssFloat);
			
			/*-------MAL---------
			siblingHTMLObj.parentNode.removeChild(siblingHTMLObj);
			parentNodeHTMLObject.parentNode.removeChild(parentNodeHTMLObject);
			
			//sibling node needs to be inserted in parents place
			grandParentHTMLObject.appendChild(siblingHTMLObj);
			*/
			
			
			siblingNode.parent = siblingNode.parent.parent;// adopted by grandpa....
			var vertical = (siblingNode.position < 3);
			siblingNode.position = parentPosition; //takes dads position
			
			//sibling node needs to be resized recursively(sibling can be a tree in itself, so we need a recursive process that repositions and resizes all children nodes, either duplicatng heights or widths)
			
			this.resizeNode(siblingNode,vertical);
			
			//new code
			var f = parentNodeHTMLObject.style.float;
			grandParentHTMLObject.replaceChild(siblingHTMLObj,parentNodeHTMLObject);
			siblingHTMLObj.style.float = f; 
				
		}
		
		
		
		//node needs to be removed from list
		this.removeNodeFromList(node.id);	
	}
	
	this.resizeNode = function(node,vertical)
	{
		node.resize(vertical);
		dArr = this.getAllDescendants(node.id);
		debugOut("hijosss: "+dArr.length);
		
		for (var i=0; i<dArr.length; i++)
		{
			dArr[i].resize(vertical);
		}
		
	}		
	
	this.removeNodeFromList = function(nodeId)
	{
		for (var i=0; i<this.nodeArray.length; i++)
			{
				if (this.nodeArray[i].id == nodeId)
				{
					this.nodeArray.splice(i,1);
				}
			}
	}
	
	this.getAllDescendants = function(id)
	{
		
		var auxArray = new Array();
		
		for (var i=0; i<this.nodeArray.length; i++)
			{
				if (this.nodeArray[i].parent.id == id)
				{
					var cid = this.nodeArray[i].id;
					auxArray.push(this.nodeArray[i]);
					auxArray = auxArray.concat(this.getAllDescendants(cid));
					
				}
			}
		
		return auxArray;
	}
	
	this.getChildren = function(id)
	{
		var auxArray = new Array();
		
		for (var i=0; i<this.nodeArray.length; i++)
			{
				if (this.nodeArray[i].parent.id == id)
				{
					auxArray.push(this.nodeArray[i]);					
				}
			}
		
		return auxArray;
	}
	
	this.getSiblings = function(id)
	{
		var pId = (this.getNodeById(id)).parent.id;
		var arrSiblings = this.getChildren(pId);
		for (var i=0; i<arrSiblings.length; i++)
		{
			if (arrSiblings[i].id == id)
			{
					arrSiblings.splice(i,1);					
			}
		}
		return arrSiblings;	//1 element, as this is a binary tree  ....
	}
	
	this.getHotspot = function(point)
	{
		//maybe we can have an updated list of the leaves, updated every time a node is inserted or removed so we dont need to traverse the whole array
		hotspot = null;
		
		if (this.nodeArray.length)
		{
			for (var i=0; i<this.nodeArray.length; i++)
			{
				if (this.nodeArray[i].leaf)
				{
					hotspot = this.nodeArray[i].getHotspot(point)
					
					if (hotspot)
					{
						
						return [hotspot[0],hotspot[1],hotspot[2],hotspot[3],hotspot[4],this.nodeArray[i].id];
					}
				}
			}
		}
		else
		{
			r = this.container.getRect();
			hotspot = [r[0],r[1],r[2],r[3],_CENTER,"root"];
		}
		return hotspot;
	}
	
}

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
	}
	
	this.isInside = function(point)
	{		
		return ((point[0] > this.posx && point[0] < (this.posx + this.width)) && (point[1] > this.posy && point[1] < (this.posy + this.height)));
	}
		
	//called when a window is dropped inside the container
	this.insertWindow  = function(windowObj,parentNodeId,position)
	{		 
		windowObj.Dock(true);
		this.tree.insertNode(parentNodeId,windowObj, position);		 
	}
	
	//shows drop area
	this.createRectangle = function(r)
	{
		if ((!this.hotspot)||(r[0]!=this.hotspot[0]) || (r[1]!=this.hotspot[1]) || (r[2]!=this.hotspot[2]) || (r[3]!=this.hotspot[3]) )
		{			
			this.destroyRectangle();
			this.hotspot = r
			
			this.tempRect = document.createElement('div');
			this.tempRect.setAttribute('id',this.idWindow+"_tempRect");
			this.tempRect.style.cssText = "border:"+myGuiManager.getDockBorderStyle()+"width:"+(r[2]- 2*myGuiManager.getDockBorderWidth()) +"px;height:"+(r[3]- 2*myGuiManager.getDockBorderWidth())+"px; position:absolute; left:"+r[0]+"px; top:"+r[1]+"px;"+myGuiManager.getDockBorderOpacity();//weird hack setAttribute doesnt work in IE for style
			document.body.appendChild(this.tempRect);
			this.tempRect.style.zIndex = 1000;
			debugOut("Rectangle Created..." + this.hotspot);
		}		
	}
	
	this.destroyRectangle = function()
	{
		if (this.tempRect)
		{
			debugOut("Rectangle Destroyed...");
			document.body.removeChild(this.tempRect);
			this.tempRect = null;
			this.hotspot = null;
		}
	}
	
	this.getRect = function()
	{		
		l = this.HTMLObject.style.left;
		t = this.HTMLObject.style.top;
		return [parseInt(l.substring(0,l.length - 2)),parseInt(t.substring(0,t.length - 2)),this.width,this.height]
	}
	
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
	
	}
	this.onChildDrop = function(childWindow)
	{
		if (this.isInside(childWindow.getPosition()))
		{
			
			if (this.hotspot)
			{
				this.insertWindow(childWindow,this.hotspot[5],this.hotspot[4])
				this.destroyRectangle();
			}
		}
	}
	
	this.setWidth = function(width)
	{
		
		this.width = width;
		
		this.HTMLObject.style.width = this.width+"px";
	}
	
	this.getHeight = function()
	{
		return this.height;
	}
	this.getWidth = function()
	{
		return this.width;
	}
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
		//border:1px solid;
		//background: rgb(0,0,0);
		this.HTMLObject.style.cssText = " position:absolute; width:"+this.width+"px; height:"+this.height+"px; left:"+this.posx+"px; top:"+this.posy+"px; "+myGuiManager.getWindowContainerOpacity();//weird hack setAttribute doesnt work in IE for style
	}
		
}
