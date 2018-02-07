import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { DumbTimelineSegment } from '../../../../../js/app/components/debate/navigation/timelineSegment';

describe('DumbTimeline component', () => {
  it('should match the DumbTimeline', () => {
    const timeline = [
      {
        identifier: 'foo',
        start: 'date1',
        end: 'date2',
        title: { entries: [{ en: 'Foo' }] }
      },
      {
        identifier: 'bar',
        start: 'date1Bar',
        end: 'date2Bar',
        title: { entries: [{ en: 'Bar' }] }
      }
    ];
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
      client: { query: () => {} },
      barPercent: 20,
      locale: 'en',
      debate: {
        debateData: {
          slug: 'slug',
          timeline: timeline
        }
      }
    };
    const renderer = new ShallowRenderer();
    renderer.render(<DumbTimelineSegment {...props} />);
    const rendered = renderer.getRenderOutput();
    expect(rendered).toMatchSnapshot();
  });
});