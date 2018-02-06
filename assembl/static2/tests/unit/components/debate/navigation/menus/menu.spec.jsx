import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Menu from '../../../../../../js/app/components/debate/navigation/menus/menu';

describe('MenuTable component', () => {
  it('should match the survey table', () => {
    const props = {
      identifier: 'survey'
    };
    const renderer = new ShallowRenderer();
    renderer.render(<Menu {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });

  it('should match the default table (ideas table)', () => {
    const props = {
      identifier: 'foo'
    };
    const renderer = new ShallowRenderer();
    renderer.render(<Menu {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });
});