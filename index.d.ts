declare module "mgraph.fromjson" {
  import { Graph } from "mgraph.graph";

  export interface NodeTransform {
    (nodeData: any): { id: any; data?: any };
  }

  export interface LinkTransform {
    (linkData: any): { fromId: any; toId: any; data?: any };
  }

  /**
   * Loads a graph from JSON data.
   *
   * @param jsonGraph - Graph data in JSON format (string or object)
   * @param nodeTransform - Optional: custom node transformation function
   * @param linkTransform - Optional: custom link transformation function
   * @returns The graph loaded with JSON data
   */
  export default function fromJSON(
    jsonGraph: string | object,
    nodeTransform?: NodeTransform,
    linkTransform?: LinkTransform
  ): Graph;
}