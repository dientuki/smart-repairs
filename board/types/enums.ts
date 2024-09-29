export enum OperationStatus {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  NO_CHANGE = "NO_CHANGE",
}

export enum DiscountType {
  Percentage = "percentage",
  Amount = "amount",
}

export enum TypedColumn {
  ForBudgeting = "ForBudgeting",
  Budgeting = "Budgeting",
  Budgeted = "Budgeted",
  ToDo = "ToDo",
  Repairing = "Repairing",
  Repaired = "Repaired",
}

export enum StyleColor {
  Danger = "danger",
  Gray = "gray",
  Info = "info",
  Primary = "primary",
  Success = "success",
  Warning = "warning",
}

export enum ButtonType {
  Button = "button",
  Submit = "submit",
  Reset = "reset",
}

export enum InputType {
  Text = "text",
  Number = "number",
  Email = "email",
  Tel = "tel",
}

export enum PackageType {
  Basic = "Basico",
  Medium = "Medio",
  Full = "Full",
}

export enum CountOperation {
  Increment = "increment",
  Decrement = "decrement",
}

export enum BudgetColumns {
  Itemable = "itemable",
  Quantity = "quantity",
  UnitPrice = "unitPrice",
  TotalPrice = "totalPrice",
  IncludeInSum = "includeInSum",
}

export enum Itemable {
  Part = "Part",
  ServiceJob = "ServiceJob",
  Discount = "Discount",
}

export enum TabStatusEnum {
  Active = "active",
  Inactive = "inactive",
  Completed = "completed",
}

export enum ApiLayerErrorEnum {
  Network = 'Network',
  Validation = 'Validation',
  GraphQL = 'GraphQL',
  Business = 'Business',
  Wtf = 'Wtf',
}
