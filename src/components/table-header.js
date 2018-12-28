import CheckBox from './checkbox.vue';

export default {
    name: 'table-header',
    props: {
        columns: {
            type: Array,
            default: () => []
        },

        border: [Boolean],
        sort: {}
    },

    inject: ['table'],

    components: {
        CheckBox
    },

    methods: {
        getColumnClass (col, index) {
            const cls = ['v2-table__cell', 'v2-table__column-cell'];

            if (col.sortable && !col.type) {
                cls.push('sortable');
            }
            if (this.sort.prop === col.prop) {
                const order = this.sort.order || 'ascending';
                cls.push(order);
            }
            if (this.table.hoverColumnIndex === index) {
                cls.push('column-hover');
            }

            col.align === 'left' && cls.push('text-left');
            col.align === 'right' && cls.push('text-right');

            return cls.join(' ');
        },

        getColStyle (col) {
            const style = {};
            style.width = `${col.$realWidth}px`;

            return style;
        },

        changeSortRule (col) {
            return () => {
                if (col.sortable && !col.type) {
                    this.table.sortChange(col);
                }
            };
        }
    },

    render (h) {
        return (
            <table
                class={{ 'v2-table__header': true, 'v2-table__border': this.border, 'v2-table__header-border': this.border }}
                cellspacing='0'
                border='0'
                cellpadding='0'>
                <colgroup>
                    {
                        this.columns.map(column => <col style={ this.getColStyle(column) } />)
                    }
                </colgroup>
                <thead>
                    <tr>
                        {
                            this.columns.map((column, index) => {
                                let order = null;
                                let displayOrderIcon = false;
                                if (this.sort.prop === column.prop) {
                                    displayOrderIcon = true;
                                    order = this.sort.order || 'ascending';
                                }
                                const sortIconSrc = order === 'ascending'
                                    ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxMCAxMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOC4zIDUuN0w1LjU4MyAyLjk4M3Y3LjcyNUg0LjQxN1YyLjk4M0wxLjcgNS43bC0uODI1LS44MjUgMy4zLTMuM0w1IC43NWwuODI1LjgyNSAzLjMgMy4zeiIgZmlsbD0iI0ZGNjIwMCIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+'
                                    : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxMCAxMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOC4zIDUuNzU4TDUuNTgzIDguNDc1Vi43NUg0LjQxN3Y3LjcyNUwxLjcgNS43NThsLS44MjUuODI1IDMuMyAzLjMuODI1LjgyNS44MjUtLjgyNSAzLjMtMy4zeiIgZmlsbD0iI0ZGNjIwMCIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+';
                                return (
                                    <th key={index}
                                        on-mouseenter={() => this.table.hoverColumnIndex = index}
                                        on-mouseleave={() => this.table.hoverColumnIndex = -1}
                                        onClick={this.changeSortRule(column)}
                                        class={ this.getColumnClass(column, index) }
                                        style= {{ height: this.table.colHeight + 'px' }}
                                        colspan='1'
                                        rowspan='1'>
                                        {
                                            typeof column.renderHeader === 'function'
                                                ? column.renderHeader.call(this._renderProxy, h, { column, index })
                                                : column.label
                                        }
                                        {
                                            column.sortable && !column.type && displayOrderIcon
                                                ? <span class={['v2-table__caret-wrapper', order]} >
                                                    <img src={sortIconSrc}/>
                                                </span>
                                                : ''
                                        }
                                        {
                                            column.type === 'selection'
                                                ? <check-box cur-row-index={-1}></check-box>
                                                : ''
                                        }
                                    </th>
                                );
                            })
                        }
                    </tr>
                </thead>
            </table>
        );
    }
};
