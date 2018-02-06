import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import TableMenuList from '../../../../../../js/app/components/debate/navigation/menus/tableMenuList';

describe('MenuList component', () => {
  it('should match the MenuList', () => {
    const items = [
      {
        id: 'foo',
        parentId: 'root'
      },
      {
        id: 'bar',
        parentId: 'root'
      }
    ];
    const props = {
      identifier: 'survey',
      className: 'debate-class',
      rootItem: 'root',
      items: items
    };
    const renderer = new ShallowRenderer();
    renderer.render(<TableMenuList {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });
});