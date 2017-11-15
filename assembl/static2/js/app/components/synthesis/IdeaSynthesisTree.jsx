// @flow

import React from 'react';

import Section from '../common/section';
import { getPartialTree, getChildren } from '../../utils/tree';
import IdeaSynthesis from './IdeaSynthesis';

import type { SynthesisIdea } from './IdeaSynthesis';

const IdeaSynthesisTree = (props: {
  rootIdea: SynthesisIdea,
  slug: string,
  subIdeas: Array<SynthesisIdea>,
  index: number,
  parents: Array<number>
}) => {
  const { rootIdea, slug, subIdeas, index, parents } = props;
  const { roots, children } = getPartialTree(subIdeas);
  const newParents = parents.slice();
  newParents.push(index);
  return (
    <Section displayIndex title={rootIdea.live.title} index={index} parents={parents} className="idea-synthesis-section">
      <IdeaSynthesis level={parents.length + 1} idea={rootIdea} slug={slug} />
      {roots.map((idea, subIndex) => {
        return (
          <IdeaSynthesisTree
            key={idea.id}
            rootIdea={idea}
            index={subIndex + 1}
            parents={newParents}
            subIdeas={getChildren(idea, children)}
            slug={slug}
          />
        );
      })}
    </Section>
  );
};

export default IdeaSynthesisTree;