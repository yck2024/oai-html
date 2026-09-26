"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");
const contract=require("./count-contract.js");

function assertAppleOnTray(x,z,label){
 const {centerX,centerZ,radiusX,radiusZ,outerRadius,outerDepthScale}=contract.tray;
 const surfaces=[["cream surface",radiusX,radiusZ],["rim",outerRadius,outerRadius*outerDepthScale]];
 for(let step=0;step<72;step++){
  const angle=step*Math.PI/36;
  const edgeX=x+Math.cos(angle)*contract.appleRadius,edgeZ=z+Math.sin(angle)*contract.appleRadius;
  for(const [surface,surfaceRadiusX,surfaceRadiusZ] of surfaces){
   const normalizedDistance=((edgeX-centerX)/surfaceRadiusX)**2+((edgeZ-centerZ)/surfaceRadiusZ)**2;
   assert.ok(normalizedDistance<=1,`${label} at ${x},${z} overhangs the tray ${surface}`);
  }
 }
}

test("count rounds choose every supported answer from one to five",function(){
 for(let answer=contract.minCount;answer<=contract.maxCount;answer++){
  const random=()=>((answer-contract.minCount)/(contract.maxCount-contract.minCount+1));
  assert.equal(contract.countAnswer(random),answer);
 }
});

test("each supported count has distinct apples fully on the counting tray",function(){
 for(let count=contract.minCount;count<=contract.maxCount;count++){
  const spots=contract.countSpots(count);
  assert.equal(spots.length,count);
  assert.equal(new Set(spots.map(point=>point.join(","))).size,count);
  for(const [x,,z] of spots)assertAppleOnTray(x,z,"apple");
 }
});

test("every addition grouping up to five apples sits fully on the counting tray",function(){
 for(let total=2;total<=contract.maxCount;total++){
  for(let split=1;split<total;split++){
   const spots=contract.additionSpots(total,split);
   assert.equal(spots.length,total);
   assert.equal(new Set(spots.map(point=>point.join(","))).size,total);
   for(const [x,,z] of spots)assertAppleOnTray(x,z,"addition apple");
  }
 }
});

test("count and addition apple positions reject unsupported totals",function(){
 assert.throws(()=>contract.countSpots(0),RangeError);
 assert.throws(()=>contract.countSpots(6),RangeError);
 assert.throws(()=>contract.additionSpots(1,0),RangeError);
 assert.throws(()=>contract.additionSpots(6,1),RangeError);
 assert.throws(()=>contract.additionSpots(3,3),RangeError);
});
