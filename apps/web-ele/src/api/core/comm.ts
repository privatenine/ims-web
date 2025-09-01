export namespace CommApi {
  export interface SortParam {
    field: string; // 要排序的字段, 后端返回的字段是什么就传什么 ,
    type: number; // 排序类型, 1 正序 -1 倒序
  }
  export interface PageParam {
    pageNum?: number;
    pageSize?: number;
    sortParam?: SortParam;
  }

  export interface Response<T = any> {
    additionInfo?: null | string;
    code: number; // 1表示成功，其他值表示失败
    data: T;
    msg: string;
    requestTime?: null | number;
    total: number;
  }

  export interface ColumnType {
    fieldName: string; // 字段名称
    label: string; // label
    value?: string; // 值
    sign?: number;
  }
}
