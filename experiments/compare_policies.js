"use strict";
/**
 * Deterministic, synthetic allocation benchmark, NOT an empirical validation
 * or proof of a Zanistarast ontological proposition.
 * Node.js 20+; no external packages; do not use personally identifiable data.
 */
function rng(seed) {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new RangeError("seed must be a nonnegative safe integer");
  let s = seed >>> 0;
  return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 4294967296; };
}
function gini(values) {
  if (!Array.isArray(values) || values.length === 0 || values.some(x => !Number.isFinite(x) || x < 0)) {
    throw new RangeError("gini requires a nonempty array of nonnegative finite values");
  }
  const a = [...values].sort((x,y) => x - y);
  const sum = a.reduce((u,v) => u+v, 0);
  if (sum === 0) return 0;
  const score = 2 * a.reduce((u,v,i) => u+(i+1)*v,0)/(a.length*sum) - (a.length+1)/a.length;
  return Math.abs(score)<1e-12 ? 0 : Math.min(1,Math.max(0,score)); // suppress insignificant float error
}
const mean = xs => xs.reduce((a,b)=>a+b,0) / xs.length;
function simulate(seed, policy, steps=120, units=10) {
  if (!["fixed", "proportional", "feedback"].includes(policy)) throw new RangeError("unknown policy");
  if (![steps,units].every(x=>Number.isSafeInteger(x)&&x>0)) throw new RangeError("steps and units must be positive integers");
  const rand = rng(seed), lastUnmet = Array(units).fill(0);
  const unmetRate=[],allocationGini=[],unmetRateGini=[],wasteRate=[];
  for(let t=0;t<steps;t++) {
    const demand = Array.from({length:units},(_,i)=>5+(i%3)+Math.floor(rand()*7)+(t%17===0?(i%4)*4:0));
    const totalDemand=demand.reduce((a,b)=>a+b,0), budget=totalDemand*0.72;
    const weights = policy==="fixed"? Array(units).fill(1)
      : policy==="proportional"? demand
      : demand.map((d,i)=>d+0.8*lastUnmet[i]);
    const totalWeight=weights.reduce((a,b)=>a+b,0);
    const allocated=weights.map(w=>budget*w/totalWeight);
    const shortages=demand.map((d,i)=>Math.max(0,d-allocated[i]));
    const unservedRatios=shortages.map((short,i)=>short/demand[i]);
    const wasted=allocated.reduce((acc,val,i)=>acc+Math.max(0,val-demand[i]),0);
    shortages.forEach((v,i)=>lastUnmet[i]=v);
    unmetRate.push(shortages.reduce((a,b)=>a+b,0)/totalDemand);
    allocationGini.push(gini(allocated));
    unmetRateGini.push(gini(unservedRatios));
    wasteRate.push(wasted/budget);
  }
  return {seed, policy, meanUnmet:mean(unmetRate), meanAllocationGini:mean(allocationGini),
    meanUnmetRateGini:mean(unmetRateGini),meanWasteRate:mean(wasteRate)};
}
function run(seeds=100) {
  if (!Number.isSafeInteger(seeds)||seeds<2||seeds>10000) throw new RangeError("seeds must be an integer from 2 to 10000");
  const results={fixed:[],proportional:[],feedback:[]};
  for(let seed=1;seed<=seeds;seed++) {
    for(const policy of Object.keys(results)) results[policy].push(simulate(seed,policy));
  }
  const metrics=["meanUnmet","meanAllocationGini","meanUnmetRateGini","meanWasteRate"];
  const summarize=xs=>Object.fromEntries(metrics.map(m=>[m,mean(xs.map(x=>x[m]))]));
  const pairedDifferences=(left,right)=>Object.fromEntries(metrics.map(m=>[m,
    mean(results[left].map((x,i)=>x[m]-results[right][i][m]))]));
  return {status:"SYNTHETIC_ONLY_NOT_EMPIRICAL_VALIDATION",seeds,steps:120,units:10,
    budgetFraction:0.72,observation:"All policies have instant access to the current demand; feedback also uses prior shortfall.",
    fixed:summarize(results.fixed),proportional:summarize(results.proportional),feedback:summarize(results.feedback),
    feedbackMinusFixed:pairedDifferences("feedback","fixed"),
    feedbackMinusProportional:pairedDifferences("feedback","proportional"),
    qualification:"Toy model only. The allocation Gini is not itself a measure of justice; compare unmet-rate Gini and waste too. Synthetic seeds are not field evidence."};
}
if (require.main===module) console.log(JSON.stringify(run(),null,2));
module.exports={rng,gini,simulate,run};
