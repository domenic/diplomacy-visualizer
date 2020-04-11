export default function (boardData, countryData) {
  const nodes = [];
  const edgeMap = new Map();
  for (const [regionName, regionData] of Object.entries(boardData)) {
    nodes.push({
      name: regionName,
      type: regionData.type,
      supplyCenter: regionData.supply_center,
      allegiance: allegiance(regionName, regionData, countryData),
      x: regionData.unit_pos[0],
      y: regionData.unit_pos[1]
    });

    for (const adjacency of regionData.adjacencies) {
      const sorted = [regionName, adjacency.region].sort();
      const mapKey = `${sorted[0]} to ${sorted[1]}`;
      if (!edgeMap.has(mapKey)) {
        edgeMap.set(mapKey, {
          source: sorted[0],
          target: sorted[1],
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

  const edges = [...edgeMap.values()];

  return { nodes, edges };
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
