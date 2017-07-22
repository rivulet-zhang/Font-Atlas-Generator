// This file is extended based upon the label-layer example in deck.gl.
// Credit: https://github.com/uber/deck.gl
const MAX_CANVAS_WIDTH = 512;

function setTextStyle(ctx, fontSize, fontFamily) {
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = '#000';
  // change from top to hanging to avoid partial clipping of text
  ctx.textBaseline = 'hanging';
  ctx.textAlign = 'left';
}

function makeTextureAtlasFromLabels(canvas, strList, fontSize, fontFamily, drawBound) {
  const ctx = canvas.getContext('2d');
  setTextStyle(ctx, fontSize, fontFamily);

  // measure texts
  let row = 0;
  let x = 0;
  const mapping = strList.map((string, index) => {
    const {width} = ctx.measureText(string);
    if (x + width > MAX_CANVAS_WIDTH) {
      x = 0;
      row++;
    }
    const iconMap = {
      string,
      index: string.charCodeAt(0),
      x,
      y: row * fontSize,
      width: Math.min(width, MAX_CANVAS_WIDTH),
      height: fontSize,
      mask: true
    };
    x += width;
    return iconMap;
  });

  canvas.width = MAX_CANVAS_WIDTH;
  canvas.height = (row + 1) * fontSize;
  // change the height to a power-of-2 value
  canvas.height = Math.pow(2, Math.ceil(Math.log2(canvas.height)));
  // changing canvas size will reset context
  setTextStyle(ctx, fontSize, fontFamily);

  for (const label of mapping) {
    ctx.fillText(label.string, label.x, label.y);
    if (drawBound) {
      ctx.strokeRect(label.x, label.y, label.width, label.height);
    }
  }

  return mapping;
}
