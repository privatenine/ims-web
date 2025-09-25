import type { ComponentSize } from 'element-plus/es/constants/index.mjs';
import type { Nullable } from 'element-plus/es/utils/index.mjs';

import type {
  ComponentInternalInstance,
  CSSProperties,
  PropType,
  Ref,
  VNode,
} from 'vue';

import type { Store } from '../store';
import type { TableColumnCtx } from '../table-column/defaults';
import type TableLayout from '../table-layout';
import type {
  TableOverflowTooltipFormatter,
  TableOverflowTooltipOptions,
} from '../util';

import { useSizeProp } from 'element-plus/es/hooks/use-size/index.mjs'

type DefaultRow = Record<PropertyKey, any>;

interface TableRefs {
  tableWrapper: HTMLElement;
  headerWrapper: HTMLElement;
  footerWrapper: HTMLElement;
  fixedBodyWrapper: HTMLElement;
  rightFixedBodyWrapper: HTMLElement;
  bodyWrapper: HTMLElement;
  appendWrapper: HTMLElement;
  [key: string]: any;
}

interface TableState {
  isGroup: Ref<boolean>;
  resizeState: Ref<{
    height: any;
    width: any;
  }>;
  doLayout: () => void;
  debouncedUpdateLayout: () => void;
}

interface TreeProps {
  hasChildren?: string;
  children?: string;
  checkStrictly?: boolean;
}

type HoverState<T extends DefaultRow> = Nullable<{
  cell: HTMLElement;
  column: TableColumnCtx<T>;
  row: T;
}>;

type RIS<T extends DefaultRow> = {
  $index: number;
  expanded: boolean;
  row: T;
  store: Store<T>;
};

type RenderExpanded<T extends DefaultRow> = ({
  row,
  $index,
  store,
  expanded,
}: RIS<T>) => undefined | VNode[];

type SummaryMethod<T extends DefaultRow> = (data: {
  columns: TableColumnCtx<T>[];
  data: T[];
}) => (string | VNode)[];

interface Table<T extends DefaultRow = any> extends ComponentInternalInstance {
  $ready: boolean;
  hoverState?: HoverState<T> | null;
  renderExpanded: RenderExpanded<T>;
  store: Store<T>;
  layout: TableLayout<T>;
  refs: TableRefs;
  tableId: string;
  state: TableState;
}

type ColumnCls<T> = ((data: { row: T; rowIndex: number }) => string) | string;
type ColumnStyle<T> =
  | ((data: { row: T; rowIndex: number }) => CSSProperties)
  | CSSProperties;
type CellCls<T extends DefaultRow> =
  | ((data: {
      column: TableColumnCtx<T>;
      columnIndex: number;
      row: T;
      rowIndex: number;
    }) => string)
  | string;
type CellStyle<T extends DefaultRow> =
  | ((data: {
      column: TableColumnCtx<T>;
      columnIndex: number;
      row: T;
      rowIndex: number;
    }) => CSSProperties)
  | CSSProperties;
type Layout = 'auto' | 'fixed';
interface TableProps<T extends DefaultRow> {
  data: T[];
  size?: ComponentSize;
  width?: number | string;
  height?: number | string;
  maxHeight?: number | string;
  fit?: boolean;
  stripe?: boolean;
  border?: boolean;
  rowKey?: ((row: T) => string) | string;
  context?: Table<T>;
  showHeader?: boolean;
  showSummary?: boolean;
  sumText?: string;
  summaryMethod?: SummaryMethod<T>;
  rowClassName?: ColumnCls<T>;
  rowStyle?: ColumnStyle<T>;
  cellClassName?: CellCls<T>;
  cellStyle?: CellStyle<T>;
  headerRowClassName?: ColumnCls<T>;
  headerRowStyle?: ColumnStyle<T>;
  headerCellClassName?: CellCls<T>;
  headerCellStyle?: CellStyle<T>;
  highlightCurrentRow?: boolean;
  currentRowKey?: number | string;
  emptyText?: string;
  expandRowKeys?: Array<string>;
  defaultExpandAll?: boolean;
  defaultSort?: Sort;
  tooltipEffect?: string;
  tooltipOptions?: TableOverflowTooltipOptions;
  spanMethod?: (data: {
    column: TableColumnCtx<T>;
    columnIndex: number;
    row: T;
    rowIndex: number;
  }) =>
    | number[]
    | undefined
    | {
        colspan: number;
        rowspan: number;
      };
  selectOnIndeterminate?: boolean;
  indent?: number;
  treeProps?: TreeProps;
  lazy?: boolean;
  load?: (row: T, treeNode: TreeNode, resolve: (data: T[]) => void) => void;
  className?: string;
  style?: CSSProperties;
  tableLayout?: Layout;
  scrollbarAlwaysOn?: boolean;
  flexible?: boolean;
  showOverflowTooltip?: boolean | TableOverflowTooltipOptions;
  tooltipFormatter?: TableOverflowTooltipFormatter<T>;
  appendFilterPanelTo?: string;
  scrollbarTabindex?: number | string;
  nativeScrollbar?: boolean;
}

type TableTooltipData<T extends DefaultRow> = Parameters<
  TableOverflowTooltipFormatter<T>
>[0];
type TableSortOrder = 'ascending' | 'descending';

interface Sort {
  prop: string;
  order: TableSortOrder;
  init?: any;
  silent?: any;
}

interface Filter<T extends DefaultRow> {
  column: TableColumnCtx<T>;
  values: string[];
  silent: any;
}

interface TreeNode {
  expanded?: boolean;
  loading?: boolean;
  noLazyChildren?: boolean;
  indent?: number;
  level?: number;
  display?: boolean;
}

interface RenderRowData<T extends DefaultRow> {
  store: Store<T>;
  _self: Table<T>;
  column: TableColumnCtx<T>;
  row: T;
  $index: number;
  cellIndex: number;
  treeNode?: TreeNode;
  expanded: boolean;
}

export default {
  /**
   * @description table data
   */
  data: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  /**
   * @description size of Table
   */
  size: useSizeProp,
  width: [String, Number],
  /**
   * @description table's height. By default it has an `auto` height. If its value is a number, the height is measured in pixels; if its value is a string, the value will be assigned to element's style.height, the height is affected by external styles
   */
  height: [String, Number],
  /**
   * @description table's max-height. The legal value is a number or the height in px
   */
  maxHeight: [String, Number],
  /**
   * @description whether width of column automatically fits its container
   */
  fit: {
    type: Boolean,
    default: true,
  },
  /**
   * @description whether Table is striped
   */
  stripe: {
    type: Boolean,
    default: true,
  },
  /**
   * @description whether Table has vertical border
   */
  border: {
    type: Boolean,
    default: true,
  },
  /**
   * @description key of row data, used for optimizing rendering. Required if `reserve-selection` is on or display tree data. When its type is String, multi-level access is supported, e.g. `user.info.id`, but `user.info[0].id` is not supported, in which case `Function` should be used
   */
  rowKey: [String, Function] as PropType<TableProps<any>['rowKey']>,
  /**
   * @description whether Table header is visible
   */
  showHeader: {
    type: Boolean,
    default: true,
  },
  /**
   * @description whether to display a summary row
   */
  showSummary: Boolean,
  /**
   * @description displayed text for the first column of summary row
   */
  sumText: String,
  /**
   * @description custom summary method
   */
  summaryMethod: Function as PropType<TableProps<any>['summaryMethod']>,
  /**
   * @description function that returns custom class names for a row, or a string assigning class names for every row
   */
  rowClassName: [String, Function] as PropType<TableProps<any>['rowClassName']>,
  /**
   * @description function that returns custom style for a row, or an object assigning custom style for every row
   */
  rowStyle: [Object, Function] as PropType<TableProps<any>['rowStyle']>,
  /**
   * @description function that returns custom class names for a cell, or a string assigning class names for every cell
   */
  cellClassName: [String, Function] as PropType<
    TableProps<any>['cellClassName']
  >,
  /**
   * @description function that returns custom style for a cell, or an object assigning custom style for every cell
   */
  cellStyle: [Object, Function] as PropType<TableProps<any>['cellStyle']>,
  /**
   * @description function that returns custom class names for a row in table header, or a string assigning class names for every row in table header
   */
  headerRowClassName: [String, Function] as PropType<
    TableProps<any>['headerRowClassName']
  >,
  /**
   * @description function that returns custom style for a row in table header, or an object assigning custom style for every row in table header
   */
  headerRowStyle: [Object, Function] as PropType<
    TableProps<any>['headerRowStyle']
  >,
  /**
   * @description function that returns custom class names for a cell in table header, or a string assigning class names for every cell in table header
   */
  headerCellClassName: [String, Function] as PropType<
    TableProps<any>['headerCellClassName']
  >,
  /**
   * @description function that returns custom style for a cell in table header, or an object assigning custom style for every cell in table header
   */
  headerCellStyle: [Object, Function] as PropType<
    TableProps<any>['headerCellStyle']
  >,
  /**
   * @description whether current row is highlighted
   */
  highlightCurrentRow: Boolean,
  /**
   * @description key of current row, a set only prop
   */
  currentRowKey: [String, Number],
  /**
   * @description displayed text when data is empty. You can customize this area with `#empty`
   */
  emptyText: String,
  /**
   * @description set expanded rows by this prop, prop's value is the keys of expand rows, you should set row-key before using this prop
   */
  expandRowKeys: Array as PropType<TableProps<any>['expandRowKeys']>,
  /**
   * @description whether expand all rows by default, works when the table has a column type="expand" or contains tree structure data
   */
  defaultExpandAll: Boolean,
  /**
   * @description set the default sort column and order. property `prop` is used to set default sort column, property `order` is used to set default sort order
   */
  defaultSort: Object as PropType<TableProps<any>['defaultSort']>,
  /**
   * @description the `effect` of the overflow tooltip
   */
  tooltipEffect: String,
  /**
   * @description the options for the overflow tooltip, [see the following tooltip component](tooltip.html#attributes)
   */
  tooltipOptions: Object as PropType<TableProps<any>['tooltipOptions']>,
  /**
   * @description method that returns rowspan and colspan
   */
  spanMethod: Function as PropType<TableProps<any>['spanMethod']>,
  /**
   * @description controls the behavior of master checkbox in multi-select tables when only some rows are selected (but not all). If true, all rows will be selected, else deselected
   */
  selectOnIndeterminate: {
    type: Boolean,
    default: true,
  },
  /**
   * @description horizontal indentation of tree data
   */
  indent: {
    type: Number,
    default: 16,
  },
  /**
   * @description configuration for rendering nested data
   */
  treeProps: {
    type: Object as PropType<TableProps<any>['treeProps']>,
    default: () => {
      return {
        hasChildren: 'hasChildren',
        children: 'children',
        checkStrictly: false,
      };
    },
  },
  /**
   * @description whether to lazy loading data
   */
  lazy: Boolean,
  /**
   * @description method for loading child row data, only works when `lazy` is true
   */
  load: Function as PropType<TableProps<any>['load']>,
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
  className: {
    type: String,
    default: '',
  },
  /**
   * @description sets the algorithm used to lay out table cells, rows, and columns
   */
  tableLayout: {
    type: String as PropType<Layout>,
    default: 'fixed',
  },
  /**
   * @description always show scrollbar
   */
  scrollbarAlwaysOn: Boolean,
  /**
   * @description ensure main axis minimum-size doesn't follow the content
   */
  flexible: Boolean,
  /**
   * @description whether to hide extra content and show them in a tooltip when hovering on the cell.It will affect all the table columns
   */
  showOverflowTooltip: [Boolean, Object] as PropType<
    TableProps<any>['showOverflowTooltip']
  >,
  /**
   * @description function that formats cell tooltip content, works when `show-overflow-tooltip` is `true`
   */
  tooltipFormatter: Function as PropType<TableProps<any>['tooltipFormatter']>,
  appendFilterPanelTo: String,
  scrollbarTabindex: {
    type: [Number, String],
    default: undefined,
  },
  /**
   * @description whether to allow drag the last column
   */
  allowDragLastColumn: {
    type: Boolean,
    default: true,
  },
  /**
   * @description whether to preserve expanded row content in DOM when collapsed
   */
  preserveExpandedContent: Boolean,
  /**
   * @description whether to use native scrollbars
   */
  nativeScrollbar: Boolean,
};
export type {
  CellCls,
  CellStyle,
  ColumnCls,
  ColumnStyle,
  DefaultRow,
  Filter,
  RenderExpanded,
  RenderRowData,
  Sort,
  SummaryMethod,
  Table,
  TableColumnCtx,
  TableProps,
  TableRefs,
  TableSortOrder,
  TableTooltipData,
  TreeNode,
  TreeProps,
};
