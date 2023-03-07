import React, { useEffect } from "react";
import { useSigma } from "@react-sigma/core";
import { useLayoutCirclepack } from "@react-sigma/layout-circlepack";
import { keyBy, omit } from "lodash";

const GraphDataController = ({ dataset, filters, children }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const { positions, assign } = useLayoutCirclepack({
    center: 0,
    hierarchyAttributes: ["cluster"],
    scale: 10
  });

  /**
   * Feed graphology with the new dataset:
   */
  useEffect(() => {
    if (!graph || !dataset) return;

    const clusters = keyBy(dataset.clusters, "key");
    dataset.nodes.forEach(node =>
      graph.addNode(node.key, {
        ...node,
        ...omit(clusters[node.cluster], "key"),
        image: node.profile_picture_url //`/images/person.svg`,
      })
    );
    dataset.edges.forEach(([source, target]) => graph.addEdge(source, target, { size: 1 }));

    // Use degrees as node sizes:
    const scores = graph.nodes().map(node => graph.getNodeAttribute(node, "score"));
    const minDegree = Math.min(...scores);
    const maxDegree = Math.max(...scores);
    const MIN_NODE_SIZE = 20;
    const MAX_NODE_SIZE = 50;
    graph.forEachNode(node =>
      graph.setNodeAttribute(
        node,
        "size",
        ((graph.getNodeAttribute(node, "score") - minDegree) / (maxDegree - minDegree)) *
          (MAX_NODE_SIZE - MIN_NODE_SIZE) +
          MIN_NODE_SIZE
      )
    );

    assign();
    sigma.getCamera().animatedUnzoom(1.2);
    return () => graph.clear();
  }, [assign, dataset]);

  /**
   * Apply filters to graphology:
   */
  useEffect(() => {
    const { clusters } = filters;
    graph.forEachNode((node, { cluster, tag }) => graph.setNodeAttribute(node, "hidden", !clusters[cluster]));
  }, [graph, filters]);

  return <>{children}</>;
};

export default GraphDataController;
