import { describe, test, expect } from 'vitest';
import createGraph from 'mgraph.graph';
import fromJSON from '../index.js';

describe('mgraph.fromjson', () => {
  test('it can restore from json object', () => {
    const jsonData = {
      nodes: [
        { id: 1 },
        { id: 2 }
      ],
      links: [
        { fromId: 1, toId: 2 }
      ]
    };
    
    const restored = fromJSON(jsonData);

    expect(restored.getNodesCount()).toBe(2);
    expect(restored.getLinksCount()).toBe(1);
  });

  test('it throws when json object has no links or nodes', () => {
    const json = {};
    expect(() => fromJSON(json)).toThrow('Cannot load graph without links and nodes');
  });

  test('it throws when node has no id', () => {
    const json = {
      nodes: [{}],
      links: []
    };
    expect(() => fromJSON(json)).toThrow('Graph node format is invalid: Node id is missing');
  });

  test('it throws when link has no fromId', () => {
    const json = {
      nodes: [{ id: 1 }],
      links: [{ toId: 1 }]
    };
    expect(() => fromJSON(json)).toThrow('Graph link format is invalid. Both fromId and toId are required');
  });

  test('can load graph from JSON string', () => {
    const jsonString = JSON.stringify({
      nodes: [{ id: 1 }, { id: 2 }],
      links: [{ fromId: 1, toId: 2 }]
    });

    const loadedGraph = fromJSON(jsonString);

    expect(loadedGraph.getNode(1)).toBeTruthy();
    expect(loadedGraph.getNode(2)).toBeTruthy();
    expect(loadedGraph.getNodesCount()).toBe(2);
    expect(loadedGraph.hasLink(1, 2)).toBeTruthy();
    expect(loadedGraph.getLinksCount()).toBe(1);
  });

  test('can load graph with transform functions', () => {
    let nodeTransformCalled = 0;
    let linkTransformCalled = 0;

    const jsonData = {
      nodes: [
        [1, 'Custom data'],
        [2, null]
      ],
      links: [
        [1, 2, 'Custom link data']
      ]
    };

    const loadedGraph = fromJSON(jsonData, nodeLoadTransform, linkLoadTransform);

    expect(loadedGraph.getNode(1)).toBeTruthy();
    expect(loadedGraph.getNode(2)).toBeTruthy();
    expect(loadedGraph.getNodesCount()).toBe(2);
    expect(loadedGraph.getNode(1).data).toBe('Custom data');
    expect(loadedGraph.hasLink(1, 2)).toBeTruthy();
    expect(loadedGraph.getLinksCount()).toBe(1);
    expect(loadedGraph.getLink(1, 2).data).toBe('Custom link data');
    expect(nodeTransformCalled).toBeGreaterThan(0);
    expect(linkTransformCalled).toBeGreaterThan(0);

    function nodeLoadTransform(node) {
      nodeTransformCalled += 1;
      return {
        id: node[0],
        data: node[1]
      };
    }

    function linkLoadTransform(link) {
      linkTransformCalled += 1;
      return {
        fromId: link[0],
        toId: link[1],
        data: link[2]
      };
    }
  });

  test('can load graph with node and link data', () => {
    const jsonData = {
      nodes: [
        { id: 'user1', data: { name: 'Alice', age: 30 } },
        { id: 'user2', data: { name: 'Bob', age: 25 } }
      ],
      links: [
        { fromId: 'user1', toId: 'user2', data: { relationship: 'friends' } }
      ]
    };

    const graph = fromJSON(jsonData);

    expect(graph.getNode('user1').data.name).toBe('Alice');
    expect(graph.getNode('user2').data.age).toBe(25);
    expect(graph.getLink('user1', 'user2').data.relationship).toBe('friends');
  });
});