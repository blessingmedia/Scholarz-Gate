import http from 'node:http';
import { handle } from './app.mjs';
const port=Number(process.env.PORT||8787);
http.createServer(async (req,res)=>{
 try {const reqUrl=new URL(req.url,`http://localhost:${port}`);const response=handle(new Request(reqUrl,{method:req.method}));res.writeHead(response.status,Object.fromEntries(response.headers));res.end(req.method==='HEAD'?'':await response.text())}
 catch(err){console.error(err);res.writeHead(500);res.end('Internal error')}
}).listen(port,()=>console.log(`ApplyMate core at http://localhost:${port}`));
