/*
NOTES:
overflow: hidden doesnt work in mozilla for container objects inside with overflow auto or scroll
overflow doesnt work in IE in compliant mode for container children if parent container has position:relative
*/
function jsWindowContainer(idcontainer)
{
    this.tree = new cTree(this);
    this.idWindow = idcontainer;

    this.HTMLObject = document.getElementById(idcontainer);
    this.width = this.HTMLObject.offsetWidth;
    this.height = this.HTMLObject.offsetHeight;

    this.tempRect = null;
    this.hotspot = null;

    this.removeNode = function(windowObj)
    {
        this.tree.removeNode(windowObj.containerNode);
    };

    this.isInside = function(abscoords)
    {
        var point = this.getRelativeCoords(abscoords);
        return ((point.x > 0 && point.x < this.width) && (point.y > 0 && point.y < this.height));
    };

    //called when a window is dropped inside the container
    this.insertWindow  = function(windowObj, parentNodeId, position)
    {
        windowObj.Dock(true);
        this.tree.insertNode(parentNodeId, windowObj, position);
    };

    //shows drop area
    this.createRectangle = function(r)
    {
        if ((this.hotspot===null)||r[0]!==this.hotspot[0] || r[1]!==this.hotspot[1] || r[2]!==this.hotspot[2] || r[3]!==this.hotspot[3] || r[5]!== this.hotspot[5])
        {
            this.destroyRectangle();
            this.hotspot = r;

            var pNode = this.tree.getNodeById(r[5]);
            this.hotspotDOMParent = pNode?pNode.windowObj.HTMLObject:this.HTMLObject;

            this.tempRect = document.createElement('div');
            this.tempRect.setAttribute('id',this.idWindow+"_tempRect");
            this.tempRect.style.cssText = "border:"+myGuiManager.getDockBorderStyle()+"width:"+(r[2]- 2*myGuiManager.getDockBorderWidth()) +"px;height:"+(r[3]- 2*myGuiManager.getDockBorderWidth())+"px; position:absolute; left:"+r[0]+"px; top:"+r[1]+"px;"+myGuiManager.getDockBorderOpacity()+"background-color:"+myGuiManager.getDockBorderBgColor();

            this.hotspotDOMParent.appendChild(this.tempRect);
            //debugOut("Rectangle Created..." + this.hotspot);
        }
    };

    this.destroyRectangle = function()
    {
        if (this.tempRect)
        {
            //debugOut("Rectangle Destroyed...");
            this.hotspotDOMParent.removeChild(this.tempRect);
            this.tempRect = null;
            this.hotspot = null;
        }
    };

    this.getRect = function()
    {
        l = this.HTMLObject.style.left || "0px";
        t = this.HTMLObject.style.top || "0px";

        return [parseInt(l.substring(0,l.length - 2),10),parseInt(t.substring(0,t.length - 2),10),this.width,this.height];
    };

    this.getRelativeCoords = function(abscoords) {
        var bounding = this.HTMLObject.getBoundingClientRect();
        var tf = {
            x: abscoords[0] - bounding.left,
            y: abscoords[1] - bounding.top
        }
        return tf;
    }

    this.onChildDrag = function(childWindow)
    {
        var windowPos = childWindow.getPosition();
        var hspt = (this.isInside(windowPos))?this.tree.getHotspot(windowPos):null;

        if(hspt)
        {
            this.createRectangle(hspt);
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
}
