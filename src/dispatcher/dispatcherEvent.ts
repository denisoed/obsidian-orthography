export default class DispatcherEvent {
  eventName: string;
  callbacks: any[];

  constructor(eventName: string) {
    this.eventName = eventName;
    this.callbacks = [];
  }

  registerCallback(callback: any) {
    this.callbacks.push(callback);
  }

  fire(data: any) {
    this.callbacks.forEach((callback) => {
      callback(data);
    });
  }
}
