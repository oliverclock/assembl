import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { DumbIndexMenuItem } from '../../../../../../js/app/components/debate/navigation/menus/indexMenuItem';

describe('DumbIndexMenuItem component', () => {
  it('should match a closed menu item', () => {
    const items = [
      {
        id: 'fooId',
        title: 'Foo',
        parentId: 'rootId'
      },
      {
        id: 'barId',
        title: 'Bar',
        parentId: 'fooId'
      }
    ];
    const props = {
      index: 1,
      item: items[0],
      identifier: 'survey',
      items: items,
      slug: 'slug'
    };
    const renderer = new ShallowRenderer();
    renderer.render(<DumbIndexMenuItem {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });
  it('should match a selected menu item', () => {
    const items = [
      {
        id: 'fooId',
        title: 'Foo',
        parentId: 'rootId'
      },
      {
        id: 'barId',
        title: 'Bar',
        parentId: 'fooId'
      }
    ];
    const props = {
      index: 1,
      item: items[0],
      identifier: 'survey',
      items: items,
      selected: true,
      slug: 'slug'
    };
    const renderer = new ShallowRenderer();
    renderer.render(<DumbIndexMenuItem {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });
});