import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { DumbIdeasMenu } from '../../../../../../js/app/components/debate/navigation/menus/ideasMenu';
import { MENU_KINDS } from '../../../../../../js/app/components/debate/navigation/menus';

describe('IdeasMenu component', () => {
  it('should match the TableMenu', () => {
    const data = {
      ideas: [
        {
          id: 'foo',
          parentId: 'root'
        },
        {
          id: 'bar',
          parentId: 'root'
        }
      ],
      rootIdea: {
        id: 'root'
      }
    };
    const props = {
      identifier: 'multiColumns',
      data: data
    };
    const renderer = new ShallowRenderer();
    renderer.render(<DumbIdeasMenu {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });
  it('should match the IndexMenu', () => {
    const data = {
      ideas: [
        {
          id: 'foo',
          parentId: 'root'
        },
        {
          id: 'bar',
          parentId: 'root'
        }
      ],
      rootIdea: {
        id: 'root'
      }
    };
    const props = {
      identifier: 'multiColumns',
      kind: MENU_KINDS.index,
      data: data
    };
    const renderer = new ShallowRenderer();
    renderer.render(<DumbIdeasMenu {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });
});