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
                                                    <img src='data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZS8+PC9kZWZzPjxwYXRoIGQ9Ik01MTIgODUuMzMzcTE4LjAwNSAwIDMwLjMzNiAxMi4zMzFsMjk4LjY2NyAyOTguNjY3cTEyLjMzIDEyLjMzIDEyLjMzIDMwLjMzNiAwIDE4LjM0Ni0xMi4xNiAzMC41MDZ0LTMwLjUwNiAxMi4xNnEtMTguMDA2IDAtMzAuMzM2LTEyLjMzTDU1NC42NjcgMjMwLjk5N1Y4OTZxMCAxNy42NjQtMTIuNTAyIDMwLjE2NVQ1MTIgOTM4LjY2N3QtMzAuMTY1LTEyLjUwMlQ0NjkuMzMzIDg5NlYyMzAuOTk3TDI0My42NyA0NTcuMDAzcS0xMi4zMyAxMi4zMy0zMC4zMzYgMTIuMzMtMTguMzQ2IDAtMzAuNTA2LTEyLjE2dC0xMi4xNi0zMC41MDZxMC0xOC4wMDYgMTIuMzMtMzAuMzM2TDQ4MS42NjQgOTcuNjY0cTEyLjMzLTEyLjMzIDMwLjMzNi0xMi4zM3oiIGZpbGw9IiNmZjYyMDAiLz48L3N2Zz4='/>
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
