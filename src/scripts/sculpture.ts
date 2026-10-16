// Original ray-marched sculpture. SVG remains as a fallback when WebGL is unavailable.
const canvas = document.querySelector<HTMLCanvasElement>('#sculpture-canvas');
const button = document.querySelector<HTMLButtonElement>('#remix-sculpture');
if(canvas && button) {
 let fallbackVariant=0;
 button.addEventListener('click',()=>{if(button.classList.contains('sculpture-ready'))return;fallbackVariant=(fallbackVariant+1)%3;const fallback=button.querySelector<SVGElement>('.sculpture-fallback');if(fallback)fallback.style.filter=`hue-rotate(${fallbackVariant*95}deg)`;});
 const gl = canvas.getContext('webgl', { alpha:true, antialias:false, powerPreference:'low-power', preserveDrawingBuffer:false });
 if(gl) {
  const vertexSource = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
  const fragmentSource = `precision highp float;
uniform vec2 resolution; uniform float time; uniform vec2 pointer; uniform float variant;
mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
float torus(vec3 p,float radius,float tube){return length(vec2(length(p.xz)-radius,p.y))-tube;}
float scene(vec3 p){
 p.xy=rot(-.48+pointer.x*.32)*p.xy;p.xz=rot(time*.18+pointer.x*.65)*p.xz;p.yz=rot(.6+pointer.y*.5+sin(time*.22)*.2)*p.yz;
 vec3 q=p;q.yz=rot(.35)*q.yz;float d=torus(q,1.05,.235);
 q=p;q.xy=rot(1.12)*q.xy;q.yz=rot(.8+variant*.12)*q.yz;d=min(d,torus(q,1.05,.235));
 q=p;q.xy=rot(-1.12)*q.xy;q.yz=rot(-.8-variant*.12)*q.yz;d=min(d,torus(q,1.05,.235));
 return d;
}
vec3 normal(vec3 p){vec2 e=vec2(.0015,0.);return normalize(vec3(scene(p+e.xyy)-scene(p-e.xyy),scene(p+e.yxy)-scene(p-e.yxy),scene(p+e.yyx)-scene(p-e.yyx)));}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y);vec3 ro=vec3(0.,0.,4.6);vec3 rd=normalize(vec3(uv*3.4,-4.6));
 float t=0.;float d=0.;for(int i=0;i<72;i++){d=scene(ro+rd*t);if(d<.002||t>8.)break;t+=d*.8;}
 if(t>8.||d>.006){gl_FragColor=vec4(0.);return;}
 vec3 p=ro+rd*t;vec3 n=normal(p);vec3 r=reflect(rd,n);vec3 light=normalize(vec3(-.6,.9,1.));
 vec3 blue=vec3(.075,.20,.92);if(variant>1.5)blue=vec3(.82,.18,.08);else if(variant>.5)blue=vec3(.17,.21,.25);
 float diffuse=max(dot(n,light),0.);float fresnel=pow(1.-max(dot(n,-rd),0.),2.5);
 float band=smoothstep(-.12,.08,r.y)-smoothstep(.3,.65,r.y);float top=smoothstep(.4,.85,r.y);
 vec3 color=blue*(.32+diffuse*.45);color=mix(color,vec3(.88,.93,1.),band*.84);color+=top*.38;
 float spec=pow(max(dot(reflect(-light,n),-rd),0.),55.);color+=vec3(1.)*spec*.8;color+=fresnel*vec3(.28,.42,.65);
 float ao=clamp(scene(p+n*.14)/.14,.35,1.);color*=ao*.35+.65;
 gl_FragColor=vec4(pow(max(color,0.),vec3(.85)),1.);
}`;
  function compile(type:number, source:string) { const shader=gl!.createShader(type); if(!shader) return null; gl!.shaderSource(shader,source); gl!.compileShader(shader); if(!gl!.getShaderParameter(shader,gl!.COMPILE_STATUS)){gl!.deleteShader(shader);return null;} return shader; }
  const vertex=compile(gl.VERTEX_SHADER,vertexSource), fragment=compile(gl.FRAGMENT_SHADER,fragmentSource);
  const program=gl.createProgram();
  if(vertex && fragment && program) {
   gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
   if(gl.getProgramParameter(program,gl.LINK_STATUS)) {
    gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const uniforms={resolution:gl.getUniformLocation(program,'resolution'),time:gl.getUniformLocation(program,'time'),pointer:gl.getUniformLocation(program,'pointer'),variant:gl.getUniformLocation(program,'variant')};
    let animation=0, inView=true, elapsed=0, last=0, variant=0, lost=false;
    let targetX=0,targetY=0,x=0,y=0;
    const paused=()=>document.documentElement.classList.contains('motion-off');
    function resize(){const rect=canvas!.getBoundingClientRect();const ratio=Math.min(devicePixelRatio || 1,1.25);const width=Math.round(rect.width*ratio),height=Math.round(rect.height*ratio);if(canvas!.width!==width||canvas!.height!==height){canvas!.width=width;canvas!.height=height;gl!.viewport(0,0,width,height);}draw();}
    function draw(){if(lost)return;gl!.uniform2f(uniforms.resolution,canvas!.width,canvas!.height);gl!.uniform1f(uniforms.time,elapsed);gl!.uniform2f(uniforms.pointer,x,y);gl!.uniform1f(uniforms.variant,variant);gl!.drawArrays(gl!.TRIANGLES,0,6);}
    function loop(now:number){animation=0;if(lost || paused()||document.hidden||!inView){last=0;return;}if(last)elapsed+=Math.min(now-last,50)/1000;last=now;x+=(targetX-x)*.07;y+=(targetY-y)*.07;draw();animation=requestAnimationFrame(loop);}
    function sync(){if(animation)cancelAnimationFrame(animation);animation=0;last=0;if(!paused()&&!document.hidden&&inView&&!lost)animation=requestAnimationFrame(loop);else draw();}
    button.addEventListener('pointermove',event=>{if(paused())return;const rect=button.getBoundingClientRect();targetX=(event.clientX-rect.left)/rect.width-.5;targetY=(event.clientY-rect.top)/rect.height-.5;});
    button.addEventListener('pointerleave',()=>{targetX=0;targetY=0;});
    button.addEventListener('click',()=>{variant=(variant+1)%3;draw();});
    document.addEventListener('portfolio-motionchange',sync);document.addEventListener('visibilitychange',sync);
    const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{rootMargin:'80px'});observer.observe(canvas);
    new ResizeObserver(resize).observe(canvas);
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;cancelAnimationFrame(animation);button.classList.remove('sculpture-ready');});
    resize();button.classList.add('sculpture-ready');sync();
   }
  }
 }
}
