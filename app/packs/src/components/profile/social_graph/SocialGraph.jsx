import React, { useEffect, useState } from "react";
import { SigmaContainer, ZoomControl, FullScreenControl } from "@react-sigma/core";
import { omit, mapValues, keyBy, constant } from "lodash";
import { ethers } from "ethers";

import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import GraphSettingsController from "./GraphSettingsController";
import GraphEventsController from "./GraphEventsController";
import GraphDataController from "./GraphDataController";
import ClustersPanel from "./ClustersPanel";
import SearchField from "./SearchField";
import drawLabel from "./canvas-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faCompress, faTimes, faColumns } from "@fortawesome/free-solid-svg-icons";

const SocialGraph = ({ talent }) => {
  const [showContents, setShowContents] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [dataset, setDataset] = useState(null);
  const [filtersState, setFiltersState] = useState({
    clusters: {}
  });
  const [hoveredNode, setHoveredNode] = useState(null);

  const talentToken = talent.talentToken;

  const getConnectionTypeCluster = type => {
    switch (type) {
      case "super_connection":
        return "1";
      case "supporting":
        return "2";
      case "supporter":
        return "3";
      case "follower":
        return "4";
      case "following":
      default:
        return "5";
    }
  };

  const calculateScore = connection => {
    let score = 1;
    switch (connection.connection_type) {
      case "super_connection":
        score = 1.1 + (1000 * connection.connected_user_invested_amount) / talent.totalSupply;
        break;
      case "supporting":
        score = 1 + (1000 * connection.user_invested_amount) / talent.totalSupply;
        break;
      case "supporter":
        score = 1 + (1000 * connection.connected_user_invested_amount) / talent.totalSupply;
        break;
      case "follower":
      case "following":
      default:
        score = 1;
        break;
    }
    return score;
  };

  const buildCoinLabelString = connection => {
    let s = "";
    if (connection.ticker != "" && connection.user_invested_amount > 0) {
      s += `${(connection.user_invested_amount / 10e18).toFixed(2)} $${connection.ticker}`;
    }
    if (talentToken.ticker != "" && connection.connected_user_invested_amount > 0) {
      if (s.length > 0) s += " - ";
      s += `${(connection.connected_user_invested_amount / 10e18).toFixed(2)} $${talentToken.ticker}`;
    }
    return s;
  };
  const transformResponseToGraphData = response => {
    let nodes = [];
    let edges = [];
    const clusters = [
      { key: "0", color: "#6c3e81", clusterLabel: "Talent Profile" },
      { key: "1", color: "#579f5f", clusterLabel: "Super Connection" },
      { key: "2", color: "#57a835", clusterLabel: "Supporting" },
      { key: "3", color: "#7145cd", clusterLabel: "Supporter" },
      { key: "4", color: "#666666", clusterLabel: "Follower" },
      { key: "5", color: "#d043c4", clusterLabel: "Following" }
    ];

    // add self node
    nodes.push({
      key: talent.user.username,
      label: talent.user.name,
      coinLabel: talentToken.ticker
        ? `${ethers.utils.formatUnits(talent.totalSupply)} $${talentToken.ticker} - ${
            talent.supportersCount
          } supporters`
        : "",
      URL: `https://beta.talentprotocol.com/u/${talent.user.username}`,
      cluster: "0",
      x: 0,
      y: 0,
      score: 1
    });

    // add connection nodes & edges
    response.connections.map((connection, i) => {
      nodes.push({
        key: connection.username,
        label: connection.name,
        coinLabel: buildCoinLabelString(connection),
        URL: `https://beta.talentprotocol.com/u/${connection.username}`,
        cluster: getConnectionTypeCluster(connection.connection_type),
        x: 0,
        y: 0,
        score: calculateScore(connection)
      });
      edges.push([talent.user.username, connection.username]);
    });

    return {
      nodes: nodes,
      edges: edges,
      clusters: clusters
    };
  };

  // Load connections data on mount:
  useEffect(() => {
    fetch(`/api/v1/connections?id=${talent.user.uuid}`)
      .then(res => {
        return res.json();
      })
      .then(json => {
        // transform response to proper format for graphology
        return transformResponseToGraphData(json);
      })
      .then(dataset => {
        setDataset(dataset);
        setFiltersState({
          clusters: mapValues(keyBy(dataset.clusters, "key"), constant(true))
        });
        requestAnimationFrame(() => setDataReady(true));
      });
  }, []);

  if (!dataset) return null;
  return (
    <div id="social-graph-wrapper" className={`social-graph-wrapper ` + (showContents ? "show-contents" : "")}>
      <SigmaContainer
        style={{height: "500px"}}
        graphOptions={{ type: "directed" }}
        settings={{
          nodeProgramClasses: { image: getNodeProgramImage() },
          labelRenderer: drawLabel,
          defaultNodeType: "image",
          defaultEdgeType: "arrow",
          labelDensity: 0.07,
          labelGridCellSize: 60,
          labelRenderedSizeThreshold: 15,
          labelFont: "Lato, sans-serif",
          zIndex: true
        }}
        className="react-sigma"
      >
        <GraphSettingsController hoveredNode={hoveredNode} />
        <GraphEventsController setHoveredNode={setHoveredNode} />
        <GraphDataController dataset={dataset} filters={filtersState} />

        {dataReady && (
          <>
            <div className="controls">
              <div className="ico">
                <button
                  type="button"
                  className="show-contents"
                  onClick={() => setShowContents(true)}
                  title="Show caption and description"
                >
                  <FontAwesomeIcon icon={faColumns} />
                </button>
              </div>
              <FullScreenControl
                className="ico"
                customEnterFullScreen={<FontAwesomeIcon icon={faExpand} />}
                customExitFullScreen={<FontAwesomeIcon icon={faCompress} />}
              />
              <ZoomControl className="ico" />
            </div>
            <div className="contents">
              <div className="ico">
                <button
                  type="button"
                  className="ico hide-contents"
                  onClick={() => setShowContents(false)}
                  title="Show caption and description"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="panels">
                <SearchField filters={filtersState} />

                <ClustersPanel
                  clusters={dataset.clusters}
                  filters={filtersState}
                  setClusters={clusters =>
                    setFiltersState(filters => ({
                      ...filters,
                      clusters
                    }))
                  }
                  toggleCluster={cluster => {
                    setFiltersState(filters => ({
                      ...filters,
                      clusters: filters.clusters[cluster]
                        ? omit(filters.clusters, cluster)
                        : { ...filters.clusters, [cluster]: true }
                    }));
                  }}
                />
              </div>
            </div>
          </>
        )}
      </SigmaContainer>
    </div>
  );
};

export default SocialGraph;
