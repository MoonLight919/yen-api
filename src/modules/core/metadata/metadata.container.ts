export class MetadataContainer {
  static cloneFrom(
    metadata: MetadataContainer,
    parentTraceId?: string,
  ): MetadataContainer {
    return new MetadataContainer(metadata.traceId, parentTraceId).setIdUser(
      metadata.idUser,
    );
  }

  private _idUser: string;
  private _authType: string;

  get traceId(): string {
    return this._traceId;
  }

  get parentTraceId(): string | undefined {
    return this._parentTraceId;
  }

  get idUser(): string {
    return this._idUser;
  }

  get authType(): string {
    return this._authType;
  }

  constructor(
    private readonly _traceId: string,
    private readonly _parentTraceId?: string,
  ) {}

  public setIdUser(id: string): this {
    this._idUser = id;
    return this;
  }

  public setAuthType(type: string): this {
    this._authType = type;
    return this;
  }
}
