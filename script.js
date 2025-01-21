const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Establecer dimensiones iniciales del lienzo
const canvasWidth = 800;
const canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Variables de estado
let isDrawing = false;
let brushColor = "#000000";
let brushSize = 5;
let paths = [];
let redoStack = [];

// Configurar estilos iniciales
ctx.strokeStyle = brushColor;
ctx.lineWidth = brushSize;
ctx.lineCap = "round";

// Eventos del lienzo
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Herramientas
document.getElementById("colorPicker").addEventListener("change", (e) => {
  brushColor = e.target.value;
  ctx.strokeStyle = brushColor;
});

document.getElementById("brushSize").addEventListener("input", (e) => {
  brushSize = e.target.value;
  ctx.lineWidth = brushSize;
});

document.getElementById("clearCanvas").addEventListener("click", clearCanvas);
document.getElementById("undo").addEventListener("click", undo);
document.getElementById("redo").addEventListener("click", redo);
document.getElementById("saveImage").addEventListener("click", saveImage);

// Funciones
function startDrawing(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
  paths.push([]);
}

function draw(e) {
  if (!isDrawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  paths[paths.length - 1].push({
    x: e.offsetX,
    y: e.offsetY,
    color: brushColor,
    size: brushSize,
  });
}

function stopDrawing() {
  isDrawing = false;
  ctx.closePath();
  redoStack = [];
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paths = [];
  redoStack = [];
}

function undo() {
  if (paths.length === 0) return;
  redoStack.push(paths.pop());
  redraw();
}

function redo() {
  if (redoStack.length === 0) return;
  paths.push(redoStack.pop());
  redraw();
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paths.forEach((path) => {
    ctx.beginPath();
    path.forEach((point, index) => {
      ctx.strokeStyle = point.color;
      ctx.lineWidth = point.size;
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    });
    ctx.closePath();
  });
}

function saveImage() {
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
