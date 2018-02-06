import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { DumbTableMenuItem } from '../../../../../../js/app/components/debate/navigation/menus/tableMenuItem';

describe('DumbMenuItem component', () => {
  it('should match a selected menu item', () => {
    const props = {
      item: {
        id: 'fooId',
        title: 'Foo',
        img: {
          externalUrl: 'https://foo.bar/img'
        },
        numContributors: 10,
        numPosts: 123
      },
      identifier: 'survey',
      selected: true,
      hasSubItems: true,
      slug: 'slug'
    };
    const renderer = new ShallowRenderer();
    renderer.render(<DumbTableMenuItem {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });

  it('should match a not selected menu item', () => {
    const props = {
      item: {
        id: 'fooId',
        title: 'Foo',
        img: {
          externalUrl: 'https://foo.bar/img'
        },
        numContributors: 10,
        numPosts: 123
      },
      identifier: 'survey',
      selected: false,
      hasSubItems: true,
      slug: 'slug'
    };
    const renderer = new ShallowRenderer();
    renderer.render(<DumbTableMenuItem {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });
});