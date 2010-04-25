/**
 * @author JEAN
 */
function cNode(id,parent,windowObj,position)
{
	this.id = id;
	this.height = (position < 3 && position > 0)?parent.height/2:parent.height; //north or south
	this.width = (position < 3)?parent.width:parent.width/2; //north or south or center
	this.leaf = true;
	this.parent = parent; //node object reference
	this.windowObj = windowObj;
	this.windowObj.containerNode = this; 
	//window gets a reference of the node its inserted in
	this.HTMLObject = null; //div element
	this.position = position;
	this.tabbed = false;
	this.windowList = null;
	this.activeTab = 0;
	this.tabHeader = null;
	
	this.selectTab = function(idWindow)
	{
		this.windowList[this.activeTab].show(false);
		for(var i=0; i<this.windowList.length; i++)
		{
			if(this.windowList[i].idWindow==idWindow)
			{
				this.activeTab = i;
				this.windowList[i].show(true);			
			}	
		}
	};
	this.insertTab = function(newWindowObj)
	{
		
		if(!this.tabbed)
		{
			this.windowList = new Array();
			this.windowList.push(this.windowObj);//add original window to list
			this.windowObj.showHeader(false);
			this.windowObj.show(false);//display none
			this.tabHeader = new jsTabHeader(this.width,myGuiManager.getWindowHeaderHeight()+ 2, this);
			this.HTMLObject.insertBefore(this.tabHeader.HTMLObject,this.windowObj.HTMLObject);
			this.tabHeader.insertTab(this.windowObj.title,this.windowObj.idWindow);
			this.tabbed = true;
		}
		else
		{
			this.windowList[this.windowList.length- 1].show(false);//display none
		}
		
		this.windowList.push(newWindowObj);//add new window to list
		this.activeTab = this.windowList.length- 1;
		this.tabHeader.insertTab(newWindowObj.title,newWindowObj.idWindow);
			
		//prepare window for insertion
		newWindowObj.HTMLObject.style.position = "relative";
		newWindowObj.HTMLObject.style.left = "";
		newWindowObj.HTMLObject.style.top = "";
		newWindowObj.setWidth(this.width);
		newWindowObj.setHeight(this.height);
		newWindowObj.showHeader(false);
		
		//append window in container
		this.HTMLObject.appendChild(newWindowObj.HTMLObject);
		
	};
	
	this.resize = function(vertical)
	{
		this.height = (vertical)?this.height*2:this.height; 
		this.width  = (vertical)?this.width:this.width*2; 
		this.HTMLObject.style.width = this.width+"px";
		this.resizeWindow();
		this.getCoords();
	};
	
	this.resizeWindow = function()
	{
		 if (this.windowObj)
		{
			
			if(this.tabbed)
			{
				alert('FOFOX');
				this.tabHeader.setWidth(this.width);
				for(var i=0; i< this.windowList.length; i++)
				{
					alert('FOFO');
					this.windowList[i].setHeight(this.height);
					this.windowList[i].setWidth(this.width);
				}
			}
			else
			{
				
				this.windowObj.setHeight(this.height);
				this.windowObj.setWidth(this.width);
			}
		}
	};	
	
	this.findAbsPos = function() 
	{
		var curleft = 0;
		var curtop = 0;
		var obj = this.HTMLObject;
		if (obj.offsetParent) 
		{
			curleft = obj.offsetLeft;
			curtop = obj.offsetTop;
			while ((obj = obj.offsetParent) !== null ) 
			{
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;	
			}
		}
		return [curleft,curtop];
	};	
	
	this.createContainer = function()
	{

			//create the new container			
			if (this.parent.setLeaf)//if the method exists
			{
				this.parent.setLeaf(false);// parent is not a leaf anymore
			}	

			cssfloat = (this.position == _WEST)?"float:left;":"";			
			this.HTMLObject = document.createElement('div');
			this.HTMLObject.setAttribute('id',this.parent.id+"."+position);
			
		   /*
			*	floated objects need a width!!
			*	If no width is set, the results can be unpredictable. 
			*   Theoretically, a floated element with an undefined width should shrink to the widest 
			*   element within it. This could be a word, a sentence or even a single character - and 
			*   results can vary from browser to browser.
			*   the overflow hidden is strictly necessary for firefox to render the divs correctly
			*/
			
			this.HTMLObject.style.cssText = "overflow:hidden;width:"+this.width+"px;position:relative;" +cssfloat;
			//weird hack setAttribute doesnt work in IE for style
			
			//append new container in  parent container
			parent.HTMLObject.appendChild(this.HTMLObject);
			
			//remove window from current DOM parent 
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
	};
	
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
			this.center =[x+ this.width/4, y+ this.height/4,this.width/2,this.height/2,_CENTER];
			
			this.north2 = [x,y,this.width,this.height/2,_NORTH];
			this.south2 = [x,y + this.height/2,this.width,this.height/2,_SOUTH];
			this.east2 = [x + this.width/2,y,this.width/2,this.height,_EAST];
			this.west2 = [x,y,this.width/2,this.height,_WEST];
			this.center2 = [x,y,this.width,this.height,_CENTER];
	};
	
	this.setLeaf = function(bool)
	{
		this.leaf = bool;
	};
	
	this.isParent = function()
	{
		return (!this.leaf);
	};
	this.pointIsNorth = function(point)
	{
		return ((point[0] > this.north[0] && point[0] < (this.north[0] + this.north[2])) && (point[1] > this.north[1] && point[1] < (this.north[1] + this.north[3])));		
	};
	this.pointIsSouth = function(point)
	{
		return ((point[0] > this.south[0] && point[0] < (this.south[0] + this.south[2])) && (point[1] > this.south[1] && point[1] < (this.south[1] + this.south[3])));		

	};
	this.pointIsEast = function(point)
	{
		return ((point[0] > this.east[0] && point[0] < (this.east[0] + this.east[2])) && (point[1] > this.east[1] && point[1] < (this.east[1] + this.east[3])));		
	};
	this.pointIsWest = function(point)
	{
		return ((point[0] > this.west[0] && point[0] < (this.west[0] + this.west[2])) && (point[1] > this.west[1] && point[1] < (this.west[1] + this.west[3])));		
	};
	
	this.pointIsCenter = function(point)
	{
		return ((point[0] > this.center[0] && point[0] < (this.center[0] + this.center[2])) && (point[1] > this.center[1] && point[1] < (this.center[1] + this.center[3])));		
	};
	
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
		/*else if (this.pointIsCenter(point))
		{
			return this.center2;
		}*/
		else 
		{
			return null;// no match
		}
		
	};
	//node need to be created in correct order, N then S and West Then East
	this.createContainer();
}
