// @flow
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { get } from '../../../../utils/routeMap';
import IdeasIndex from '../../common/ideasIndex';
import { SECTION_INDEX_GENERATOR } from '../../../../utils/section';
import { getChildrenFromArray } from '../../../../utils/tree';
import { type ItemNode } from '.';

type MenuItemProps = {
  index: number,
  items: Array<ItemNode>,
  item: ItemNode,
  identifier: string,
  selected: boolean,
  slug: string,
  indexGenerator: Function,
  onChange: Function
};

export class DumbIndexMenuItem extends React.Component<*, MenuItemProps, void> {
  static defaultProps = {
    index: 1,
    indexGenerator: SECTION_INDEX_GENERATOR.alphanumericOr,
    parents: []
  };

  arrow = null;

  toggleMenu = (event: SyntheticMouseEvent<>) => {
    const { onChange, item, selected } = this.props;
    // scroll to the item
    const arrow = this.arrow;
    const menuContainer = document.getElementById('navbar-burger');
    if (menuContainer && arrow) {
      menuContainer.scrollTop = arrow.offsetTop;
    }
    if (onChange) onChange(!selected, item.id);
    event.preventDefault();
  };

  getTitle = () => {
    const { item, indexGenerator, index } = this.props;
    return `${indexGenerator([index])} ${item.title}`;
  };

  render() {
    const { index, identifier, item, selected, items, slug } = this.props;
    const { id, title } = item;
    const subItems = getChildrenFromArray(id, items);
    return (
      <div className="index-menu-item-container">
        <Link className="index-item" to={`${get('themeInPhase', { slug: slug, phase: identifier, themeId: id })}`}>
          <div className="thumb-body">
            <div title={title} className="thumb-title">
              {this.getTitle()}
            </div>
          </div>
          {subItems.length > 0 && (
            <span
              ref={(arrow) => {
                this.arrow = arrow;
              }}
              onClick={this.toggleMenu}
              className={classNames('thumb-arrow assembl-icon', {
                'assembl-icon-down-open': !selected,
                'assembl-icon-up-open': selected
              })}
            />
          )}
        </Link>
        <IdeasIndex
          parents={[index]}
          className={classNames('sub-index sub-index-1', { closed: !selected })}
          items={items}
          rootItem={id}
          identifier={identifier}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  slug: state.debate.debateData.slug
});

export default connect(mapStateToProps)(DumbIndexMenuItem);