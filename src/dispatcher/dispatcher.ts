import DispatcherEvent from './dispatcherEvent';

export default class Dispatcher {
  private events: any;

  constructor(){
    this.events = {}
  }

  dispatch(eventName: string, data: any){
    const event = this.events[eventName]
    if(event){
      event.fire(data)
    }
  }

  //start listen event
  on(eventName: string, callback: Function){
    let event = this.events[eventName]
    if(!event){
      event = new DispatcherEvent(eventName)
      this.events[eventName] = event
    }
    event.registerCallback(callback)
  }

  //stop listen event
  off(eventName: string, callback: Function){
    const event = this.events[eventName]
    if(event){
      delete this.events[eventName]
    }
  }
}
