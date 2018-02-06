// @flow
import React from 'react';
import TabMenuList from './tableMenuList';
import IndexMenuList from './indexMenuList';

export const MENU_KINDS = {
  index: 'index',
  table: 'table'
};

export type ItemNode = {
  id: string,
  title: string,
  img: {
    externalUrl: string
  },
  numContributors: number,
  numPosts: number,
  parentId: string
};

type MenuListProps = {
  kind: string
};

function MenuList(props: MenuListProps) {
  switch (props.kind) {
  case MENU_KINDS.index:
    return <IndexMenuList {...props} />;
  default:
    return <TabMenuList {...props} />;
  }
}

export { default as SurveyMenu } from './surveyMenu';
export { default as IdeasMenu } from './ideasMenu';
export { default as Menu } from './menu';
export default MenuList;