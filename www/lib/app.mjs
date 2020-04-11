import makeGraph from "./graph.mjs";
import draw from "./drawing.mjs";

main();

async function main() {
  const [boardData, countryData, adjustedPositions] = await Promise.all([
    fetchData("../data/board.json"),
    fetchData("../data/countries.json"),
    fetchData("../data/adjusted-positions.json")
  ]);

  const { nodes, edges } = makeGraph(boardData, countryData, adjustedPositions);
  draw(nodes, edges);
}

function fetchData(relativeURL) {
  return fetch(new URL(relativeURL, import.meta.url)).then(res => res.json());
}
