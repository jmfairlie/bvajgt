// Javascript source code desarrollado por el bien Varon - YAN -  a principios del 2007


function dummyContent(tree)
{
		tree.addChildren(1,0,"1",0);
	 	tree.addChildren(101,0,"1.1",1);
		tree.addChildren(10101,0,"1.1.1",101);
		tree.addChildren(10102,0,"1.1.2",101);
		tree.addChildren(1010101,0,"1.1.1.1",10101);
		tree.addChildren(1010102,0,"1.1.1.2",10101);
		tree.addChildren(1010103,0,"1.1.1.3",10101);
		tree.addChildren(1010104,0,"1.1.1.4",10101);	
		tree.addChildren(102,0,"1.2",1);
		tree.addChildren(103,0,"1.3",1);
		tree.addChildren(2,0,"2",0);
		tree.addChildren(3,0,"3",0);
		tree.addChildren(301,0,"3.1",3);
		tree.addChildren(301,0,"3.2",3);
		tree.addChildren(301,0,"3.3",3);
		tree.addChildren(4,0,"4",0);
}

function getIcon(type,style)
{
	
	//style not implemeted yet
	o = "";
	folder = "./images/png/"
	size = "16"
	ext = ".png"
	switch(type)
		{
				case 0:
					
					o+="configuration_"
					break;
				case 1:
					
					o+="dessin_"
					break;
				case 2:
					o+="disquette_"
					break;
				case 3:
					
					o+="Dossier2_"
					break;
				case 4:
					
					o+="dossier_"
					break;
				case 5:
					o+="mesdossier_"
					break;
				case 6:
					
					o+="MicrosoftOffice_"
					break;
				case 7:
					
					o+="msn_"
					break;
				case 8:
					o+="poubellepleine_"
					break;
				case 9:
					
					o+="thunderbird_"
					break;
				case 10:
					
					o+="zip_"
					break;
				case 11:
					o+="Winamp_"
					break;
				case 12:
					
					o+="thunderbird_"
					break;
				case 13:
					
					o+="thunderbird_"
					break;
				case 14:
					o+="thunderbird_"
					break;
		}
	return folder + o + size + ext;
}

function insertText(t, cid)
{
	x = document.getElementById(cid);

	if (x != null)
	{		
		x.innerHTML = t;
	}
}

function changeColor(obj, c)
{
	obj.style.color = c;
}

function changeFontWeight(obj, w)
{
	obj.style.fontWeight = w;
}

function changeDecoration(obj,uline)
{
  if (uline)
  obj.style.textDecoration = "underline";
  else
  obj.style.textDecoration = "none";
}

function jsTreeNode(code,type,name,parent)
{
    this.code = code;
    this.parent = parent;
    this.type = type;
    this.name = name;
	this.expanded = false;
       
}

function jsTree()
{
    
	this.root = new jsTreeNode(0,0,"root",-1);
    this.nodeList = new Array();
	this.nodeList.push(this.root);
	this.container = null;
	
	
	
	this.setContainer = function(container)
	{
			this.container = container;
	}
	
	this.getContent = function()
	{
		return this.getTree(this.root,0)
	}
	
	this.contentChanged = function()
	{		
			this.container.redraw();
	}
	
	
	
	this.hasChildren = function(code)
	{
		
		c = this.getChildren(code)
		return (c.length > 0);
	}
	
	this.clickNode = function(code)
	{
		n = this.getNode(code);
		if(n.expanded)
		{
			this.collapseNode(code);
		}
		else
		{
			this.expandNode(code);
		}
		this.contentChanged();
	}
	
	this.expandNode = function(code)
	{
		n = this.getNode(code);
		ch = this.getChildren(code);
		//cant expand childless nodes
		if (ch.length > 0)
		{
			n.expanded = true;
			
		}
	}
	
	this.collapseNode = function(code)
	{
		n = this.getNode(code);
		ch = this.getChildren(code);
		
		if (n.expanded)
		{
			n.expanded = false;
			
		}
	}
	
	this.getRoot = function()
	{
		return this.root;
	}
	
	this.getNode = function(code)
	{
		
		for(i=0; i< this.nodeList.length; i++)
		{
			if (this.nodeList[i].code == code)
			{
				return this.nodeList[i];
			}
		}
		return null;
	}
	
	this.addChildren = function(code,type,name,parent)
    {
            pNode = this.getNode(parent);
			if(pNode) 
			{
				nNode = new jsTreeNode(code,type,name,parent)
				this.nodeList.push(nNode);
				return nNode;
			}
			else 
			{
				return null;
			}
    }
	
	this.getChildren = function(node)
	{
		var tempArray = new Array();
		for(i=0; i< this.nodeList.length; i++)
		{
			if (this.nodeList[i].parent == node)
			{
				tempArray.push(this.nodeList[i]);
			}
		}
		return tempArray;
	}
	this.indent = function(level)
	{
		var o="";
	
		if (level >0)
		{
			var tab = "";
			o="&nbsp;&nbsp;&nbsp;";
			tab = o;
						
			for(var i=1; i<level; i++)
			{
				o+=tab;
			}
						
		}
		return o;
	}
	
	this.expandKey = function(type, style)
	{
		o = "";
		switch(type)
		{
				case 0:
					
					o+="./images/emptyNode.gif"
					break;
				case 1:
					
					o+="./images/closedNode.gif"
					break;
				case 2:
					
					o+="./images/openNode.gif"
					break;
		}
		return o;
	}
	
	this.getTree = function(n,level)
	{
		//this code should be rewritten in order for it to return a  DOM object instead of HTML text
		br = "<BR>";
		output = "";		
		
		
		if (n.expanded) //node is expanded....obviously it has children
		{
			
			indent = "<FONT style='color:rgb(200,200,200)'>"+this.indent(level)+"</FONT>"
			expand = "<IMG style='cursor: pointer;' id='"+ n.code+"' onmouseover= '' onmouseout='' onclick='myWindowManager.getWindowObject(\""+this.container.idWindow+"\").content.clickNode(parseInt(this.id));' src="+this.expandKey(2,0)+">"
			icon = "<IMG src="+getIcon(n.type,0)+">"
			nodeName = "<FONT id='"+ n.code+"' style='font-family: arial;font-size:8pt; font-weight: bold; cursor: pointer;' onmouseover= 'changeColor(this,\"rgb(50,50,200)\"); changeDecoration(this,1)' onmouseout='changeColor(this,\"rgb(0,0,0)\");changeDecoration(this,0)' onclick=\'alert(\"node \"+this.id+\" selected\")\'>"+ n.name +"</FONT>"+ br;
			
			output = indent + expand +"&nbsp;&nbsp;"+ icon +"&nbsp;&nbsp;" + nodeName
			
			var c = this.getChildren(n.code);
			if (c.length > 0)
			{
				
				for(var j=0; j < c.length; j++)
				{
					//recursive call for children
					output += this.getTree(c[j],level + 1);
				}
			}
		}
		else // node is collapsed
		{
			
			if (this.hasChildren(n.code)) //collapsed w/ children
			{
				indent = "<FONT style='color:rgb(200,200,200)'>"+this.indent(level)+"</FONT>"
				expand = "<IMG style='cursor: pointer;' id='"+ n.code+"' onmouseover= '' onmouseout='' onclick='myWindowManager.getWindowObject(\""+this.container.idWindow+"\").content.clickNode(parseInt(this.id));' src="+this.expandKey(1,0)+">"
				icon = "<IMG src="+getIcon(n.type,0)+">"
				nodeName = "<FONT id='"+ n.code+"' style='font-family: arial;font-size:8pt; font-weight: bold; cursor: pointer;' onmouseover= 'changeColor(this,\"rgb(50,50,200)\"); changeDecoration(this,1)' onmouseout='changeColor(this,\"rgb(0,0,0)\");changeDecoration(this,0)' onclick=\'alert(\"node \"+this.id+\" selected\")\'>"+ n.name +"</FONT>"+ br;
				
				output = indent + expand+"&nbsp;&nbsp;" + icon +"&nbsp;&nbsp;" + nodeName
				
			}
			else //collapsed w/ no children
			{
				indent = "<FONT style='color:rgb(200,200,200)'>"+this.indent(level)+"</FONT>"
				expand = "<IMG id='"+ n.code+"' onclick='nodeMan.clickNode(parseInt(this.id));' src="+this.expandKey(0,0)+">"
				icon = "<IMG src="+getIcon(n.type,0)+">"
				nodeName = "<FONT id='"+ n.code+"' style='font-family: arial;font-size:8pt; font-style: oblique; cursor: pointer;' onmouseover= 'changeColor(this,\"rgb(50,50,200)\");  changeDecoration(this,1)' onmouseout='changeColor(this,\"rgb(0,0,0)\");changeDecoration(this,0)' onclick=\'alert(\"node \"+this.id+\" selected\")\'>"+n.name+"</FONT>" + br;
				
				output = indent + expand+"&nbsp;&nbsp;" + icon +"&nbsp;&nbsp;" + nodeName				
			}
		}
		return output;		
	}
	
	
	this.expandAll = function(code)
	{
		
		this.expandNode(code);
		
		var c = this.getChildren(code);
		if (c.length > 0)
		{
			for(var i =0; i<c.length; i++)
			{
				this.expandAll(c[i].code);
			}
		}
		
	}
	
	this.collapseAll = function(code)
	{
		
		var c = this.getChildren(code);
		if (c.length > 0)
		{
			for(var i =0; i<c.length; i++)
			{
				this.collapseAll(c[i].code);
			}
		}
		this.collapseNode(code);
		
	}
	
	
}