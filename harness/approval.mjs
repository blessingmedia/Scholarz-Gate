import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
/** Signed authorization link for an APPROVAL REVIEW PAGE, not a click-to-publish GET URL. */
export function mintReviewToken({jobId,revision,ownerId,secret,now=Date.now(),ttlMs=86400000}){
 if(!secret||secret.length<32)throw Error('Review secret must have >=32 characters');
 if(!jobId||!ownerId||!revision)throw Error('Job, owner and revision are required');
 const payload={jobId,revision,ownerId,nonce:randomBytes(16).toString('hex'),expires:now+ttlMs,scope:'review:preview'};
 const data=Buffer.from(JSON.stringify(payload)).toString('base64url');const sig=createHmac('sha256',secret).update(data).digest('base64url');return data+'.'+sig;
}
export function validateReviewToken(token,{secret,jobId,revision,ownerId,now=Date.now(),consumeNonce}={}){
 if(!secret||secret.length<32)return {ok:false,reason:'Server signing key unavailable'};
 if(typeof token!=='string'||token.length>3000)return {ok:false,reason:'Bad token'};
 const [data,sig,extra]=token.split('.');if(!data||!sig||extra)return {ok:false,reason:'Bad token'};
 const expected=createHmac('sha256',secret).update(data).digest();let actual;
 try{actual=Buffer.from(sig,'base64url')}catch{return {ok:false,reason:'Bad signature'}}
 if(expected.length!==actual.length||!timingSafeEqual(expected,actual))return {ok:false,reason:'Bad signature'};
 let p;try{p=JSON.parse(Buffer.from(data,'base64url').toString('utf8'))}catch{return {ok:false,reason:'Bad payload'}};
 if(!p.expires||p.expires<=now)return {ok:false,reason:'Expired'};
 if(p.scope!=='review:preview'||p.jobId!==jobId||p.revision!==revision||p.ownerId!==ownerId)return {ok:false,reason:'Wrong scope or revision'};
 if(consumeNonce&&!consumeNonce(p.nonce))return {ok:false,reason:'Replayed'};
 return {ok:true,payload:p};
}
