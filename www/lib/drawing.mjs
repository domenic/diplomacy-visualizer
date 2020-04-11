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
    .call(d3.drag()
      .on("start", (n, i, els) => els[i].classList.add("dragging"))
      .on("drag", onDrag)
      .on("end", (n, i, els) => els[i].classList.remove("dragging")));

  nodeNodes.append("rect")
    .attr("width", nodeWidth)
    .attr("height", NODE_HEIGHT);

  nodeNodes.append("text")
    .text(n => n.name)
    .attr("x", n => nodeWidth(n) / 2)
    .attr("y", NODE_HEIGHT / 2);

  const viewBox = computeViewBox(nodes);
  svg.attr("viewBox", `${viewBox.left} ${viewBox.top} ${viewBox.width} ${viewBox.height}`);

  function onDrag(n, i, els) {
    n.x += d3.event.dx;
    n.y += d3.event.dy;

    if (nodeLeft(n) < viewBox.left) {
      n.x = viewBox.left + nodeWidth(n) / 2;
    }
    if (nodeRight(n) > viewBox.right) {
      n.x = viewBox.right - nodeWidth(n) / 2;
    }
    if (nodeTop(n) < viewBox.top) {
      n.y = viewBox.top + NODE_HEIGHT / 2;
    }
    if (nodeBottom(n) > viewBox.bottom) {
      n.y = viewBox.bottom - NODE_HEIGHT / 2;
    }

    els[i].setAttribute("transform", nodeTranslate(n));

    edgeNodes
      .attr("x1", e => e.node1.x)
      .attr("y1", e => e.node1.y)
      .attr("x2", e => e.node2.x)
      .attr("y2", e => e.node2.y);
  }
}

function computeViewBox(nodes) {
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

  return { left, top, right, bottom, width: right - left, height: bottom - top };
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
