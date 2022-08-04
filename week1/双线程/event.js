class Event {
  constructor(name) {
    this.name = name;
    this.observes = {};
  }

  on(type, fn) {
    if (this.observes[ type ] === undefined) {
      this.observes[ type ] = [];
    }
    this.observes[ type ].push( fn );
  }

  emit(type, opt) {
    this.observes[ type ].map(item => {
      item(opt);
    })
  }
}

const events = new Event();

events.on('buy', (data) => {
  console.log( '我去买', data.name );
})

events.on('go', () => {
  console.log( '我走了' );
})

events.emit('buy', { name: '可乐' });
events.emit('buy', { name: '雪碧' });