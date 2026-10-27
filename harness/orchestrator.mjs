import { evaluateOpportunity,transition } from './policy.mjs';
/**
 * Provider-independent harness. Model adapters MAY propose structured data, but deterministic
 * policy checks and owner publication privileges remain outside the model.
 */
export class EditorialHarness {
  constructor({sourceAdapter,extractionAgent,verificationAgent,editorAgent,storage,audit}){
    Object.assign(this,{sourceAdapter,extractionAgent,verificationAgent,editorAgent,storage,audit});
  }
  async prepare(url){
    const job=await this.storage.newJob({sourceUrl:url,state:'discovered'});
    const log=(stage,payload)=>this.audit.write({jobId:job.id,stage,payload,time:new Date().toISOString()});
    try{
      const snapshot=await this.sourceAdapter.fetch(url); // untrusted material
      const extracted=await this.extractionAgent.extract({snapshot,sourceUrl:url});
      log('extract',{sourceUrl:url,claims:extracted.claims?.length??0});
      const verified=await this.verificationAgent.verify(extracted); // must attach official URLs
      log('verify',{officialUrl:verified.source?.officialUrl,claims:verified.claims?.length??0});
      const draft=await this.editorAgent.draft(verified); // no filesystem, DB, or publish capabilities
      const result=evaluateOpportunity(draft);
      log('policy',{ok:result.ok,errors:result.errors,warnings:result.warnings});
      if(!result.ok) {await this.storage.hold(job.id,{draft,reason:result.errors});return {jobId:job.id,status:'blocked',errors:result.errors}}
      await this.storage.queueForReview(job.id,draft);
      log('review_ready',{revision:1});
      return {jobId:job.id,status:'review_ready',draft};
    }catch(e){await this.storage.hold(job.id,{reason:['Pipeline failure; requires inspection']});log('failed',{message:String(e).slice(0,300)});throw e;}
  }
  async publishApproved({jobId,ownerApproval,revision}){
    if(ownerApproval?.actor!=='owner'||ownerApproval?.approved!==true)throw Error('Explicit owner approval required');
    const item=await this.storage.getForReview(jobId);
    if(item.revision!==revision)throw Error('Approval revision is stale');
    const proof=evaluateOpportunity(item.draft,{now:new Date()});
    if(!proof.ok||proof.warnings.length)throw Error('Policy/expiry must be cleared before publication');
    transition('review_ready','approved','owner');
    await this.storage.publishAtomically(jobId,revision,ownerApproval);
    this.audit.write({jobId,stage:'published',revision,time:new Date().toISOString()});
    return {status:'published',slug:item.draft.slug};
  }
}
/** Production adapter contract; replace these four parts independently. */
export const ADAPTER_CONTRACT={
 sourceAdapter:'fetch({url}) -> immutable source snapshot with timestamp/hash',
 extractionAgent:'extract({snapshot,sourceUrl}) -> structured candidate; zero write authority',
 verificationAgent:'verify(candidate) -> primary URL evidence, conflicting facts, recency',
 editorAgent:'draft(verified) -> schema-conforming proposal with African context',
 storage:'newJob, hold, queueForReview, getForReview, publishAtomically',
 audit:'append-only events with actor, version and reason'
};
