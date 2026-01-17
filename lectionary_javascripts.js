<!-- BLOCKS ALL JAVASCRIPT ERRORS

function blockError(){return true;}
window.onerror = blockError;


function right(e) { 
if (navigator.appName == 'Netscape' && 
(e.which == 3 || e.which == 2)) 
return false; 
else if (navigator.appName == 'Microsoft Internet Explorer' && 
(event.button == 2 || event.button == 3)) { 
alert("You may not right mouse click this page."); 
return false; 
} 
return true; 
}
document.onmousedown=right; 
if (document.layers) window.captureEvents(Event.MOUSEDOWN); 
window.onmousedown=right; 



// -->