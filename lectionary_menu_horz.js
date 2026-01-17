<!-- Begin

// NOTE: If you use a ' add a slash before it like this \'


var color		= "45AB45"	// HORZ MENU BACKGROUND COLOR
var bordercolor		= "006600"	// HORZ MENU BOTTOM BORDER COLOR
var date 		= "yes" 	// SHOW DATE



document.write('<TABLE cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#'+color+'" style="border-bottom: #'+bordercolor+' 1px solid;" class="printhide"><tr><td align="center">');


document.write('<TABLE cellpadding="0" cellspacing="3" border="0"><tr><td>');
document.write('&nbsp;<br>');


// START HORIZONTAL LINKS - COPY AND PASTE THE NEXT 2 LINES TO ADD A LINK


document.write('</td><td>');
document.write('<span class="menuhorz2">வாசக நூல் 1</span>');


document.write('</td><td>');
document.write('<a href="../u_fs-lectionary2.htm" target="_top" class="menuhorz">வாசக நூல் 2</a>');



document.write('</td><td>');
document.write('<a href="../u_fs-lectionary3.htm" target="_top"  class="menuhorz">வாசக நூல் 3</a>');

document.write('</td><td>');
document.write('<a href="../u_fs-lectionary4.htm" target="_top" class="menuhorz" >வாசக நூல் 4</a>');


document.write('</td></tr></table>');
document.write('</td><td width="1">');
document.write('<img src="picts/spacer.gif" HEIGHT="5" width="1"><br>');
document.write('</td></tr></table>');


// START DATE SCRIPT

// COPYRIGHT 2006 © Allwebco Design Corporation
// Unauthorized use or sale of this script is strictly prohibited by law

   if (date == "yes") {
document.write('<div id="date-location">');
var d=new Date()
var weekday=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday")
var monthname=new Array("January","February","March","April","May","June","July","August","September","October","November","December")
document.write("<span class=\"headermenu\"><nobr>" + weekday[d.getDay()] + " ")
document.write(d.getDate() + ". ")
document.write(monthname[d.getMonth()] + " ")
document.write(d.getFullYear())
document.write("</nobr><br></span>")
document.write('</div>');
}



//  End -->