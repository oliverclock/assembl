import { getChildren, getPartialTree, getChildrenFromArray } from '../../../js/app/utils/tree';

describe('Tree', () => {
  describe('Children getter', () => {
    it('should return the bar node', () => {
      const rootNode = { id: 'foo', ancestors: [] };
      const nodes = [{ id: 'foo', ancestors: [] }, { id: 'bar', ancestors: ['foo'] }, { id: 'tar', ancestors: ['bar'] }];
      const children = getChildren(rootNode, nodes);
      expect(children.length).toEqual(1);
      expect(children[0].id).toEqual('bar');
    });
  });
  describe('Partial tree', () => {
    it('should return the partial tree', () => {
      const nodes = [{ id: 'foo', ancestors: [] }, { id: 'bar', ancestors: ['foo'] }, { id: 'tar', ancestors: ['bar'] }];
      const tree = getPartialTree(nodes);
      const roots = tree.roots;
      const descendants = tree.descendants;
      expect(roots.length).toEqual(1);
      expect(roots[0].id).toEqual('foo');
      expect(descendants.length).toEqual(2);
      const ids = descendants.map(c => c.id);
      const expected = ['bar', 'tar'];
      expect(ids).toEqual(expect.arrayContaining(expected));
    });
  });

  describe('Children from array', () => {
    it('should return the fooBar item', () => {
      const items = [
        {
          id: 'foo',
          parentId: 'root'
        },
        {
          id: 'fooBar',
          parentId: 'foo'
        },
        {
          id: 'bar',
          parentId: 'root'
        }
      ];
      const children = getChildrenFromArray('foo', items);
      expect(children.length).toEqual(1);
      expect(children[0].id).toEqual('fooBar');
    });
  });
});