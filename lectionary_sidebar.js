<!-- Begin POP-UP SIZES AND OPTIONS CODE

// CHANGE ANY OF THESE VARIABLES TO "no" OR "yes" TO TURN AN OPTION OFF OR ON

// ONLY USE lowercase FOR ALL OPTIONS

var paragraph_1 	= "no"		// SHOW TEXT PARAGRAPH
var boxwidth		= "150"		// WIDTH OF THE TEXT BOX
var showimage		= "yes"		// SHOW A SMALL SIDEBAR IMAGE
var linked		= "news.htm"	// SIDEBAR IMAGE LINK
var sidewidth		= "161"		// WIDTH OF THE LEFT SIDEBAR
var pageheight		= "10"		// ADJUST OVERALL PAGE HEIGHT
var nudge		= "0"		// NUDGE SIDEBAR DOWN


// NOTE: If you use a ' add a slash before it like this \'

document.write('<div id="sidebar" class="menu-layer">');
document.write('<TABLE cellpadding="0" cellspacing="0" border="0" width="'+sidewidth+'">');
document.write('<tr><td align="center">');
document.write('<img src="picts/spacer.gif" height="'+nudge+'" width="5"><br>');




// START SIDEBAR TEXT - EDIT THIS AREA

   if (paragraph_1 == "yes") {

document.write('<TABLE cellpadding="5" cellspacing="0" border="0" width="'+boxwidth+'"><tr><td class="sidetexttitle">');

// START SIDE TEXT TITLE

document.write('Events:<br>');

document.write('</td></tr><tr><td class="sidetext">');

// START NOTE TEXT AREA - EDIT THE NEXT LINE

document.write('This side bar area can be used for some text, notes events or special new announcments, or you can add links here. Edit the sidebar.js to change this text area.<br>');

// SIDEBAR LINK

document.write('<a href="about.htm"><img src="picts/more-off.jpg" vspace="6" border="0" onmouseover="this.src=\'picts/more-on.jpg\'" onmouseout="this.src=\'picts/more-off.jpg\'"></a><br>');

document.write('</td></tr></table>');
}







// SMALL PICTURE AREA

   if (showimage == "yes") {
document.write('<br>');
document.write('<a href="'+linked+'"><IMG SRC="picts/lectionary01.jpg" border="0" width="148" class="bordersSB"></a><br>');

}






document.write('</td></tr></table>');
document.write('</div>');
document.write('<br>');
document.write('<div id="sidebar-spacer">');
document.write('<img src="picts/spacer.gif" height="'+pageheight+'" width="'+sidewidth+'"><br>');
document.write('</div>');




//  End -->