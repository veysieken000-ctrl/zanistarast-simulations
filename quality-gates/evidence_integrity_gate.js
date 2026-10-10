'use strict';
const crypto=require('node:crypto');
const PIPELINE=Object.freeze(['Ehad','Tek','Yek','Hebûn','Zanabûn','Mabûn','Rabûn','Rasterast']);
function verifyRecord(record,trustedDigest){
 if(!record||typeof record!=='object'||Array.isArray(record))return {verified:false,reason:'missing record'};
 if(!Array.isArray(record.pipeline)||record.pipeline.length!==PIPELINE.length||!PIPELINE.every((x,i)=>x===record.pipeline[i]))return {verified:false,reason:'invalid pipeline'};
 if(typeof record.input!=='string'||typeof record.output!=='string'||!record.input.length||!record.output.length)return {verified:false,reason:'missing inputs or outputs'};
 if(typeof trustedDigest!=='string'||!/^[a-f0-9]{64}$/.test(trustedDigest))return {verified:false,reason:'no independent trusted digest'};
 const digest=crypto.createHash('sha256').update(record.input+'\n'+record.output).digest('hex');
 if(digest!==trustedDigest)return {verified:false,reason:'digest mismatch'};
 return {verified:true,reason:'integrity only; scientific validity not established'};
}
module.exports={PIPELINE,verifyRecord};
