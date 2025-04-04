
export interface TableConfig {
    columns?: TableColumn[];
    rowActions?: TableAction[];
    data?: any[];
}

export interface TableColumn {
    title?: string ;
    dataField?: string;
    type?: string;
    path?:string;
    class?: string;
}

export interface TableAction {
    icon?: string;
    label?:string;
    permission?: string ;
}

