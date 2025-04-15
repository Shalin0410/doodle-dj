import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { Pencil, Eraser, Undo2, Redo2, Trash2, Palette } from "lucide-react";
import "./DrawingCanvas.css";

const DrawingCanvas = ({ onSubmit, isLoading }) => {
  const canvasRef = useRef(null);
  const colorInputRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#ff0000");
  const [lineWidth, setLineWidth] = useState(2);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [customColor, setCustomColor] = useState("");

  const colors = [
    { name: "Yellow", value: "#ffff00" },
    { name: "Red", value: "#ff0000" },
    { name: "Green", value: "#00ff00" },
    { name: "Black", value: "#000000" },
    { name: "White", value: "#ffffff" },
    { name: "Orange", value: "#ffa500" },
    { name: "Blue", value: "#0000ff" },
    { name: "Brown", value: "#8b4513" },
    { name: "Purple", value: "#8a2be2" },
    { name: "Pink", value: "#ff69b4" },
  ];

  const tools = [
    { name: "pencil", icon: <Pencil size={20} /> },
    { name: "eraser", icon: <Eraser size={20} /> },
  ];

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set canvas size to account for devicePixelRatio
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale context to ensure proper drawing coordinates
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);

    saveToHistory(ctx.getImageData(0, 0, rect.width, rect.height));
  }, []);

  const saveToHistory = (imageData) => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), imageData]);
    setHistoryIndex((prev) => prev + 1);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? 20 : lineWidth;
    ctx.lineCap = "round";
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (isDrawing) {
      setIsDrawing(false);
      ctx.closePath();
      saveToHistory(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
  };

  const clearCanvas = () => {
    if (historyIndex === -1 || isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };

  const undo = () => {
    if (historyIndex <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setHistoryIndex((prev) => prev - 1);
    ctx.putImageData(history[historyIndex - 1], 0, 0);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setHistoryIndex((prev) => prev + 1);
    ctx.putImageData(history[historyIndex + 1], 0, 0);
  };

  const handleSubmit = () => {
    if (isLoading || historyIndex === -1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageData = canvas.toDataURL("image/png");
    onSubmit(imageData);
  };

  const openColorPicker = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    setCustomColor(newColor);
  };

  return (
    <div className="row">
      <div className="col-1 my-auto">
        <div className="d-flex flex-column">
          <div
            className={`brush-div border border-secondary d-flex flex-column justify-content-center align-items-center ${
              lineWidth === 8 ? "bg-secondary-subtle" : "bg-white"
            }`}
            onClick={() => setLineWidth(8)}
          >
            <div className="circle large" />
          </div>
          <div
            className={`brush-div border border-secondary d-flex flex-column justify-content-center align-items-center ${
              lineWidth === 6 ? "bg-secondary-subtle" : "bg-white"
            }`}
            onClick={() => setLineWidth(6)}
          >
            <div className="circle medium" />
          </div>
          <div
            className={`brush-div border border-secondary d-flex flex-column justify-content-center align-items-center ${
              lineWidth === 4 ? "bg-secondary-subtle" : "bg-white"
            }`}
            onClick={() => setLineWidth(4)}
          >
            <div className="circle small" />
          </div>
          <div
            className={`brush-div border border-secondary d-flex flex-column justify-content-center align-items-center ${
              lineWidth === 2 ? "bg-secondary-subtle" : "bg-white"
            }`}
            onClick={() => setLineWidth(2)}
          >
            <div className="circle extra-small" />
          </div>
        </div>
      </div>
      <div className="col-11">
        <div className="position-relative">
          <div className="mb-3">
            <div className="toolbar-container d-flex justify-content-between">
              <ButtonGroup>
                {tools.map((t) => (
                  <Button
                    key={t.name}
                    variant="light"
                    className={`tool-button ${tool === t.name ? "active" : ""}`}
                    onClick={() => setTool(t.name)}
                  >
                    {t.icon}
                  </Button>
                ))}
                <Button
                  className={`tool-button ${
                    historyIndex <= 0 ? "opacity-50" : "opacity-100"
                  }`}
                  onClick={undo}
                  variant="light"
                  disabled={historyIndex <= 0}
                >
                  <Undo2 size={20} />
                </Button>
                <Button
                  className={`tool-button ${
                    historyIndex >= history.length - 1
                      ? "opacity-50"
                      : "opacity-100"
                  }`}
                  onClick={redo}
                  variant="light"
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo2 size={20} />
                </Button>
                <Button
                  className="tool-button"
                  onClick={clearCanvas}
                  variant="light"
                >
                  <Trash2 size={20} />
                </Button>
              </ButtonGroup>

              <Button
                className="tool-button"
                onClick={handleSubmit}
                disabled={isLoading}
                variant="success"
              >
                {/* <Check size={20} /> */}
                Play My Doodle
              </Button>
            </div>
          </div>

          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              style={{
                height: "auto",
                width: "100%",
                cursor: "crosshair",
                touchAction: "none",
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>

          <div className="d-flex justify-content-center mt-3">
            {colors.map((c) => (
              <div
                key={c.value}
                className={`color-div ${color === c.value ? "active" : ""}`}
                style={{ backgroundColor: c.value }}
                onClick={() => {
                  setColor(c.value);
                }}
              />
            ))}
            {customColor && (
              <div
                className={`color-div ${color === customColor ? "active" : ""}`}
                style={{ backgroundColor: customColor }}
                onClick={() => {
                  setColor(customColor);
                  setCustomColor(customColor);
                }}
              />
            )}
            <div
              className="color-div d-flex align-items-center justify-content-center bg-white"
              onClick={openColorPicker}
            >
              <Palette className="h-5 w-5 text-gray-500" />
            </div>
            <input
              ref={colorInputRef}
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="d-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
