import {readFileSync} from 'node:fs';
import {evaluateOpportunity, transition} from './policy.mjs';
import {EditorialHarness} from './orchestrator.mjs';
const [action,file]=process.argv.slice(2);
if(!['simulate','validate'].includes(action)||!file){console.error('Usage: node harness/cli.mjs validate|simulate content/google-ai-courses.json');process.exit(2)}
const draft=JSON.parse(readFileSync(file,'utf8'));
const assessment=evaluateOpportunity(draft);
if(action==='validate'){
  console.log(JSON.stringify(assessment,null,2));process.exit(assessment.ok?0:1)
}
let nextId=0;const jobs=new Map(),audit=[];
const harness=new EditorialHarness({
 sourceAdapter:{fetch:async()=>({ref:draft.source.discoveryUrl,body:'DEMO ONLY: source snapshot unavailable offline'})},
 extractionAgent:{extract:async()=>({...draft,status:'draft'})},
 verificationAgent:{verify:async(x)=>x},
 editorAgent:{draft:async(x)=>x},
 storage:{
  newJob:async()=>{const o={id:'demo_'+(++nextId),state:'discovered',revision:1};jobs.set(o.id,o);return o},
  hold:async(id,value)=>Object.assign(jobs.get(id),{state:'blocked',...value}),
  queueForReview:async(id,entry)=>Object.assign(jobs.get(id),{state:'review_ready',draft:entry}),
  getForReview:async(id)=>jobs.get(id),
  publishAtomically:async(id,rev,approval)=>Object.assign(jobs.get(id),{state:'published',revision:rev,approval})
 },
 audit:{write:entry=>audit.push(entry)}
});
const result=await harness.prepare(draft.source.discoveryUrl);
console.log(JSON.stringify({status:result.status,valid:assessment.ok,stageTrace:audit.map(x=>x.stage),warning:'Simulation only: no model API, email delivery, external fetch or publish operation is performed.'},null,2));
