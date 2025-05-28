# mgraph.fromjson

Modern JSON graph parser for JavaScript — Load graphs from simple JSON format into mgraph.graph

[![npm version](https://img.shields.io/npm/v/mgraph.fromjson.svg)](https://www.npmjs.com/package/mgraph.fromjson)
[![License](https://img.shields.io/npm/l/mgraph.fromjson.svg)](https://github.com/mfeldman143/mgraph.fromjson/blob/main/LICENSE)

## About This Project

**mgraph.fromjson** is a modern ES module refactoring of **ngraph.fromjson**, originally developed by [Andrei Kashcha](https://github.com/anvaka). This project retains the functionality of the original library while updating it to modern JavaScript standards.

This project is **not affiliated with or endorsed by Andrei Kashcha**, and any modifications are the responsibility of the maintainers of **mgraph.fromjson**.

## Installation

### Via npm

```bash
npm install mgraph.fromjson
Via CDN
html<script src="https://cdn.jsdelivr.net/npm/mgraph.fromjson/dist/mgraph.fromjson.umd.min.js"></script>
When loaded from a CDN, the library is available as the global variable mgraphFromJSON.
Usage
ES Modules (Recommended)
javascriptimport fromJSON from 'mgraph.fromjson';

// Simple JSON format
const jsonString = `{
  "nodes": [
    {"id": "hello"},
    {"id": "world"}
  ],
  "links": [
    {"fromId": "hello", "toId": "world"}
  ]
}`;

const graph = fromJSON(jsonString);

console.log(graph.getNode('hello')); // returns a node
console.log(graph.getLinksCount());  // 1
CommonJS
javascriptconst fromJSON = require('mgraph.fromjson').default;
TypeScript
typescriptimport fromJSON from 'mgraph.fromjson';
import { Graph } from 'mgraph.graph';

const graph: Graph = fromJSON(jsonString);
CDN Usage
html<script src="https://cdn.jsdelivr.net/npm/mgraph.fromjson/dist/mgraph.fromjson.umd.min.js"></script>
<script>
  const jsonData = '{"nodes":[{"id":"a"}],"links":[]}';
  const graph = mgraphFromJSON(jsonData);
</script>
Advanced Usage
Custom Transform Functions
You can provide custom transform functions for more complex data structures:
javascriptimport fromJSON from 'mgraph.fromjson';

// Array-based format
const jsonData = {
  "nodes": [
    [1, "Custom node data"],
    [2, { label: "Node 2", weight: 5 }]
  ],
  "links": [
    [1, 2, "Custom link data"]
  ]
};

const graph = fromJSON(
  jsonData,
  // Node transform function
  function nodeTransform(node) {
    return { 
      id: node[0], 
      data: node[1] 
    };
  },
  // Link transform function  
  function linkTransform(link) {
    return { 
      fromId: link[0], 
      toId: link[1], 
      data: link[2] 
    };
  }
);

const node1 = graph.getNode(1);
console.log(node1.data); // "Custom node data"

const link = graph.getLink(1, 2);
console.log(link.data); // "Custom link data"
Complex Node Data
javascriptconst complexGraph = fromJSON(`{
  "nodes": [
    {
      "id": "user1",
      "data": {
        "name": "Alice",
        "age": 30,
        "department": "Engineering",
        "skills": ["JavaScript", "Python", "React"]
      }
    },
    {
      "id": "user2", 
      "data": {
        "name": "Bob",
        "age": 25,
        "department": "Design",
        "skills": ["Figma", "Sketch", "CSS"]
      }
    }
  ],
  "links": [
    {
      "fromId": "user1",
      "toId": "user2", 
      "data": {
        "relationship": "colleagues",
        "strength": 0.8,
        "since": "2023-01-15"
      }
    }
  ]
}`);

const alice = complexGraph.getNode('user1');
console.log(alice.data.skills); // ["JavaScript", "Python", "React"]
Loading from URLs
javascriptasync function loadGraphFromURL(url) {
  const response = await fetch(url);
  const jsonData = await response.text();
  return fromJSON(jsonData);
}

const graph = await loadGraphFromURL('/api/graph.json');
Framework Integration
React
jsximport { useEffect, useState } from 'react';
import fromJSON from 'mgraph.fromjson';

function GraphLoader({ jsonData }) {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    try {
      const parsedGraph = fromJSON(jsonData);
      setGraph(parsedGraph);
    } catch (error) {
      console.error('Failed to parse graph:', error);
    } finally {
      setLoading(false);
    }
  }, [jsonData]);
  
  if (loading) return <div>Loading graph...</div>;
  
  return (
    <div>
      <p>Nodes: {graph?.getNodesCount()}</p>
      <p>Links: {graph?.getLinksCount()}</p>
    </div>
  );
}
Vue
vue<template>
  <div v-if="graph">
    <p>Nodes: {{ graph.getNodesCount() }}</p>
    <p>Links: {{ graph.getLinksCount() }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import fromJSON from 'mgraph.fromjson';

const props = defineProps(['jsonData']);
const graph = ref(null);

watch(() => props.jsonData, (newData) => {
  if (newData) {
    graph.value = fromJSON(newData);
  }
}, { immediate: true });
</script>
Angular
typescriptimport { Component, Input, OnChanges } from '@angular/core';
import fromJSON from 'mgraph.fromjson';
import { Graph } from 'mgraph.graph';

@Component({
  selector: 'app-graph-loader',
  template: `
    <div *ngIf="graph">
      <p>Nodes: {{ graph.getNodesCount() }}</p>
      <p>Links: {{ graph.getLinksCount() }}</p>
    </div>
  `
})
export class GraphLoaderComponent implements OnChanges {
  @Input() jsonData: string = '';
  graph: Graph | null = null;

  ngOnChanges() {
    if (this.jsonData) {
      this.graph = fromJSON(this.jsonData);
    }
  }
}
API
fromJSON(jsonString, nodeTransform?, linkTransform?)
Parameters:

jsonString (string | object) - Graph data in JSON format
nodeTransform (function, optional) - Custom node transformation function
linkTransform (function, optional) - Custom link transformation function

Returns:

Graph - An mgraph.graph instance loaded with JSON data

Node Transform Function:
typescripttype NodeTransform = (nodeData: any) => { id: any, data?: any }
Link Transform Function:
typescripttype LinkTransform = (linkData: any) => { fromId: any, toId: any, data?: any }
JSON Format
Standard Format
json{
  "nodes": [
    {"id": "node1", "data": "optional node data"},
    {"id": "node2"}
  ],
  "links": [
    {"fromId": "node1", "toId": "node2", "data": "optional link data"}
  ]
}
Custom Array Format (with transforms)
json{
  "nodes": [
    ["node1", {"weight": 5}],
    ["node2", {"weight": 3}]
  ],
  "links": [
    ["node1", "node2", {"distance": 10}]
  ]
}
Compatible with mgraph.tojson
This library is designed to work with JSON output from mgraph.tojson:
javascriptimport toJSON from 'mgraph.tojson';
import fromJSON from 'mgraph.fromjson';

// Round-trip: graph → JSON → graph
const originalGraph = /* your graph */;
const jsonString = toJSON(originalGraph);
const restoredGraph = fromJSON(jsonString);
Part of the mgraph Ecosystem

mgraph.graph - Core graph data structure
mgraph.events - Event system
mgraph.forcelayout - Force-directed layouts
mgraph.generators - Graph generators
mgraph.fromdot - DOT file parser
mgraph.fromjson - JSON parser ← You are here
mgraph.merge - Object merging utility
mgraph.random - Seeded random numbers

Error Handling
javascripttry {
  const graph = fromJSON(invalidJsonString);
} catch (error) {
  if (error instanceof SyntaxError) {
    console.error('Invalid JSON format:', error.message);
  } else {
    console.error('Graph parsing error:', error.message);
  }
}
Performance

Memory efficient - Streaming JSON parsing for large graphs
Fast parsing - Optimized for common graph formats
Type safe - Full TypeScript support with proper type inference

License
This project is released under the BSD 3-Clause License, in compliance with the original ngraph.fromjson licensing terms. See LICENSE for details.
Contributing
Issues and pull requests are welcome on GitHub.
Credits
Original ngraph.fromjson by Andrei Kashcha.
Modern mgraph.fromjson maintained by Michael Feldman.

This README provides comprehensive documentation with:
- ✅ Modern ES module examples
- ✅ TypeScript support
- ✅ Framework integration examples
- ✅ Advanced usage patterns
- ✅ Complete API documentation
- ✅ Error handling guidance
- ✅ Performance notes
- ✅ Ecosystem integration
- ✅ Proper attribution and licensing