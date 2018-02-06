import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { DumbSurveyMenu } from '../../../../../../js/app/components/debate/navigation/menus/surveyMenu';
import { MENU_KINDS } from '../../../../../../js/app/components/debate/navigation/menus';

describe('SurveyMenu component', () => {
  it('should match the TableMenu', () => {
    const data = {
      thematics: [
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
      identifier: 'survey',
      data: data
    };
    const renderer = new ShallowRenderer();
    renderer.render(<DumbSurveyMenu {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });

  it('should match the IndexMenu', () => {
    const data = {
      thematics: [
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
      identifier: 'survey',
      kind: MENU_KINDS.index,
      data: data
    };
    const renderer = new ShallowRenderer();
    renderer.render(<DumbSurveyMenu {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });
});