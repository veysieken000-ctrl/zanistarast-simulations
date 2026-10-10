"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const engine=require("../engine/simulation_engine");
const metrics=require("../engine/metrics");
const expected=["Ehad","Tek","Yek","Hebûn","Zanabûn","Mabûn","Rabûn","Rasterast"];
test("canonical sequence",()=>assert.deepEqual(engine.runScenario({}).pipeline,expected));
test("no evidence cannot verify",()=>assert.notEqual(engine.runScenario({}).result.verified,true));
test("no evidence cannot earn full score",()=>assert.notEqual(metrics.evaluate(engine.runScenario({})).score,1));
