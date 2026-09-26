"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");
const contract=require("./count-contract.js");

test("count rounds choose every supported answer from one to five",function(){
 for(let answer=contract.minCount;answer<=contract.maxCount;answer++){
  const random=()=>((answer-contract.minCount)/(contract.maxCount-contract.minCount+1));
  assert.equal(contract.countAnswer(random),answer);
 }
});

test("each supported count has distinct apples positioned within the counting tray",function(){
 for(let count=contract.minCount;count<=contract.maxCount;count++){
  const spots=contract.countSpots(count);
  assert.equal(spots.length,count);
  assert.equal(new Set(spots.map(point=>point.join(","))).size,count);
  for(const [x,,z] of spots){
   const {centerX,centerZ,radiusX,radiusZ}=contract.tray;
   const normalizedDistance=((x-centerX)/radiusX)**2+((z-centerZ)/radiusZ)**2;
   assert.ok(normalizedDistance<=1,`apple at ${x},${z} falls outside the counting tray`);
  }
 }
});

test("every addition grouping up to five apples fits on the counting tray",function(){
 for(let total=2;total<=contract.maxCount;total++){
  for(let split=1;split<total;split++){
   const spots=contract.additionSpots(total,split);
   assert.equal(spots.length,total);
   assert.equal(new Set(spots.map(point=>point.join(","))).size,total);
   for(const [x,,z] of spots){
    const {centerX,centerZ,radiusX,radiusZ}=contract.tray;
    const normalizedDistance=((x-centerX)/radiusX)**2+((z-centerZ)/radiusZ)**2;
    assert.ok(normalizedDistance<=1,`addition apple at ${x},${z} falls outside the counting tray`);
   }
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
