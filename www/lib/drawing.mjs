const NODE_HEIGHT = 15;

export default function (svgElement, nodes, edges) {
  const svg = d3.select(svgElement);

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
    .attr("transform", nodeTranslate)
    .call(d3.drag().on("drag", onDrag));

  nodeNodes.append("rect")
    .attr("width", nodeWidth)
    .attr("height", NODE_HEIGHT);

  nodeNodes.append("text")
    .text(n => n.name)
    .attr("x", n => nodeWidth(n) / 2)
    .attr("y", NODE_HEIGHT / 2);

  svg.attr("viewBox", viewBox(nodes));

  function onDrag(n) {
    n.x += d3.event.dx;
    n.y += d3.event.dy;

    d3.select(this).attr("transform", nodeTranslate(n));

    edgeNodes
      .attr("x1", e => e.node1.x)
      .attr("y1", e => e.node1.y)
      .attr("x2", e => e.node2.x)
      .attr("y2", e => e.node2.y);
  }
}

function viewBox(nodes) {
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;

  for (const n of nodes) {
    left = Math.min(nodeLeft(n), left);
    top = Math.min(nodeTop(n), top);
    right = Math.max(nodeRight(n), right);
    bottom = Math.max(nodeBottom(n), bottom);
  }

  return [left, top, right - left, bottom - top].join(" ");
}

function nodeWidth(n) {
  return 10 + n.name.length * 5;
}

function nodeLeft(n) {
  return n.x - nodeWidth(n) / 2;
}

function nodeRight(n) {
  return n.x + nodeWidth(n) / 2;
}

function nodeTop(n) {
  return n.y - NODE_HEIGHT / 2;
}

function nodeBottom(n) {
  return n.y + NODE_HEIGHT / 2;
}

function nodeTranslate(n) {
  return `translate(${nodeLeft(n)},${nodeTop(n)})`;
}
