"use strict";
const PIPELINE=Object.freeze(["Ehad","Tek","Yek","Hebûn","Zanabûn","Mabûn","Rabûn","Rasterast"]);
function runScenario(scenario){
  return {scenario,startedAt:new Date().toISOString(),pipeline:[...PIPELINE],result:{
    executed:false,verified:false,status:"NOT_EXECUTED",
    reason:"No independently evidenced execution or verification has been supplied"
  }};
}
function evaluate(simulation){
  const result=simulation&&simulation.result;
  return {completed:false,verified:false,score:0,
    reason:"No trusted independent verification adapter is configured"};
}
module.exports={PIPELINE,runScenario,evaluate};
