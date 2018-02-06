// @flow
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { get } from '../../../utils/routeMap';
import { SECTION_INDEX_GENERATOR } from '../../../utils/section';
import { getChildrenFromArray } from '../../../utils/tree';

type ItemNode = {
  id: string,
  parentId: string,
  title: string
};

type IdeasIndexProps = {
  identifier: string,
  rootItem: string,
  items: Array<ItemNode>,
  parents: Array<number>,
  slug: string,
  className: ?string,
  indexGenerator: Function
};

export class DumbIdeasIndex extends React.Component<*, IdeasIndexProps, void> {
  static defaultProps = {
    className: '',
    indexGenerator: SECTION_INDEX_GENERATOR.alphanumericOr,
    parents: []
  };

  getTitle = (item: ItemNode, index: number) => {
    const { indexGenerator, parents } = this.props;
    const indexes = parents.slice();
    indexes.push(index);
    return `${indexGenerator(indexes)} ${item.title}`;
  };

  render() {
    const { parents, rootItem, identifier, items, slug, className } = this.props;
    const rootItems = getChildrenFromArray(rootItem, items);
    if (rootItems.length === 0) return null;
    return (
      <div className={classNames('index-container', className)}>
        {rootItems.map((item, index) => {
          const newParents = parents.slice();
          const itemIndex = index + 1;
          newParents.push(itemIndex);
          return (
            <div className="index-item-container" key={item.id}>
              <Link className="index-item" to={`${get('themeInPhase', { slug: slug, phase: identifier, themeId: item.id })}`}>
                {this.getTitle(item, itemIndex)}
              </Link>
              <DumbIdeasIndex
                parents={newParents}
                className={`sub-index sub-index-${newParents.length}`}
                items={items}
                rootItem={item.id}
                identifier={identifier}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  slug: state.debate.debateData.slug
});

export default connect(mapStateToProps)(DumbIdeasIndex);