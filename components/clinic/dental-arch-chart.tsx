"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Pen, Eraser, Trash2, RotateCcw } from "lucide-react"

interface DentalArchChartProps {
  selectedTeeth: Set<string>
  onToggleTooth: (tooth: string) => void
}

const upperTeeth = [
  { id: "右上8", x: 38, y: 42, label: "8" },
  { id: "右上7", x: 56, y: 30, label: "7" },
  { id: "右上6", x: 74, y: 22, label: "6" },
  { id: "右上5", x: 92, y: 16, label: "5" },
  { id: "右上4", x: 110, y: 12, label: "4" },
  { id: "右上3", x: 128, y: 10, label: "3" },
  { id: "右上2", x: 146, y: 8, label: "2" },
  { id: "右上1", x: 164, y: 8, label: "1" },
  { id: "左上1", x: 186, y: 8, label: "1" },
  { id: "左上2", x: 204, y: 8, label: "2" },
  { id: "左上3", x: 222, y: 10, label: "3" },
  { id: "左上4", x: 240, y: 12, label: "4" },
  { id: "左上5", x: 258, y: 16, label: "5" },
  { id: "左上6", x: 276, y: 22, label: "6" },
  { id: "左上7", x: 294, y: 30, label: "7" },
  { id: "左上8", x: 312, y: 42, label: "8" },
]

const lowerTeeth = [
  { id: "右下8", x: 50, y: 220, label: "8" },
  { id: "右下7", x: 66, y: 235, label: "7" },
  { id: "右下6", x: 84, y: 244, label: "6" },
  { id: "右下5", x: 102, y: 252, label: "5" },
  { id: "右下4", x: 118, y: 256, label: "4" },
  { id: "右下3", x: 134, y: 258, label: "3" },
  { id: "右下2", x: 150, y: 260, label: "2" },
  { id: "右下1", x: 164, y: 260, label: "1" },
  { id: "左下1", x: 186, y: 260, label: "1" },
  { id: "左下2", x: 200, y: 260, label: "2" },
  { id: "左下3", x: 216, y: 258, label: "3" },
  { id: "左下4", x: 232, y: 256, label: "4" },
  { id: "左下5", x: 248, y: 252, label: "5" },
  { id: "左下6", x: 266, y: 244, label: "6" },
  { id: "左下7", x: 284, y: 235, label: "7" },
  { id: "左下8", x: 300, y: 220, label: "8" },
]

export function DentalArchChart({ selectedTeeth, onToggleTooth }: DentalArchChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPenMode, setIsPenMode] = useState(false)
  const [isEraserMode, setIsEraserMode] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState<ImageData[]>([])
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  // Get canvas coordinates from mouse/touch event
  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }, [])

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    setHistory((prev) => [...prev.slice(-20), ctx.getImageData(0, 0, canvas.width, canvas.height)])
  }, [])

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isPenMode && !isEraserMode) return
    e.preventDefault()
    saveHistory()
    setIsDrawing(true)
    const pos = getPos(e)
    if (!pos) return
    lastPos.current = pos
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, isEraserMode ? 12 : 2, 0, Math.PI * 2)
    ctx.fillStyle = isEraserMode ? "rgba(0,0,0,0)" : "#e63946"
    if (isEraserMode) {
      ctx.clearRect(pos.x - 12, pos.y - 12, 24, 24)
    } else {
      ctx.fill()
    }
  }, [isPenMode, isEraserMode, getPos, saveHistory])

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || (!isPenMode && !isEraserMode)) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return
    const pos = getPos(e)
    if (!pos || !lastPos.current) return

    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    if (isEraserMode) {
      ctx.globalCompositeOperation = "destination-out"
      ctx.lineWidth = 24
      ctx.strokeStyle = "rgba(0,0,0,1)"
    } else {
      ctx.globalCompositeOperation = "source-over"
      ctx.lineWidth = 2.5
      ctx.strokeStyle = "#e63946"
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
    }
    ctx.stroke()
    ctx.globalCompositeOperation = "source-over"
    lastPos.current = pos
  }, [isDrawing, isPenMode, isEraserMode, getPos])

  const handleEnd = useCallback(() => {
    setIsDrawing(false)
    lastPos.current = null
  }, [])

  const handleUndo = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return
    if (history.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }
    const prev = history[history.length - 1]
    ctx.putImageData(prev, 0, 0)
    setHistory((h) => h.slice(0, -1))
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return
    saveHistory()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const handleSvgClick = (e: React.MouseEvent, toothId: string) => {
    if (isPenMode || isEraserMode) return
    onToggleTooth(toothId)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Toolbar */}
      <div className="flex w-full items-center gap-1.5 rounded-lg border border-[#7bb8d4] bg-[#f0f8ff] px-2 py-1.5">
        <span className="mr-1 text-[10px] font-bold text-[#4a7d99]">書き込み</span>
        <button
          type="button"
          onClick={() => { setIsPenMode(!isPenMode); setIsEraserMode(false) }}
          className={cn(
            "flex items-center gap-1 rounded px-2 py-1 text-[11px] font-bold transition-all",
            isPenMode
              ? "bg-[#e63946] text-white shadow-sm"
              : "bg-white text-[#4a7d99] border border-[#7bb8d4] hover:bg-[#e8f4f8]"
          )}
          title="ペンモード"
        >
          <Pen className="h-3 w-3" />
          ペン
        </button>
        <button
          type="button"
          onClick={() => { setIsEraserMode(!isEraserMode); setIsPenMode(false) }}
          className={cn(
            "flex items-center gap-1 rounded px-2 py-1 text-[11px] font-bold transition-all",
            isEraserMode
              ? "bg-[#f4a261] text-white shadow-sm"
              : "bg-white text-[#4a7d99] border border-[#7bb8d4] hover:bg-[#e8f4f8]"
          )}
          title="消しゴム"
        >
          <Eraser className="h-3 w-3" />
          消去
        </button>
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={handleUndo}
            className="flex items-center gap-1 rounded border border-[#7bb8d4] bg-white px-2 py-1 text-[11px] text-[#4a7d99] hover:bg-[#e8f4f8] transition-all"
            title="元に戻す"
          >
            <RotateCcw className="h-3 w-3" />
            戻す
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 rounded border border-[#7bb8d4] bg-white px-2 py-1 text-[11px] text-[#4a7d99] hover:bg-[#fee2e2] transition-all"
            title="全消去"
          >
            <Trash2 className="h-3 w-3" />
            全消去
          </button>
        </div>
      </div>

      {/* Right/Left labels */}
      <div className="flex w-full items-center justify-between px-2 pb-1">
        <span className="text-xs font-semibold text-[#1e4060]">右</span>
        <span className="text-xs font-semibold text-[#1e4060]">左</span>
      </div>

      {/* SVG + Canvas overlay */}
      <div ref={containerRef} className="relative w-full max-w-[350px]">
        <svg
          ref={svgRef}
          viewBox="0 0 350 290"
          className="w-full"
          role="img"
          aria-label="歯式図"
          style={{ pointerEvents: isPenMode || isEraserMode ? "none" : "auto" }}
        >
          {/* Arch outline - upper */}
          <path
            d="M 38 55 Q 40 -5 175 -5 Q 310 -5 312 55"
            fill="none"
            stroke="#6ba3c7"
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />
          {/* Arch outline - lower */}
          <path
            d="M 50 215 Q 55 295 175 295 Q 295 295 300 215"
            fill="none"
            stroke="#6ba3c7"
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />
          <line x1="175" y1="0" x2="175" y2="290" stroke="#6ba3c7" strokeWidth="0.8" strokeDasharray="4,3" />
          <line x1="20" y1="135" x2="330" y2="135" stroke="#6ba3c7" strokeWidth="0.8" strokeDasharray="4,3" />

          {upperTeeth.map((tooth) => {
            const selected = selectedTeeth.has(tooth.id)
            return (
              <g key={tooth.id} onClick={(e) => handleSvgClick(e, tooth.id)} className="cursor-pointer">
                <rect
                  x={tooth.x - 12} y={tooth.y} width={24} height={22} rx={4}
                  fill={selected ? "#2563eb" : "#e8f4f8"}
                  stroke={selected ? "#1d4ed8" : "#7bb8d4"}
                  strokeWidth={selected ? 2 : 1}
                  className="transition-all hover:fill-[#bfdbfe]"
                />
                <text
                  x={tooth.x} y={tooth.y + 16}
                  textAnchor="middle" fontSize="12"
                  fontWeight={selected ? "700" : "600"}
                  fill={selected ? "#ffffff" : "#1a3a4a"}
                  className="pointer-events-none select-none"
                >
                  {tooth.label}
                </text>
              </g>
            )
          })}

          {lowerTeeth.map((tooth) => {
            const selected = selectedTeeth.has(tooth.id)
            return (
              <g key={tooth.id} onClick={(e) => handleSvgClick(e, tooth.id)} className="cursor-pointer">
                <rect
                  x={tooth.x - 12} y={tooth.y - 10} width={24} height={20} rx={4}
                  fill={selected ? "#2563eb" : "#e8f4f8"}
                  stroke={selected ? "#1d4ed8" : "#7bb8d4"}
                  strokeWidth={selected ? 2 : 1}
                  className="transition-all hover:fill-[#bfdbfe]"
                />
                <text
                  x={tooth.x} y={tooth.y + 3}
                  textAnchor="middle" fontSize="12"
                  fontWeight={selected ? "700" : "600"}
                  fill={selected ? "#ffffff" : "#1a3a4a"}
                  className="pointer-events-none select-none"
                >
                  {tooth.label}
                </text>
              </g>
            )
          })}

          <text x="100" y="80" textAnchor="middle" fontSize="9" fill="#7bb8d4" className="select-none">上顎</text>
          <text x="250" y="80" textAnchor="middle" fontSize="9" fill="#7bb8d4" className="select-none">上顎</text>
          <text x="100" y="225" textAnchor="middle" fontSize="9" fill="#7bb8d4" className="select-none">下顎</text>
          <text x="250" y="225" textAnchor="middle" fontSize="9" fill="#7bb8d4" className="select-none">下顎</text>
        </svg>

        {/* Canvas overlay for pen drawing */}
        <canvas
          ref={canvasRef}
          width={350}
          height={290}
          className="absolute inset-0 w-full h-full"
          style={{
            cursor: isPenMode ? "crosshair" : isEraserMode ? "cell" : "default",
            pointerEvents: isPenMode || isEraserMode ? "auto" : "none",
            touchAction: isPenMode || isEraserMode ? "none" : "auto",
          }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>

      {(isPenMode || isEraserMode) && (
        <div className="flex w-full flex-col items-center gap-2">
          <p className="text-[10px] text-[#e63946] font-medium">
            {isPenMode ? "ペンモード中 - 歯式図に書き込めます" : "消しゴムモード中 - ドラッグして消去"}
          </p>
          <button
            type="button"
            onClick={() => { setIsPenMode(false); setIsEraserMode(false) }}
            className="rounded-lg bg-[#2563eb] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#1d4ed8] transition-all"
          >
            部位選択に戻る
          </button>
        </div>
      )}
    </div>
  )
}

// Compact grid-style tooth selector for mobile
export function ToothGridSelector({ selectedTeeth, onToggleTooth }: DentalArchChartProps) {
  const rows = [
    { label: "右上", prefix: "右上", nums: ["8","7","6","5","4","3","2","1"] },
    { label: "左上", prefix: "左上", nums: ["1","2","3","4","5","6","7","8"] },
    { label: "右下", prefix: "右下", nums: ["8","7","6","5","4","3","2","1"] },
    { label: "左下", prefix: "左下", nums: ["1","2","3","4","5","6","7","8"] },
  ]

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-2">
        <span className="w-8 text-right text-[10px] font-bold text-[#1e4060]">右</span>
        <div className="w-[256px]" />
        <span className="w-8 text-[10px] font-bold text-[#1e4060]">左</span>
      </div>
      {rows.map((row, ri) => (
        <div key={row.prefix}>
          <div className="flex gap-0.5">
            {row.nums.map((n) => {
              const id = `${row.prefix}${n}`
              const selected = selectedTeeth.has(id)
              return (
                <button
                  key={id}
                  onClick={() => onToggleTooth(id)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded text-xs font-bold transition-all",
                    selected
                      ? "bg-[#2563eb] text-[#ffffff] shadow-md"
                      : "bg-[#e8f4f8] text-[#4a7d99] hover:bg-[#c8e6f5]"
                  )}
                >
                  {n}
                </button>
              )
            })}
          </div>
          {ri === 1 && (
            <div className="my-1 h-px bg-[#7bb8d4]" />
          )}
        </div>
      ))}
    </div>
  )
}
