// @flow
import React from 'react';

import IndexMenuItem from './indexMenuItem';
import { getChildrenFromArray } from '../../../../utils/tree';
import { type ItemNode } from '.';

type MenuListProps = {
  items: Array<ItemNode>,
  rootItem: string,
  identifier: string,
  className: string
};

type MenuListState = {
  selectedItem: string
};

class IndexMenuList extends React.Component<*, MenuListProps, MenuListState> {
  props: MenuListProps;

  static defaultProps = {
    className: '',
    parents: []
  };

  state = {
    selectedItem: ''
  };

  componentWillReceiveProps() {
    if (this.state.selectedItem) {
      this.setState({ selectedItem: '' });
    }
  }

  onItemChange = (active: boolean, itemId: string) => {
    this.setState({ selectedItem: active ? itemId : '' });
  };

  render() {
    const { rootItem, items, identifier, className } = this.props;
    const { selectedItem } = this.state;
    const rootItems = getChildrenFromArray(rootItem, items);
    if (rootItems.length === 0) return null;
    return (
      <div className={className}>
        {rootItems.map((item, index) => (
          <IndexMenuItem
            key={item.id}
            item={item}
            index={index + 1}
            items={items}
            selected={item.id === selectedItem}
            onChange={this.onItemChange}
            identifier={identifier}
          />
        ))}
      </div>
    );
  }
}

export default IndexMenuList;