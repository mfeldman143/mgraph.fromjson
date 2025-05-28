// index.js
import createGraph from 'mgraph.graph';

/**
 * Loads a graph from JSON data.
 *
 * @param {string|object} jsonGraph - Graph data in JSON format
 * @param {function} [nodeTransform] - Optional: custom node transformation function  
 * @param {function} [linkTransform] - Optional: custom link transformation function
 * @returns {object} The graph loaded with JSON data
 */
export default function load(jsonGraph, nodeTransform, linkTransform) {
  let stored;
  nodeTransform = nodeTransform || id;
  linkTransform = linkTransform || id;
  
  if (typeof jsonGraph === 'string') {
    stored = JSON.parse(jsonGraph);
  } else {
    stored = jsonGraph;
  }

  const graph = createGraph();

  if (stored.links === undefined || stored.nodes === undefined) {
    throw new Error('Cannot load graph without links and nodes');
  }

  for (let i = 0; i < stored.nodes.length; ++i) {
    const parsedNode = nodeTransform(stored.nodes[i]);
    if (!parsedNode.hasOwnProperty('id')) {
      throw new Error('Graph node format is invalid: Node id is missing');
    }

    graph.addNode(parsedNode.id, parsedNode.data);
  }

  for (let i = 0; i < stored.links.length; ++i) {
    const link = linkTransform(stored.links[i]);
    if (!link.hasOwnProperty('fromId') || !link.hasOwnProperty('toId')) {
      throw new Error('Graph link format is invalid. Both fromId and toId are required');
    }

    graph.addLink(link.fromId, link.toId, link.data);
  }

  return graph;
}

function id(x) { return x; }