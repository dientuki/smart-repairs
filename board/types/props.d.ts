interface InputCellProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}

interface BooleanCellProps extends InputCellProps {}

interface DescriptionCellProps extends InputCellProps {}
