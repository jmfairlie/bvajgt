var myDebugWindow;
var x = 10;
var x_gap = 10;
var y = 20;
var y_gap = 30;
var num = 9;

var ygroupgap = 0;
var winh = 200;
var winw = 300;
var space = winh;
window.onload = function() {
    myWindowContainer = new jsWindowContainer("layout-manager");

    myDebugWindow = new jsWindow('debugWindow',myWindowContainer,'Debug', winw, winh, null, x, y);

    myTextField = new jsTextField();
    myDebugWindow.setContent(myTextField);
    myWindowManager.addWindow(myDebugWindow);

    for(var i = 0 ; i < num; i++ )
    {
        ygroupgap = (i+1)>num/2?space:0;

        myDynamicWindow = new jsWindow("testWindow"+i, myWindowContainer, "tree example"+i, 300, 200, null, x+((i+1)%((num+1)/2))*x_gap, ygroupgap + y+(i+1)*y_gap);
        myTree = new jsTree();
        dummyContent(myTree);
        myDynamicWindow.setContent(myTree);
        myWindowManager.addWindow(myDynamicWindow);
    }

    myWindowManager.createWindows();

    document.body.onmousemove = mouseMoveHandler;
    document.body.onmouseup = function() {
        dropWindow();
        myWindowManager.stopResize();
    };
};


