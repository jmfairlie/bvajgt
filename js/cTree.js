/**
 * @author JEAN
 */

//node layout

var _CENTER = 0;
var _NORTH = 1;
var _SOUTH = 2;
var _WEST = 3;
var _EAST = 4;

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
    };
    /*
     * Inserts a new node in a given container, this container already contains
     * a window, so this window is moved down one level (to another new node)
     * next to the new node
     */
    this.insertNode = function(parentId, windowObj, position)
    {
        debugOut("inserting window '"+windowObj.title+"' to tree at "+parentId);
        if (this.nodeArray.length)
        {
            parentObj = this.getNodeById(parentId);
            prevWindowObj = parentObj.windowObj; //window inside container


            //if (position == _CENTER)//tab insert
            //{

                //parentObj.insertTab(windowObj);
                /*
                 * TO DO code for tab stuff
                 *
                 * remove header of new window
                 *
                 * if node is not tabbed yet then remove header of exisitng window
                 * and create a common node header
                 *
                 * display none current tab/window
                 *
                 * insert new headerless window
                 *
                 * create tab handle and insert it in node header
                 * Tab handles have to manage onClick events and display
                 * their corresponding window, and display none of the others
                 *
                 */

            //}
            //else
            //regular spliting insert
            if(true)
            {
                //remove parent window from current parent
                prevWindowObj.HTMLObject.parentNode.removeChild(prevWindowObj.HTMLObject);
                parentObj.windowObj = null;

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
        }
        else // root
        {

            this.nodeArray.push(new cNode(parentId+".0",this.container,windowObj,position)); //insert new window
        }
    };

    /*
     * removes the given node/window and makes the sibling node take the
     * position of the parent.
     */
    this.removeNode = function(node)
    {
        //get sibling node
        var siblingNodes = this.getSiblings(node.id);
        var window = node.windowObj;

        //window needs to be removed
        node.HTMLObject.removeChild(window.HTMLObject);
        node.windowObj = null;

        //node container div needs to be removed
        node.HTMLObject.parentNode.removeChild(node.HTMLObject);
        node.parent = null;

        //window needs to be resized , undocked,  absoluted and inserted in doc body.
        window.setPosition(tempX- 10,tempY- 10);
        document.body.appendChild(window.HTMLObject);
        window.HTMLObject.style.position = "absolute";
        window.Dock(false);
        window.restoreSize();
        window.containerNode = null;


        if (siblingNodes.length)
        {
            /*there is always a sibling unless theres only one
            * window in the main container
            */

            var siblingNode = siblingNodes[0];  //one sibling at most... for now
            var siblingHTMLObj = siblingNode.HTMLObject;

            //remove siblings window (or 2 children nodes) and insert it in parent node

            if (siblingNode.leaf)//just the window
            {
                var siblingWindow = siblingNode.windowObj;

                //remove window from sibling's div container
                siblingHTMLObj.removeChild(siblingWindow.HTMLObject);

                //remove sibling's div container
                siblingHTMLObj.parentNode.removeChild(siblingHTMLObj);

                //window gets adopted by parent node
                siblingWindow.containerNode = siblingNode.parent;
                siblingNode.parent.windowObj =  siblingWindow;
                siblingNode.parent.setLeaf(true);
                siblingNode.parent.HTMLObject.appendChild(siblingWindow.HTMLObject);

                //resize node's window
                siblingNode.parent.resizeWindow();

                //node needs to be removed from list/tree
                this.removeNodeFromList(siblingNode.id);
            }
            else//2 children nodes
            {
                //this should return 2 nodes
                var nephewNodes = this.getChildren(siblingNode.id);
                var nephew1 = nephewNodes[0];
                var nephew2 = nephewNodes[1];

                //remove nephew nodes from sibling's div container
                siblingHTMLObj.removeChild(nephew1.HTMLObject);
                siblingHTMLObj.removeChild(nephew2.HTMLObject);

                //remove sibling's div container
                siblingHTMLObj.parentNode.removeChild(siblingHTMLObj);

                //nephews get adopted by parent node
                siblingNode.parent.HTMLObject.appendChild(nephew1.HTMLObject);
                siblingNode.parent.HTMLObject.appendChild(nephew2.HTMLObject);
                nephew1.parent = siblingNode.parent;
                nephew2.parent = siblingNode.parent;

                //if north or south then its a vertical resize
                var vertical = (siblingNode.position < 3);

                //resize nephew nodes
                this.resizeNode(nephew1,vertical);
                this.resizeNode(nephew2,vertical);

                //node needs to be removed from list/tree
                this.removeNodeFromList(siblingNode.id);
            }
        }

        //node needs to be removed from list/tree
        this.removeNodeFromList(node.id);
    };

    this.resizeNode = function(node,vertical)
    {
        node.resize(vertical);
        dArr = this.getAllDescendants(node.id);
        debugOut("resize Node, num descendants: "+dArr.length);

        for (var i=0; i<dArr.length; i++)
        {
            dArr[i].resize(vertical);
        }

    };

    this.removeNodeFromList = function(nodeId)
    {
        for (var i=0; i<this.nodeArray.length; i++)
        {
            if (this.nodeArray[i].id == nodeId)
            {
                this.nodeArray.splice(i,1);
                debugOut("removing node "+nodeId);
                return;
            }
        }
    }

    this.getAllDescendants = function(id)
    {
        var auxArray = new Array();

        for (var i=0; i<this.nodeArray.length; i++)
            {
                if (this.nodeArray[i].parent !== null && this.nodeArray[i].parent.id == id)
                {
                    var cid = this.nodeArray[i].id;
                    auxArray.push(this.nodeArray[i]);
                    auxArray = auxArray.concat(this.getAllDescendants(cid));
                }
            }

        return auxArray;
    };

    this.getChildren = function(id)
    {
        var auxArray = new Array();

        for (var i=0; i<this.nodeArray.length; i++)
            {
                if (this.nodeArray[i].parent !== null && this.nodeArray[i].parent.id == id)
                {
                    auxArray.push(this.nodeArray[i]);
                }
            }
        return auxArray;
    };

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
        return arrSiblings; //1 element, as this is a binary tree  ....
    };

    this.getHotspot = function(point)
    {
        /*
         * maybe we could have a list of the leaves, and update it every time
         * a node is inserted or removed, so we dont need to traverse [hard peseta coin]
         * the whole array
         */
        var hotspot = null;

        if (this.nodeArray.length)
        {
            for (var i=0; i<this.nodeArray.length; i++)
            {
                if (this.nodeArray[i].leaf)
                {
                    hotspot = this.nodeArray[i].getHotspot(point);
                    if (hotspot)
                    {
                        return [hotspot[0], hotspot[1], hotspot[2], hotspot[3],hotspot[4], this.nodeArray[i].id];
                    }
                }
            }
        }
        else
        {
            var r = this.container.getRect();
            hotspot = [r[0],r[1],r[2],r[3],_CENTER,"root"];
        }
        return hotspot;
    };

}