

var fs = require('fs');
var csv = require("fast-csv");
var chroma = require("chroma-js");
console.log(chroma.gl);
var onecolor = require("onecolor");
//console.log(onecolor);
var point = "\n\t<Coordinate point=\'";
var color = "\n\t<Color color=\'";
var color_obj={};

var colorScaleRed = chroma.scale(['lightyellow', 'peachpuff', 'black'])
        .domain([-9, -1, 6.5]);

var colorScaleWhite = chroma.scale(['white', 'gainsboro', 'black'])
        .domain([-9, -1, 6.5]);

var colorScaleBlue = chroma.scale(['lightcyan', 'lightsteelblue', 'black'])
        .domain([-9, -1, 6.5]);
		
		
/********* Append Headers **************/
fs.writeFile('visible1.x3d', '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE X3D PUBLIC "ISO//Web3D//DTD X3D 3.3//EN" "http://www.web3d.org/specifications/x3d-3.3.dtd">\n<X3D profile=\'Immersive\' version=\'3.3\' xmlns:xsd=\'http://www.w3.org/2001/XMLSchema-instance\' xsd:noNamespaceSchemaLocation=\'http://www.web3d.org/specifications/x3d-3.3.xsd\'>', 
function(err) {
   if (err) {
       return console.error(err);
   }

   
});

/********* Append Head element and start PointSet Element **************/
fs.appendFile('visible1.x3d', 
'\n<head>\n\t<meta content=\'visible.x3d\' name=\'title\'/>\n</head>\n<Scene>\n\t<Shape>\n\t\t<PointSet>', 
(err) => {
  if (err) throw err;
  console.log('The "head element" was appended to file!');
});

/**
 * Calculate the apparent magnitude and color mapping of the star
 * @param star
 */
 
function calculateColor(star) {
    var distance = {}, m, color_loc={};

	
    distance.x = star.X - 1;
    distance.y = star.Y - 1;
    distance.z = star.Z - 1;
    distance.total = Math.sqrt(Math.pow(distance.x, 2) +
                               Math.pow(distance.y, 2) +
                               Math.pow(distance.z, 2));

    m = star.M - 5 * (1 - Math.log10(distance.total));

    //color = colorScale(m).gl();

    if (star.T < 4000) {
        color_loc = colorScaleRed(m).gl(); 
    } else if (star.T > 10000) {
        color_loc = colorScaleBlue(m).gl();
		
    } else {
       color_loc = colorScaleWhite(m).gl();
    }
  
  

    return color_loc;
}

/********* Parse CSV file **************/
csv
 .fromPath("./data/visible.csv",{headers:true})
 .on("data", function(data){
	
	point = point + data.X+" "+data.Y+" "+data.Z+" ";
    color_obj = calculateColor(data);
	//console.log(color_obj);
	color = color + color_obj[0]+" "+color_obj[1]+" "+color_obj[2]+" ";
 }).on("end", function(){
	 
	color = color+"\'/>\n";
	point = point+"\'/>\n\t</PointSet>\n</Shape>\n</Scene>\n</X3D>" ;
	
	/********* Append the colors in the co-ordinate point element**************/
fs.appendFile('visible1.x3d', 
		color, 
		(err) => {
		if (err) throw err;
	
		});
/********* Append the points in the co-ordinate point element**************/
	fs.appendFile('visible1.x3d', 
		point, 
		(err) => {
		if (err) throw err;
	
		});
	

 });
 

 

