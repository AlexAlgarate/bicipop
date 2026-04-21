export class BaseEntity {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
  ) {}
}
