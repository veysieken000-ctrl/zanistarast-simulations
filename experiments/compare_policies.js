"use strict";
/**
 * Exploratory, synthetic experiment: matched-input resource allocation policies.
 * Not evidence for metaphysical or universal physical claims.
 * Run: node experiments/compare_policies.js
 */
const POLICIES = Object.freeze(["random", "accumulation", "centralized", "feedback"]);
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gini(values) {
  const n=values.length;
  if(n===0) throw new Error("empty population");
  const sum=values.reduce((a,b)=>a+b,0);
  if(sum===0) return 0;
  let distances=0;
  for(let i=0;i<n;i++)for(let j=0;j<n;j++)distances+=Math.abs(values[i]-values[j]);
  return distances/(2*n*sum);
}
function makeConditions({seed=17,agents=40,steps=60}={}) {
  if(!Number.isInteger(seed)||!Number.isInteger(agents)||agents<4||agents>1000||
     !Number.isInteger(steps)||steps<3||steps>10000) throw new Error("invalid parameters");
  const next=rng(seed);
  const initial=Array.from({length:agents},()=>next()*2);
  const production=Array.from({length:steps},(_,t)=>Array.from({length:agents},()=>{
    const raw=next()<0.25?0.1:next()*1.9;
    return (t>=Math.floor(steps/3)&&t<Math.floor(steps/2))?raw*0.50:raw;
  }));
  const randomRecipients=Array.from({length:steps},()=>Array.from({length:agents},
    ()=>Math.floor(next()*agents)));
  return {seed,agents,steps,initial,production,randomRecipients};
}
function transfer(resources,source,dest,amount) {
  if(source===dest||amount<=0) return 0;
  const moved=Math.min(resources[source],amount);
  resources[source]-=moved;resources[dest]+=moved;
  return moved;
}
function allocate(policy,r,t,conditions) {
  const n=r.length;let amount=0;
  if(policy==="random") {
    for(let i=0;i<n;i++) if(r[i]>1.5) {
      amount+=transfer(r,i,conditions.randomRecipients[t][i],0.30);
    }
  } else if(policy==="accumulation") {
    // Deliberately extreme concentration comparator, not an empirical market model.
    const recipient=n-1;
    for(let i=0;i<n-1;i++)amount+=transfer(r,i,recipient,r[i]*0.15);
  } else if(policy==="centralized") {
    // Fixed uniform levy, blind equal redistribution.
    let pool=0;
    for(let i=0;i<n;i++){const levy=r[i]*0.20;r[i]-=levy;pool+=levy;amount+=levy;}
    for(let i=0;i<n;i++)r[i]+=pool/n;
  } else if(policy==="feedback") {
    // Respond to observed unmet need, without predicting future production.
    const donors=Array.from({length:n},(_,i)=>i).filter(i=>r[i]>1)
      .sort((a,b)=>r[b]-r[a]||a-b);
    const recipients=Array.from({length:n},(_,i)=>i).filter(i=>r[i]<1)
      .sort((a,b)=>r[a]-r[b]||a-b);
    for(const j of recipients)for(const i of donors) {
      if(r[j]>=1-1e-10)break;
      const x=Math.min(Math.max(0,r[i]-1),1-r[j]);
      amount+=transfer(r,i,j,x);
    }
  } else throw new Error("unknown policy");
  return amount;
}
function simulate(conditions,policy) {
  if(!POLICIES.includes(policy))throw new Error("unknown policy");
  let r=[...conditions.initial],series=[],maxError=0;
  for(let t=0;t<conditions.steps;t++) {
    const before=r.reduce((a,b)=>a+b,0);
    const production=conditions.production[t].reduce((a,b)=>a+b,0);
    for(let i=0;i<r.length;i++)r[i]+=conditions.production[t][i];
    const moved=allocate(policy,r,t,conditions);
    let supplied=0;
    for(let i=0;i<r.length;i++){let c=Math.min(1,r[i]);r[i]-=c;supplied+=c;}
    if(r.some(x=>!Number.isFinite(x)||x< -1e-9))throw new Error("invalid resource state");
    const after=r.reduce((a,b)=>a+b,0);
    const err=Math.abs(before+production-supplied-after);
    maxError=Math.max(maxError,err);
    if(err>1e-7)throw new Error("resource accounting violated");
    series.push({step:t,coverage:supplied/r.length,gini:gini(r),moved,
      shortage:r.length-supplied,shock:t>=Math.floor(conditions.steps/3)&&t<Math.floor(conditions.steps/2)});
  }
  const mean=(key)=>series.reduce((v,x)=>v+x[key],0)/series.length;
  return {policy,seed:conditions.seed,agents:r.length,steps:conditions.steps,
    meanCoverage:mean("coverage"),meanGini:mean("gini"),meanTransfer:mean("moved"),
    shockCoverage:series.filter(x=>x.shock).reduce((v,x)=>v+x.coverage,0)/series.filter(x=>x.shock).length,
    maxAccountingError:maxError,series,
    epistemicStatus:"SYNTHETIC_EXPERIMENT_NOT_EMPIRICALLY_VALIDATED"};
}
function compare({seeds=[11,23,37,53,71],agents=40,steps=60}={}) {
  if(!Array.isArray(seeds)||seeds.length===0||seeds.some(s=>!Number.isInteger(s)))throw new Error("invalid seeds");
  return seeds.flatMap(seed=>{
    const conditions=makeConditions({seed,agents,steps});
    return POLICIES.map(p=>simulate(conditions,p));
  });
}
if(require.main===module){
  const results=compare();
  const compact=results.map(({policy,seed,meanCoverage,meanGini,meanTransfer,shockCoverage,maxAccountingError,epistemicStatus})=>
    ({policy,seed,meanCoverage,meanGini,meanTransfer,shockCoverage,maxAccountingError,epistemicStatus}));
  process.stdout.write(JSON.stringify({parameters:{seeds:[11,23,37,53,71],agents:40,steps:60},
    data:compact,interpretation:"Synthetic policy comparison only; not a scientific validation of Zanistarast itself"},null,2)+"\n");
}
module.exports={POLICIES,rng,gini,makeConditions,allocate,simulate,compare};
