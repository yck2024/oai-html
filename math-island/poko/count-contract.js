(function(root, factory){
 "use strict";
 var contract=factory();
 if(typeof module==="object"&&module.exports)module.exports=contract;
 if(root)root.PokoCountContract=contract;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 var minCount=1,maxCount=5,appleRadius=.28;
 var spots=[[-1.65,1.16,.8],[-.75,1.16,1.2],[.15,1.16,.9],[1.1,1.16,1.25],[2.0,1.16,.8]];
 function additionSpots(total,split){
  if(!Number.isInteger(total)||total<2||total>maxCount||!Number.isInteger(split)||split<1||split>=total)throw new RangeError("Poko addition rounds require 2 to 5 apples in two groups");
  var spots=[],rightCount=total-split;
  for(var i=0;i<split;i++)spots.push([-1.8+(i%2)*.55,1.16,.35+Math.floor(i/2)*.5]);
  for(var j=0;j<rightCount;j++)spots.push([.05+(j%2)*.55,1.16,.35+Math.floor(j/2)*.5]);
  return spots;
 }
 return Object.freeze({
  minCount:minCount,
  maxCount:maxCount,
  appleRadius:appleRadius,
  tray:Object.freeze({centerX:.2,centerZ:.95,radiusX:2.62,radiusZ:2.62*.66,outerRadius:2.72,outerDepthScale:.68}),
  countAnswer:function(random){return minCount+Math.floor(random()*(maxCount-minCount+1));},
  countSpots:function(total){
   if(!Number.isInteger(total)||total<minCount||total>maxCount)throw new RangeError("Poko count rounds support 1 to 5 apples");
   return spots.slice(0,total).map(function(spot){return spot.slice();});
  },
  additionSpots:additionSpots
 });
});
