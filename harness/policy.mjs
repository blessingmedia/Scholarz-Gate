/** Public publishing policies are deterministic. A model's response cannot override them. */
export const STATES=Object.freeze(['discovered','extracted','verified','drafted','review_ready','approved','published','rejected','expired','correction_pending']);
export const ALLOWED=Object.freeze({
 discovered:['extracted','rejected'],extracted:['verified','rejected'],verified:['drafted','rejected'],drafted:['review_ready','rejected'],review_ready:['approved','rejected'],approved:['published','rejected'],published:['correction_pending','expired'],correction_pending:['review_ready','expired'],rejected:[],expired:[]
});
export function transition(from,to,actor){
 if(!ALLOWED[from]?.includes(to))throw Error(`Forbidden editorial transition: ${from} -> ${to}`);
 if(['approved','published'].includes(to)&&actor!=='owner')throw Error(`Owner authority required for transition to ${to}`);
 return {from,to,actor,at:new Date().toISOString()};
}
const httpsUrl = str=>{ try { const u=new URL(str);return u.protocol==='https:'&&!u.username&&!u.password; } catch {return false;} };
const isDate = str=>typeof str==='string'&&!Number.isNaN(Date.parse(str));
export function evaluateOpportunity(x,{now=new Date('2026-10-27T00:00:00Z')}={}){
 const errors=[],warnings=[];
 const req=(condition,message)=>{if(!condition)errors.push(message)};
 req(x&&typeof x==='object','Record is required'); if(!x||typeof x!=='object')return {ok:false,errors,warnings};
 req(typeof x.id==='string'&&/^opp_[a-z0-9_]{5,}$/.test(x.id),'Stable opportunity ID required');
 req(['applymate','global','learn'].includes(x.vertical),'Known vertical required');
 req(['course_collection','scholarship','internship','grant','exchange','student_report','learning_guide'].includes(x.kind),'Known content kind required');
 req(typeof x.title==='string'&&x.title.length>=12,'Clear title required');
 req(typeof x.summary==='string'&&x.summary.length>=50,'Useful summary required');
 req(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(x.slug||''),'Valid slug required');
 req(httpsUrl(x.source?.discoveryUrl),'Discovery source must be HTTPS');
 req(httpsUrl(x.source?.officialUrl),'Official source must be HTTPS');
 req(isDate(x.lastVerifiedAt),'Last verification date is required');
 req(isDate(x.nextReviewAt),'Next review date is required');
 req(typeof x.eligibility?.uncertainty==='string','Explicit eligibility uncertainty required');
 req(Array.isArray(x.claims)&&x.claims.length>0,'Claims and evidence required');
 for(const claim of x.claims||[]){req(Array.isArray(claim.evidence)&&claim.evidence.length>0&&claim.evidence.every(httpsUrl),`Claim ${claim.id||'unknown'} lacks valid evidence`);req(isDate(claim.checkedAt),`Claim ${claim.id||'unknown'} lacks verification time`);if(claim.risk==='high')warnings.push(`High-risk claim ${claim.id} requires an independent human source check`)}
 req(x.opportunity?.isSponsored===false||x.opportunity?.isSponsored===true,'Sponsorship flag required');
 if(x.opportunity?.deadlineKind==='fixed')req(isDate(x.opportunity.deadline),'Fixed deadline requires a valid date');
 if(x.opportunity?.deadlineKind==='fixed'&&isDate(x.opportunity.deadline)&&new Date(x.opportunity.deadline)<now)warnings.push('Past deadline: do not recommend as open');
 if(isDate(x.nextReviewAt)&&new Date(x.nextReviewAt)<now)warnings.push('Review overdue: do not present as freshly verified');
 if(x.vertical==='global'){
   req(x.report?.country,'Global report country required');
   req(x.report?.evidenceConsent===true,'Student consent required for personal reports');
   req(x.report?.factCheckBy!==undefined,'Global report must name a fact-checker');
 }
 const script=JSON.stringify(x);if(/guaranteed admission|100% guaranteed scholarship|all learners qualify/i.test(script))errors.push('Forbidden promise of guaranteed outcome');
 return {ok:errors.length===0,errors,warnings};
}
export function canEnterReview(record){const result=evaluateOpportunity(record);return result.ok&&result.warnings.every(x=>!x.startsWith('High-risk'))}
