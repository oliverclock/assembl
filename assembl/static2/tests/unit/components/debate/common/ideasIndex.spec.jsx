import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { DumbIdeasIndex } from '../../../../../js/app/components/debate/common/ideasIndex';

describe('DumbIdeasIndex component', () => {
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
      rootItem: 'rootId',
      items: items,
      identifier: 'survey',
      slug: 'slug'
    };
    const renderer = new ShallowRenderer();
    renderer.render(<DumbIdeasIndex {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });
});