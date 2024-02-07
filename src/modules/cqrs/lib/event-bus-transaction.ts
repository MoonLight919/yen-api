export class EventBusTransaction {
  private _isActive = true;
  private _events: Function[] = [];

  public transaction(): EventBusTransaction {
    return new EventBusTransaction();
  }

  public send(event: Function): void {
    this._events.push(event);
  }

  public async commit(): Promise<void> {
    await Promise.all(this._events.map((item) => item()));
    this._isActive = false;
  }

  public async abort(): Promise<void> {
    this._events = [];
    this._isActive = false;
  }

  public isActive(): boolean {
    return this._isActive;
  }
}
