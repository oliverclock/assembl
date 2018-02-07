import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { DumbTimelineMenu } from '../../../../../js/app/components/debate/navigation/timelineMenu';

describe('TimelineMenu component', () => {
  it('should match the TimelineMenu', () => {
    const phase = {
      title: {
        entries: [{ en: 'Foo' }]
      },
      start: 'date1',
      end: 'date2',
      identifier: 'foo'
    };
    const props = {
      phase: phase,
      locale: 'en'
    };
    const renderer = new ShallowRenderer();
    renderer.render(<DumbTimelineMenu {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });
  it('should match the vetical TimelineMenu', () => {
    const phase = {
      title: {
        entries: [{ en: 'Foo' }]
      },
      start: 'date1',
      end: 'date2',
      identifier: 'foo'
    };
    const props = {
      phase: phase,
      vertical: true,
      locale: 'en'
    };
    const renderer = new ShallowRenderer();
    renderer.render(<DumbTimelineMenu {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });
});