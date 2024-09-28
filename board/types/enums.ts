declare global {
  enum TypedColumn {
    ForBudgeting = "ForBudgeting",
    Budgeting = "Budgeting",
    Budgeted = "Budgeted",
    ToDo = "ToDo",
    Repairing = "Repairing",
    Repaired = "Repaired",
  }

  enum OperationStatus {
    CREATED = "CREATED",
    UPDATED = "UPDATED",
    NO_CHANGE = "NO_CHANGE",
  }

  enum DiscountType {
    Percentage = "percentage",
    Amount = "amount",
  }

  //export

  enum StyleColor {
    Danger = "danger",
    Gray = "gray",
    Info = "info",
    Primary = "primary",
    Success = "success",
    Warning = "warning",
  }

  enum ButtonType {
    Button = "button",
    Submit = "submit",
    Reset = "reset",
  }

  enum InputType {
    Text = "text",
    Number = "number",
    Email = "email",
    Tel = "tel",
  }

  enum PackageType {
    Basic = "Basico",
    Medium = "Medio",
    Full = "Full",
  }

  enum CountOperation {
    Increment = "increment",
    Decrement = "decrement",
  }

  enum BudgetColumns {
    Itemable = "itemable",
    Quantity = "quantity",
    UnitPrice = "unitPrice",
    TotalPrice = "totalPrice",
    IncludeInSum = "includeInSum",
  }

  enum Itemable {
    Part = "Part",
    ServiceJob = "ServiceJob",
    Discount = "Discount",
  }

  enum TabStatusEnum {
    Active = "active",
    Inactive = "inactive",
    Completed = "completed",
  }
}

export {}