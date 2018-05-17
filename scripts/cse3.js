var myVar;

$(function() {
   $("#dispreg").click(function(event){
    document.getElementById("edreg").focus();
   });
   $("#mode").change(function(event){
    document.getElementById("edreg").focus();
   });
   $("#chbx2,#chbx3").change(function(){
    document.getElementById("edreg").focus();
   });
   //$("#doc").keydown(function(event){
   // if (event.keyCode==8) event.preventDefault();
   //});
   $("#edreg").focus(function(){
      var flash = 0;
      myVar = setInterval(function(){
         if (flash & 4) {
            $("#cu t1").css("background-color","blue");
            $("#cu t2").css("background-color","initial");
            $(".fl t1").css("background-color","blue");
            $(".fl t2").css("background-color","initial");
         } else {
            $("#cu t1").css("background-color","initial");
            $("#cu t2").css("background-color","blue");
            $(".fl t1").css("background-color","initial");
            $(".fl t2").css("background-color","blue");
         }
         if ((flash & 7) == 0) $(".td").toggleClass("td md");
         $(".md").each(function() {
            $(this).prepend("<t3>"+$(this).children().last().html()+"</t3>");
            $(this).children().last().remove();
         });
         flash=(flash + 1) & 255;
      },125);
   });
   $("#edreg").focusout(function(){
      clearInterval(myVar);
   });
   document.getElementById("edreg").focus();
   readSingleFile();
   $("cd").click(function(){
    var x = $(this).position();
    alert("Top: " + x.top + " Left: " + x.left);
   });
   //$("#demo").dblclick(function(){
   //      $("#doc").off("keypress");
   //      $("#doc").off("keydown");
   //      clearInterval(myVar);
   //      readSingleFile();
   //});
});

// This will read a file using Ajax.

 function readSingleFile(evt) {
             var xhr = new XMLHttpRequest();
             xhr.open('GET','chsets/Chguk101.rom',true);
             xhr.responseType = 'arraybuffer';
             xhr.onload = function(e) { 
                var view = new Uint8Array(this.response);
                var nbe = view.BYTES_PER_ELEMENT;
                var left=0;
                var ch=8;
                var ol=0;
                $("#inputModal").modal("hide");
                document.getElementById("edreg").addEventListener("input", function(){
                   //event.preventDefault();
                   binary_string = "";
                   var flst = "";
                   if($("#chbx2").prop('checked')) flst=" fl";
                   if($("#chbx3").prop('checked')) flst+=" td";
                   var cl = "ca" + flst;
                   var chh = ((ch*3)-5);
                   //var tb = document.getElementById("edreg");
                   //alert(event.data);
                   var ci = $("#edreg").val();
                   var x = ci.charCodeAt(ci.length-1);
                   var nkc = (x + 128) & $("#mode").val();
                   switch(x) {
                      case 13:
                         cl = "cr";
                         chh = 0;
                         break;
                      default:
                         if (ci.length != ol) {
                           for (var k=0; k<ch;k++) {
                              var v = view[(nkc*ch)+k];
                              var j = 1;
                              binary_string += "<t3>";
                              do {
                                 var b = v & 0xFF;
                    
                                 for (var i =0; i < 8; ++i)
                                    binary_string += (b & (1<<(7-i))) ? "<t1></t1>" : "<t2></t2>";
                                 v >>= 8;                  
                              } while (nbe > j++);
                              binary_string += "</t3>";
                           }
                         }
                         ol = ci.length;
                   }
                   $("#cu").before("<cd class='"+cl+"' style='height: "+chh+"px'>" + binary_string + "</cd>");
                   //alert(event.keyCode);
                   //$("#edreg").val("");
                });
                $("#edreg").on("keydown",function(event){
                   //alert(event.keyCode);
                   switch(event.keyCode) {
                      case 8:
                         event.preventDefault();
                         $("cd:nth-last-of-type("+(left+2)+")").remove();
                         break;
                      case 13:
                         $("#cu").before("<cd class='cr'></cd>");
                         break;
                      case 37:
                         if (left < ($("cd").length-1)) left++;
                         $("#edreg").val("");
                         ol = 0;
                         break;
                      case 39:
                         if (left > 0) left--;
                         break;
                      case 38:
                         var lc = left;
                         var pos = $("#cu").position();
                         var cp;
                         while (lc < ($("cd").length-1)) {
                            cp = $("cd:nth-last-of-type("+(lc+2)+")").position();
                            if (cp.left == pos.left) {
                               left = lc + 1;
                               break;
                            }
                            lc++;
                         }
                         $("#edreg").val("");
                         ol = 0;
                         break;
                      case 40:
                         var lc = left;
                         var pos = $("#cu").position();
                         var cp;
                         while (lc > 0) {
                            cp = $("cd:nth-last-of-type("+lc+")").position();
                            if (cp.left == pos.left) {
                               left = lc - 1;
                               break;
                            }
                            lc--;
                         }
                         break;
                      case 36:
                         left = $("cd").length-1;
                         $("#edreg").val("");
                         ol = 0;
                         break;
                      case 35:
                         left = 0;
                         break;
                   }
                   if(event.keyCode >= 35 && event.keyCode <= 40) {
                      $("#cu t1").css("background-color","blue");
                      $("#cu t2").css("background-color","initial");
                      $("#cu").removeAttr("id");
                      $("cd:nth-last-of-type("+(left+1)+")").attr("id","cu");
                   }
                });  
                $("#edreg").click(function(){
                   $("#edreg").val("");
                   ol = 0;
                });
                var block = "";
                for (var ii = 0;ii<ch;ii++) {
                   block += "<t3>";                      
                   for (var jj = 0;jj<8;jj++)
                      block += "<t2></t2>";
                   block += "</t3>";
                }
                $("#cu").html(block);
             }
             xhr.send();
    }
