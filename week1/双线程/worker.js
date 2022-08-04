// * 逻辑层

importScripts('./middle.js');
importScripts('./event.js');

let App = null;
let _event = null;

onmessage = e => {
  console.log('web 线程接收到主线程的「启动」命令: ', e);
  _event = new Event('page');
  App = begin();
  if (e.data.isInit) {
    workerMessage({
      type: 'endInit',
      opt: Object.keys(App).map(item => {
        const { id, data, methods, template, mth, eventTypeMaps } = App[item];
        return {
          id,
          data: Object.assign({}, data, ...mth),
          mytemplate: template
        }
      })
    })
  }
  if (e.data.eventType !== undefined) {
    App[e.data.id].eventTypeMaps[e.data.eventType].call(App[e.data.id]);
  }
}

// todo postMesage
function workerMessage(data) {
  postMessage(data);
}

function begin() {
  const page_one = new Page(
    {
      id: 'page_one',
  
      data: {
        list: [
          { name: '张三', sex: '女' },
          { name: '李四', sex: '男' },
          { name: '王五', sex: '女' },
        ]
      },
  
      methods: {
        addList() {
          this.setState({
            list: [
              { name: '张三', sex: '女' },
              { name: '李四', sex: '男' },
              { name: '王五', sex: '女' },
              { name: '刘六', sex: '男' },
            ]
          })
        },
  
        removeList() {
          console.log( 'Remove list!' );
          this.setState({
            list: [
              { name: '李四', sex: '男' },
              { name: '王五', sex: '女' },
              { name: '刘六', sex: '男' },
            ]
          })
        }
      },
  
      template: `
        <div>
          <button onclick = <%:= addList %>>添加</button>
          <ul>
          <% for (var i = 0; i < list.length; i++) { %>
  
            <li>
                <p><%= list[i].name %></p>
                <p><%= list[i].sex %></p>
            </li>
      
          <% } %>
          </ul>
          <button onclick = <%= removeList %>>删除</button>
        </div>
      `
    },
    _event
  );

  const page_two = new Page(
    {
      id: 'page_two',
  
      data: {
        list: [
          { name: '张三', sex: '女' },
          { name: '李四', sex: '男' },
          { name: '王五', sex: '女' },
          { name: '刘六', sex: '女' },
          { name: '黄七', sex: '男' },
        ]
      },
  
      methods: {
        addList() {
          this.setState({
            list: [
              { name: '李四', sex: '男' },
              { name: '王五', sex: '女' },
              { name: '刘六', sex: '男' },
              { name: '黄七', sex: '男' },
            ]
          })
        },
  
        removeList() {
          console.log( 'Remove list!' );
          this.setState({
            list: [
              { name: '李四', sex: '男' },
              { name: '王五', sex: '女' },
              { name: '刘六', sex: '男' },
            ]
          })
        }
      },
  
      template: `
        <div>
          <button onclick = <%:= addList %>>添加</button>
          <ul>
          <% for (var i = 0; i < list.length; i++) { %>
  
            <li>
                <p><%= list[i].name %></p>
                <p><%= list[i].sex %></p>
            </li>
      
          <% } %>
          </ul>
          <button onclick = <%= removeList %>>删除</button>
        </div>
      `
    },
    _event
  )

  return {
    page_one,
    page_two
  }
}