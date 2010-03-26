<?php
$conn = new COM("ADODB.Connection") or die("Cannot start ADO"); 

// Microsoft Access connection string.
$conn->Open("DRIVER={Microsoft Access Driver (*.mdb)}; DBQ=C:\\data\\CONTROL03.mdb");
 
?>