export default function (boardData, countryData, adjustedPositions) {
  const nodeMap = new Map();
  const edgeMap = new Map();
  for (const [regionName, regionData] of Object.entries(boardData)) {
    nodeMap.set(regionName, {
      name: regionName,
      type: regionData.type,
      supplyCenter: regionData.supply_center,
      allegiance: allegiance(regionName, regionData, countryData),
      x: adjustedPositions[regionName]?.x ?? regionData.name_pos[0],
      y: adjustedPositions[regionName]?.y ?? regionData.name_pos[1]
    });
  }

  for (const [regionName, regionData] of Object.entries(boardData)) {
    for (const adjacency of regionData.adjacencies) {
      const sorted = [regionName, adjacency.region].sort();
      const mapKey = `${sorted[0]} to ${sorted[1]}`;
      if (!edgeMap.has(mapKey)) {
        edgeMap.set(mapKey, {
          node1: nodeMap.get(sorted[0]),
          node2: nodeMap.get(sorted[1]),
          types: new Set(),
          coasts: new Set()
        });
      }

      const edge = edgeMap.get(mapKey);
      edge.types.add(adjacency.for);
      if (adjacency.coast) {
        edge.coasts.add(adjacency.coast);
      }
    }
  }

  return { nodes: [...nodeMap.values()], edges: [...edgeMap.values()] };
}

function allegiance(regionName, regionData, countryData) {
  if (regionData.type === "Water") {
    return "Water";
  }

  const country = countryData.find(c =>
    c.supply_centers.includes(regionName) || c.other_home_regions.includes(regionName));

  if (!country) {
    return "Neutral";
  }

  return country.name;
}
