function debugOut(output)
{
    myDebugWindow.content.newLine()
    var ts = "["+new Date()+"] ";
    myDebugWindow.content.appendText(ts + output);
    myDebugWindow.scrollDown();
}