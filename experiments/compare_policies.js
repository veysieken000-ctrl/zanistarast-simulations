"use strict";
/*
 * Synthetic governance-feedback benchmark, NOT proof of Zanistarast ontology.
 * Deterministic seeded experiment; no personal data; no dependency.
 * Compare fixed allocation to proportional feedback allocation under demand shocks.
 */
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 4294967296; };
}
function gini(a) {
  const x = [...a].sort((a,b) => a-b);
  const sum = x.reduce((u,v)=>u+v,0);
  if (sum === 0) return 0;
  return (2*x.reduce((u,v,i)=>u+(i+1)*v,0))/(x.length*sum)-(x.length+1)/x.length;
}
function simulate(seed, policy, steps=120, units=10) {
  const rand=rng(seed); const unmet=Array(units).fill(0);const deficits=[];const allocations=[];
  for(let t=0;t<steps;t++){
    const demand=Array.from({length:units},(_,i)=> 5+(i%3)+Math.floor(rand()*7)+(t%17===0?(i%4)*4:0));
    const budget=demand.reduce((a,b)=>a+b,0)*0.72;
    const weights=policy==="feedback"? demand.map((d,i)=>d+0.8*unmet[i]):Array(units).fill(1);
    const wsum=weights.reduce((a,b)=>a+b,0);
    const alloc=weights.map(w=>budget*w/wsum);
    const miss=demand.map((d,i)=>Math.max(0,d-alloc[i]));
    miss.forEach((v,i)=>unmet[i]=v);
    deficits.push(miss.reduce((a,b)=>a+b,0)/demand.reduce((a,b)=>a+b,0));
    allocations.push(gini(alloc));
  }
  return {seed,policy,meanUnmet: deficits.reduce((a,b)=>a+b,0)/steps,meanAllocationGini:allocations.reduce((a,b)=>a+b,0)/steps};
}
function run(seeds=100) {
  const a=[],b=[];
  for(let seed=1;seed<=seeds;seed++){a.push(simulate(seed,"fixed"));b.push(simulate(seed,"feedback"));}
  const mean=(v,k)=>v.reduce((sum,x)=>sum+x[k],0)/v.length;
  return {status:"SYNTHETIC_ONLY_NOT_EMPIRICAL_VALIDATION",seeds,
    fixed:{meanUnmet:mean(a,"meanUnmet"),allocationGini:mean(a,"meanAllocationGini")},
    feedback:{meanUnmet:mean(b,"meanUnmet"),allocationGini:mean(b,"meanAllocationGini")},
    pairedDelta:{meanUnmet:mean(b,"meanUnmet")-mean(a,"meanUnmet"),
                 allocationGini:mean(b,"meanAllocationGini")-mean(a,"meanAllocationGini")},
    note:"Differences concern this toy demand/allocation model only. Not observational evidence, not a universal natural law."};
}
if(require.main===module) console.log(JSON.stringify(run(),null,2));
module.exports={rng,gini,simulate,run};
