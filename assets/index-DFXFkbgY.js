(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=s(n);fetch(n.href,r)}})();class z{saveSession(t){throw new Error("Método saveSession precisa ser implementado.")}getAllSessions(){throw new Error("Método getAllSessions precisa ser implementado.")}}class K extends z{saveSession(t){if(!t||!Array.isArray(t.questions)||t.questions.length===0){console.warn("Sessão ignorada: sem respostas registradas.");return}const s=JSON.parse(localStorage.getItem("allSessions"))||[];s.push(t),localStorage.setItem("allSessions",JSON.stringify(s))}getAllSessions(){return JSON.parse(localStorage.getItem("allSessions"))||[]}}const G={1:["+"],2:["+"],3:["+"],4:["+"],5:["+","-"],6:["+","-"],7:["+","-"],8:["+","-","*"],9:["+","-","*"],10:["+","-","*","/"],11:["^"],12:["frac"]},W={"+":e=>({terms:e<=4?2:3,min:1,max:50*e}),"-":e=>({terms:e<=6?2:3,min:1,max:30*e}),"*":e=>({terms:2,min:1,max:e<10?12+e:30}),"/":e=>({terms:2,maxDiv:10+e,exactDivision:e<12}),"^":()=>({baseMin:2,baseMax:6,expMin:2,expMax:4}),frac:()=>({numMin:1,numMax:9,denMin:2,denMax:10,operations:["+","-"]})},l=(e,t)=>Math.floor(Math.random()*(t-e+1))+e,B=new Map,X={"+":({terms:e,min:t,max:s})=>{const o=Array.from({length:e},()=>l(t,s));return{question:o.join(" + "),answer:o.reduce((n,r)=>n+r,0)}},"-":({terms:e,min:t,max:s})=>{const o=Array.from({length:e},()=>l(t,s)).sort((n,r)=>r-n);return{question:o.join(" - "),answer:o.reduce((n,r)=>n-r,0)}},"*":({min:e,max:t})=>{const s=l(e,t),o=l(e,t);return{question:`${s} × ${o}`,answer:s*o}},"/":({maxDiv:e,exactDivision:t})=>{const s=l(1,e),o=l(1,e),n=t?s*o:l(s+1,s*e);return{question:`${n} ÷ ${s}`,answer:Math.floor(n/s)}},"^":({baseMin:e,baseMax:t,expMin:s,expMax:o})=>{const n=l(e,t),r=l(s,o);return{question:`${n}^${r}`,answer:Math.pow(n,r)}},frac:({numMin:e,numMax:t,denMin:s,denMax:o,operations:n})=>{const r=n[Math.floor(Math.random()*n.length)],i=l(e,t),a=l(s,o),f=l(e,t),c=l(s,o),y=`${i}/${a} ${r} ${f}/${c}`,A=i/a,q=f/c,U=parseFloat((r==="+"?A+q:A-q).toFixed(2));return{question:y,answer:U}}};function C(e){const t=G[e]||["+"],s=B.get(e)||Object.fromEntries(t.map(c=>[c,0])),o=t.map(c=>1/(s[c]+1)),n=o.reduce((c,y)=>c+y,0),r=Math.random()*n;let i=0,a=t[0];for(let c=0;c<t.length;c++)if(i+=o[c],r<=i){a=t[c];break}s[a]++,B.set(e,s);const f=W[a](e);return X[a](f)}let p=600,v,w=!1,d=1;const Y={1:3,2:3,3:4,4:4,5:5,6:6,7:7,8:8,9:10,10:12,11:14,12:15};function E(){clearInterval(v),p=600}function Z(e,t){v=setInterval(()=>{w||(p--,e(p),p<=0&&(clearInterval(v),t()))},1e3)}function _(){return w=!w,w}function H(){const e=String(Math.floor(p/60)).padStart(2,"0"),t=String(p%60).padStart(2,"0");return`${e}:${t}`}function ee(e,t){const s=Y[d]||10;return e&&t<=s?d++:(!e||t>s*2)&&(d=Math.max(1,d-1)),d}function N(){return d}function F(e){d=e}function u(e,t){const s=document.getElementById(e);s&&(s.innerText=t)}function te(e,t=""){const s=document.getElementById(e);s&&(s.value=t)}function b(e,t){const s=document.getElementById(e);s&&(s.style.display=t?"inline-block":"none")}function h(e,t){const s=document.getElementById(e);s&&(s.style.display=t?"block":"none")}function se(e,t){const s=document.querySelector(`#${e} tbody`);s&&(s.innerHTML+=t)}function ne(e){const t=document.querySelector(`#${e} tbody`);t&&(t.innerHTML="")}let g={correct:0,incorrect:0},m,Q,S=[],$=new Set;const L=new K;function j(){var t;E(),h("answer-area",!0),g={correct:0,incorrect:0},S=[],$.clear();const e=L.getAllSessions();F(((t=e.at(-1))==null?void 0:t.finalLevel)||1),I(!0),O(),Z(O,J),D()}function I(e){b("start-button",!e),b("pause-button",e),b("stop-button",e),h("review-section",!1)}function O(){u("timer",`Time left: ${H()}`)}function oe(e){for(let t=0;t<10;t++){const s=C(e);if(!$.has(s.question))return $.add(s.question),s}return C(e)}function D(){const e=N();m=oe(e),u("question-text",m.question),te("answer"),u("feedback",""),Q=Date.now()}function M(){const e=document.getElementById("answer").value.trim();if(e==="")return alert("Please enter an answer.");const t=parseFloat(e),s=((Date.now()-Q)/1e3).toFixed(1),o=Math.abs(t-m.answer)<.01;g[o?"correct":"incorrect"]++,u("feedback",o?`Correct! Time: ${s}s`:`Incorrect. Correct answer: ${m.answer} | Time: ${s}s`),u("score",`Correct: ${g.correct} | Incorrect: ${g.incorrect}`),S.push({question:m.question,givenAnswer:t,correctAnswer:m.answer,time:s,isCorrect:o});const n=ee(o,s);F(n),D()}function T(){const e=_(),t=document.getElementById("pause-button");e?(t.innerHTML='<i class="fa fa-play"></i> Retomar',t.classList.add("resume")):(t.innerHTML='<i class="fa fa-pause"></i> Pausar',t.classList.remove("resume"))}function J(){E(),u("question-text","Session ended!"),I(!1),R(),h("answer-area",!1),V()}function R(){const[e,t]=H().split(":").map(Number),s={id:new Date().toLocaleString(),finalLevel:N(),score:{...g},totalTime:600-(e*60+t),questions:S};L.saveSession(s)}function V(){ne("review-table"),S.forEach((e,t)=>{const s=e.isCorrect?"acerto":"erro",o=e.isCorrect?"✅ Correta":"❌ Incorreta";se("review-table",`
          <tr>
            <td>${t+1}</td>
            <td>${e.question}</td>
            <td>${e.givenAnswer}</td>
            <td>${e.correctAnswer}</td>
            <td>${parseFloat(e.time).toFixed(1)}s</td>
            <td class="${s}">${o}</td>
          </tr>`)}),h("review-section",!0)}function re(){u("question-text","Session stopped!"),I(!1),R(),h("answer-area",!1),E(),V()}function x(){const e=L.getAllSessions(),t=document.getElementById("historico-sessoes");if(e.length===0){t.innerHTML="<p>Nenhuma sessão registrada.</p>";return}let s='<h3>Histórico de Sessões</h3><ul id="lista-historico">';e.forEach((o,n)=>{const[r,i]=o.id.split(", ");s+=`
          <li data-index="${n}">
            <div class="session-title">
              🧠 Sessão ${n+1}
              <button class="delete-btn" onclick="deletarSessao(${n})" title="Excluir sessão">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <div class="stats">
              <span>📅 ${r} às ${i}</span>
              <span>✅ ${o.score.correct} acertos</span>
              <span>❌ ${o.score.incorrect} erros</span>
            </div>
          </li>`}),s+='</ul><div id="detalhes-sessao"></div>',t.innerHTML=s,document.querySelectorAll("#lista-historico li").forEach(o=>{o.addEventListener("click",function(){const n=this.getAttribute("data-index"),r=e[n];let i=`
                <h4>Questões da Sessão ${parseInt(n)+1}</h4>
                <table class="historico-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Questão</th>
                            <th>Resposta Dada</th>
                            <th>Correta</th>
                            <th>Tempo</th>
                            <th>Resultado</th>
                        </tr>
                    </thead>
                    <tbody>
            `;r.questions.forEach((a,f)=>{i+=`
                    <tr>
                        <td>${f+1}</td>
                        <td>${a.question}</td>
                        <td>${a.givenAnswer}</td>
                        <td>${a.correctAnswer}</td>
                        <td>${a.time}s</td>
                        <td>${a.isCorrect?"✅":"❌"}</td>
                    </tr>
                `}),i+=`
                    </tbody>
                </table>
            `,document.getElementById("detalhes-sessao").innerHTML=i})})}var k;(k=document.getElementById("answer"))==null||k.addEventListener("keydown",e=>{e.key==="Enter"&&M()});var P;(P=document.getElementById("pause-button"))==null||P.addEventListener("click",T);window.startSession=j;window.submitAnswer=M;window.onPauseClick=T;window.endSession=J;window.mostrarHistorico=x;window.deletarSessao=function(e){if(!confirm("Tem certeza que deseja excluir esta sessão?"))return;const t=JSON.parse(localStorage.getItem("allSessions"))||[];t.splice(e,1),localStorage.setItem("allSessions",JSON.stringify(t)),x()};document.getElementById("start-button").addEventListener("click",j);document.getElementById("pause-button").addEventListener("click",T);document.getElementById("stop-button").addEventListener("click",re);document.getElementById("history-button").addEventListener("click",x);document.getElementById("answer-button").addEventListener("click",M);
