export enum OperationStatus {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  NO_CHANGE = 'NO_CHANGE',
}

export enum UnlockType {
  NONE = 'none',
  CODE = 'code',
  PATTERN = 'pattern',
}

export enum DiscountType {
  None = 'None',
  Percentage = 'Percentage',
  Amount = 'Amount',
}

export enum TypedColumn {
  ForBudgeting = "ForBudgeting",
  Budgeting = "Budgeting",
  Budgeted = "Budgeted",
  ToDo = "ToDo",
  Repairing = "Repairing",
  Repaired = "Repaired",
}