import makeGraph from "./graph.mjs";
import draw from "./drawing.mjs";
import getGameStatus from "./web-diplomacy.mjs";

main();

async function main() {
  const [boardData, countryData, adjustedPositions] = await Promise.all([
    fetchData("../data/board.json"),
    fetchData("../data/countries.json"),
    fetchData("../data/adjusted-positions.json")
  ]);

  const { nodes, edges } = makeGraph(boardData, countryData, adjustedPositions);
  const svg = document.querySelector("svg");
  const update = draw(svg, nodes, edges);

  document.querySelector("#update").onclick = async () => {
    let gameStatus;

    try {
      gameStatus = await getGameStatus();
    } catch (e) {
      const p = document.createElement("p");
      p.textContent = e.message;
      document.body.append(p);
      return;
    }

    update(gameStatus);
  };
}

function fetchData(relativeURL) {
  return fetch(new URL(relativeURL, import.meta.url)).then(res => res.json());
}
