export default class DispatcherEvent {
  eventName: string;
  callbacks: any[];

  constructor(eventName: string) {
    this.eventName = eventName;
    this.callbacks = [];
  }

  registerCallback(callback: () => void): void {
    this.callbacks.push(callback);
  }

  fire(data: any): void {
    this.callbacks.forEach((callback) => {
      callback(data);
    });
  }
}
