const HEIGHT = 800;
const WIDTH = 800;

const NODE_HEIGHT = 15;

export default function (nodes, edges) {
  const svg = d3.select("body").append("svg").attr("viewBox", [0, 0, WIDTH, HEIGHT]);

  const edgeNodes = svg.append("g")
    .attr("id", "edges")
    .selectAll("line")
    .data(edges)
    .join("line")
    .attr("class", n => [...n.types].join(" "))
    .attr("x1", e => e.node1.x)
    .attr("y1", e => e.node1.y)
    .attr("x2", e => e.node2.x)
    .attr("y2", e => e.node2.y);

  const nodeNodes = svg.append("g")
    .attr("id", "regions")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", n => n.allegiance)
    .attr("transform", n => `translate(${n.x - width(n) / 2},${n.y - NODE_HEIGHT / 2})`)
    .call(d3.drag().on("drag", onDrag));

  nodeNodes.append("rect")
    .attr("width", width)
    .attr("height", NODE_HEIGHT);

  nodeNodes.append("text")
    .text(n => n.name)
    .attr("x", n => width(n) / 2)
    .attr("y", NODE_HEIGHT / 2);

  function onDrag(n) {
    n.x += d3.event.dx;
    n.y += d3.event.dy;

    d3.select(this).attr("transform", `translate(${n.x - width(n) / 2},${n.y - NODE_HEIGHT / 2})`);

    edgeNodes
      .attr("x1", e => e.node1.x)
      .attr("y1", e => e.node1.y)
      .attr("x2", e => e.node2.x)
      .attr("y2", e => e.node2.y);
  }
}

function width(n) {
  return 10 + n.name.length * 5;
}
