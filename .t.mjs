import fs from 'node:fs'
const html = fs.readFileSync('index.html','utf8')
let script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
const EXPOSE = '  Object.assign(globalThis, { go, toast, choose, openSheet, closeSheet, submitLeave, openDetail, renderDetail, renderRecords, toggleMore, askCancel, askRenew, askDelete, showDialog, closeDialog, runDialogAction });'
  + '  window.__api = { submitLeave, openDetail, toggleMore };'
  + '  renderRecords();\n  show('
script = script.replace('  renderRecords();\n  show(', EXPOSE)
const all=[]; const idMap=new Map()
class El{
  constructor(t){this.tagName=(t||'div').toUpperCase();this.children=[];this.parentElement=null;this.dataset={};this.attrs={};this.value='';this._text='';this._s=new Set();this.listeners={};this.style={};this.id='';this.disabled=false;all.push(this)}
  get classList(){const s=this._s;return{add:(...c)=>c.forEach(x=>s.add(x)),remove:(...c)=>c.forEach(x=>s.delete(x)),toggle:(c,f)=>{const on=f===undefined?!s.has(c):!!f;on?s.add(c):s.delete(c);return on},contains:c=>s.has(c)}}
  get className(){return [...this._s].join(' ')} set className(v){this._s=new Set(String(v).split(/\s+/).filter(Boolean))}
  set textContent(v){this._text=String(v);this.children=[]} get textContent(){return this._text+this.children.map(c=>c.textContent).join('')}
  set innerHTML(v){this._html=String(v);if(v===''){this.children.forEach(c=>{const i=all.indexOf(c);if(i>=0)all.splice(i,1)});this.children=[]}} get innerHTML(){return this._html||''}
  get firstChild(){return this.children[0]||null}
  appendChild(c){c.parentElement=this;this.children.push(c);return c}
  setAttribute(k,v){this.attrs[k]=String(v)} getAttribute(k){return this.attrs[k]??null}
  addEventListener(t,f){(this.listeners[t]||=[]).push(f)}
  fire(t,ev={}){(this.listeners[t]||[]).forEach(f=>f.call(this,{type:t,target:this,preventDefault(){},stopPropagation(){},...ev}))}
  click(){const ev={type:'click',target:this,preventDefault(){},stopPropagation(){}};const inl=this.attrs.onclick;if(inl)new Function(inl).call(this,ev);if(typeof this.onclick==='function')this.onclick.call(this,ev);this.fire('click',ev)}
  closest(sel){let n=this;const c=sel.replace('.','');while(n){if(n._s.has(c))return n;n=n.parentElement}return null}
  _desc(){const o=[];const w=n=>n.children.forEach(c=>{o.push(c);w(c)});w(this);return o}
  querySelector(s){return this._desc().find(n=>n._match(s))||null} querySelectorAll(s){return this._desc().filter(n=>n._match(s))}
  _match(sel){sel=String(sel).trim();const at=[];sel=sel.replace(/\[([\w-]+)(?:="([^"]*)")?\]/g,(_,k,v)=>{at.push([k,v]);return''})
    const ok=sel.split(/(?=[.#])/).filter(Boolean).every(p=>p.startsWith('.')?this._s.has(p.slice(1)):p.startsWith('#')?this.id===p.slice(1):this.tagName===p.toUpperCase())
    if(!ok)return false
    return at.every(([k,v])=>{const g=k.startsWith('data-')?this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]:this.attrs[k];return v===undefined?g!==undefined&&g!==null:String(g)===v})}
}
const root=new El('div');const st=[root]
const tagRe=/<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:\s+[^>]*?)?)(\/?)>/g;const attrRe=/([\w-]+)(?:\s*=\s*"([^"]*)")?/g
const VOID=new Set(['meta','link','input','img','br','hr','source']);const SVG=new Set(['path','circle','rect','line','polyline','polygon','ellipse','stop','use'])
let m,last=0
while((m=tagRe.exec(html))){const tx=html.slice(last,m.index).trim();if(tx)st[st.length-1]._text+=tx;last=tagRe.lastIndex
  const[,cl,tag,at,sf]=m;if(!tag)continue;const lt=tag.toLowerCase()
  if(lt==='script'){last=html.indexOf('</script>',last)+9;tagRe.lastIndex=last;continue}
  if(lt==='style'){last=html.indexOf('</style>',last)+8;tagRe.lastIndex=last;continue}
  if(cl){if(st.length>1)st.pop();continue}
  const el=new El(tag);let a;attrRe.lastIndex=0
  while((a=attrRe.exec(at))){const[,k,v]=a;if(!k)continue
    if(k==='class')el.className=v||'';else if(k==='id'){el.id=v||'';if(v)idMap.set(v,el)}
    else{el.attrs[k]=v??'';if(k.startsWith('data-'))el.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v??''}}
  st[st.length-1].appendChild(el);if(!sf&&!VOID.has(lt)&&!SVG.has(lt))st.push(el)}
const lsData=new Map()
const localStorage={getItem:k=>lsData.has(k)?lsData.get(k):null,setItem:(k,v)=>lsData.set(k,String(v)),removeItem:k=>lsData.delete(k)}
const timers=[]
const document={readyState:'loading',body:root,getElementById:id=>idMap.get(id)||null,querySelector:s=>all.find(n=>n._match(s))||null,querySelectorAll:s=>all.filter(n=>n._match(s)),createElement:t=>new El(t),addEventListener(t,f){this._dcl=f}}
const window={addEventListener(){},history:{pushState(){},back(){}},setTimeout:(fn,ms)=>{timers.push({fn,ms});return timers.length},clearTimeout:id=>{if(id)timers[id-1]=null},localStorage}
const errs=[]
try{new Function('document','window','history','setTimeout','clearTimeout','localStorage','console',script)(document,window,window.history,window.setTimeout,window.clearTimeout,localStorage,console);if(document._dcl)document._dcl()}catch(e){errs.push(e.message)}
const R=[];const ck=(n,ok,ex='')=>R.push(`${ok?'PASS':'FAIL'}  ${n}${ex?'  → '+ex:''}`)
const vis=id=>idMap.get(id)._s.has('active')?'ACTIVE':'hidden'
const opts=()=>all.filter(n=>n.tagName==='BUTTON'&&n.parentElement&&n.parentElement.id==='sheetOptions')
ck('脚本无异常',errs.length===0,errs.join('; '))
all.find(n=>n.dataset&&n.dataset.nav==='leave-list').click()
all.find(n=>n.dataset&&n.dataset.nav==='leave-new').click()
all.find(n=>n.dataset&&n.dataset.picker==='nature').click(); opts().find(b=>b.textContent==='病假').click()
all.find(n=>n.dataset&&n.dataset.picker==='type').click(); opts().find(b=>b.textContent==='整天').click()
idMap.get('reason').value='拿快递'; idMap.get('phone').value='18207266771'
window.__api.submitLeave()
idMap.get('recordList').children[0].click()
ck('进详情页',vis('screen-leave-detail')==='ACTIVE')
const more=idMap.get('dMore')
ck('展开按钮能找到所属卡片（dcard）',!!more.closest('.dcard'))
window.__api.toggleMore()
ck('展开后卡片带 open 类',more.closest('.dcard')._s.has('open'))
ck('展开后按钮文字变收起',more.textContent.includes('收起'))
ck('详情页有 4 张 dcard',all.filter(n=>n._s.has('dcard')).length===4,String(all.filter(n=>n._s.has('dcard')).length))
ck('工作台的 .card 网格没被影响',all.filter(n=>n._s.has('card')&&n.tagName==='DIV'&&!n._s.has('dcard')).length>0)
console.log(R.join('\n'))
console.log(R.some(r=>r.startsWith('FAIL'))?'\n结论：有问题':'\n结论：通过')
