// * 渲染层

const worker = new Worker('./worker.js');
const MEvent = new Event('main');
const msg = {
  data: 'hello xjy',
  eventType: undefined,
  isInit: true,
  id: undefined
}

// todo 事件触发函数
function trick(type, id) {
  msg.eventType = type;
  msg.id = id.id;
  trickPostMsg();
}

const trackEvent = (type, opt) => {
  switch(type) {
    case 'addDom':
      MEvent.emit('addDom', opt);
      break;
    case 'changeDom':
      MEvent.emit('changeDom', opt);
      break;
    case 'endInit':
      MEvent.emit('endInit', opt);
      break;
  }
}

// todo setDOM
function setDom(data) {
  const { id, mytemplate } = data;
  if (document.getElementById(`${id}`)) {
    document.getElementById(`${id}`).innerHTML = mytemplate;
  } else {
    const script = document.createElement('script');
    const div = document.createElement('div');
    div.id = id + '-warper';
    script.id = id;
    script.type = 'text/html';
    script.innerHTML = mytemplate;
    document.body.appendChild(div);
    document.body.appendChild(script);
  }

  document.getElementById(`${id}-warper`).innerHTML = template(mytemplate, data.data);
}

MEvent.on('addDom', dom => {
  console.log( '增加了DOM', dom );
  const app = document.querySelector('#app');
  let parser = new DOMParser();
  console.log('parser: ', parser);
  let doc = parser.parseFromString(dom, "text/xml");
  console.log('doc: ', doc);
  let node = doc.getElementsByTagName('div')[0];
  console.log('node: ', node);
  app.appendChild(node);
})

MEvent.on('endInit', data => {
  msg.isInit = false;
  data.map(item => {
    setDom(item);
  })
})

MEvent.on('changeDom', data => {
  setDom(data);
})

worker.postMessage('主线程发出命令：开始吧!');

worker.onmessage = function(e) {
  trackEvent(e.data.type, e.data.opt);
}

function trickPostMsg() {
  worker.postMessage(msg);
}

trickPostMsg();