myDebugWindow = new jsWindow('debugWindow',null,'Debug', 300, 200,null,1200,50)
myTextField = new jsTextField();
myDebugWindow.setContent(myTextField);
myWindowManager.addWindow(myDebugWindow);
			
function debugOut(output)
{
	myDebugWindow.content.newLine()
	myDebugWindow.content.appendText(output);
	myDebugWindow.scrollDown();
				
}