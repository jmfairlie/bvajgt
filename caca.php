<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Strict//EN">
<html xmlns = "http://www.w3.org/1999/xhtml">

<head>
    <title>Bien Varon Advanced Javascript GUI Toolkit - zIndex/Focus Test</title>
	
    <!-- #include file = "conexion.asp"-->
	<?php require 'phpconnection.php';?>
	
    <script type="text/javascript" src ="jsvaron/jsTree.js">
	
	</script> 
	<script type="text/javascript" src ="jsvaron/jsWindow.js">
	
	</script>
	<script type="text/javascript" src ="jsvaron/jsTextField.js">
	
	</script> 
	<script type="text/javascript" src ="jsvaron/jsWindowManager.js">
	
	</script> 	

	<script type="text/javascript">
	function populateTree(tree)
	{
		<?php
				
		$rs = $conn->Execute("select * from GROUPS order by GRO_CODE");
		
		while (!$rs->EOF) 
		{ 
			$GRO_CODE = $rs->Fields("GRO_CODE");
			$GTY_CODE = $rs->Fields("GTY_CODE");
			$GRO_NAME = $rs->Fields("GRO_NAME");
			$GRO_PARENT = $rs->Fields("GRO_PARENT");
		
		?>
			
			tree.addChildren(<?php echo $GRO_CODE ?>,<?php echo $GTY_CODE ?>,<?php echo "'".$GRO_NAME."'"?>,<?php echo $GRO_PARENT?>);	
		<?php
			$rs->MoveNext();
		} 
		
		$rs->Close();
		?>
	}
	

	function createWindows(numWindows)
	{
		
		for (var i = 0; i < numWindows; i++)
		{
			var myDynamicWindow = new jsWindow('testWindow'+i, null ,'title for testWindow'+i, 400, 200,null,100+30*i,100+30*i)
			var myTree = new jsTree();
			populateTree(myTree);
			//dummyContent(myTree);
			myDynamicWindow.setContent(myTree);
			myWindowManager.addWindow(myDynamicWindow);
		}
	}
	createWindows(20);
	
	</script>
	
</head>

<body   onload="myWindowManager.createWindows()" onmousemove="return mouseMoveHandler(event);" onmouseup= "dropWindow();myWindowManager.stopResize();" style="overflow:hidden; background: #5380CA url('./images/bliss.jpg') no-repeat fixed center center">
	<H1>20 Window z-Index/Focus Test</H1>	
		
</body>

</html>
