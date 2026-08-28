import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SbaPractical, DataRow, GraphCalculation } from '../../../types/sba';
import { LineChart as ChartIcon, CheckCircle2, AlertCircle, Info, Calculator, RefreshCw } from 'lucide-react';

interface StepGraphPlotterProps {
  practical: SbaPractical;
  dataTable: DataRow[];
  graphCalc: GraphCalculation;
  onGraphCalcChange: (calc: GraphCalculation) => void;
}

export default function StepGraphPlotter({
  practical,
  dataTable,
  graphCalc,
  onGraphCalcChange
}: StepGraphPlotterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const xCfg = practical.graphConfig.xAxis;
  const yCfg = practical.graphConfig.yAxis;

  // Extract valid points from dataTable
  const points = useMemo(() => {
    return dataTable
      .map(row => ({
        x: Number(row[xCfg.key]),
        y: Number(row[yCfg.key])
      }))
      .filter(p => !isNaN(p.x) && !isNaN(p.y));
  }, [dataTable, xCfg.key, yCfg.key]);

  // Linear regression fit
  const regression = useMemo(() => {
    if (points.length < 2) return { slope: 0, intercept: 0 };
    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    points.forEach(p => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
    });
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { slope: isNaN(slope) ? 0 : slope, intercept: isNaN(intercept) ? 0 : intercept };
  }, [points]);

  // Auto-initiate graphCalc if not already set
  useEffect(() => {
    if (points.length >= 2 && (!graphCalc.point1 || graphCalc.point1.x === 0)) {
      const p1 = { x: points[0].x, y: Number((regression.slope * points[0].x + regression.intercept).toFixed(2)) };
      const p2 = { x: points[points.length - 1].x, y: Number((regression.slope * points[points.length - 1].x + regression.intercept).toFixed(2)) };
      const slope = (p2.y - p1.y) / (p2.x - p1.x);
      const intercept = p1.y - slope * p1.x;

      let derivedVal = Math.abs(slope);
      if (practical.id === 'gr12-internal-resistance') {
        derivedVal = Number((-slope).toFixed(2));
      } else if (practical.id === 'gr11-snells-law') {
        derivedVal = Number(slope.toFixed(3));
      }

      onGraphCalcChange({
        point1: p1,
        point2: p2,
        calculatedSlope: Number(slope.toFixed(3)),
        calculatedIntercept: Number(intercept.toFixed(2)),
        derivedConstantName: practical.graphConfig.expectedSlopeName,
        derivedConstantValue: derivedVal,
        unit: practical.graphConfig.expectedSlopeUnit
      });
    }
  }, [points, regression, practical]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i * (width - padding * 2)) / 10;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      const y = padding + (i * (height - padding * 2)) / 10;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${xCfg.label} (${xCfg.symbol} / ${xCfg.unit})`, width / 2, height - 12);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${yCfg.label} (${yCfg.symbol} / ${yCfg.unit})`, 0, 0);
    ctx.restore();

    // Coordinate mapping functions
    const mapX = (v: number) => padding + ((v - xCfg.min) / (xCfg.max - xCfg.min)) * (width - padding * 2);
    const mapY = (v: number) => height - padding - ((v - yCfg.min) / (yCfg.max - yCfg.min)) * (height - padding * 2);

    // Draw Line of Best Fit
    if (points.length >= 2) {
      ctx.strokeStyle = '#ef4444'; // Red-500
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const x1 = xCfg.min;
      const y1 = regression.slope * x1 + regression.intercept;
      const x2 = xCfg.max;
      const y2 = regression.slope * x2 + regression.intercept;
      ctx.moveTo(mapX(x1), mapY(y1));
      ctx.lineTo(mapX(x2), mapY(y2));
      ctx.stroke();
    }

    // Draw Plotted Data Points (+)
    ctx.strokeStyle = '#60a5fa'; // Blue-400
    ctx.lineWidth = 2.5;
    points.forEach(p => {
      const cx = mapX(p.x);
      const cy = mapY(p.y);
      if (cx >= padding && cx <= width - padding && cy >= padding && cy <= height - padding) {
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy);
        ctx.lineTo(cx + 5, cy);
        ctx.moveTo(cx, cy - 5);
        ctx.lineTo(cx, cy + 5);
        ctx.stroke();
      }
    });

    // Draw Selected Gradient Points (Green circles)
    if (graphCalc.point1 && graphCalc.point2) {
      [graphCalc.point1, graphCalc.point2].forEach((pt, i) => {
        const cx = mapX(pt.x);
        const cy = mapY(pt.y);
        ctx.fillStyle = '#10b981'; // Emerald
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`P${i + 1}(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`, cx + 8, cy - 4);
      });
    }
  }, [points, regression, graphCalc, xCfg, yCfg]);

  return (
    <div className="space-y-6">
      {/* Graph Area Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ChartIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Cartesian Coordinate Plot & Line of Best Fit (5 Marks)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Plotted with automatic linear regression trendline and two distant coordinate markers for gradient calculation.
            </p>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="w-full flex justify-center bg-slate-950 p-4 rounded-xl overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="w-full max-w-[640px] h-auto rounded-lg"
          />
        </div>

        {/* Gradient Derivation Formula Box */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-600" /> Gradient Calculation Steps
            </h4>
            
            <div className="text-xs font-mono space-y-1.5 text-slate-700 dark:text-slate-300">
              <div>• Coordinate P1 = ({graphCalc.point1?.x.toFixed(2)}, {graphCalc.point1?.y.toFixed(2)})</div>
              <div>• Coordinate P2 = ({graphCalc.point2?.x.toFixed(2)}, {graphCalc.point2?.y.toFixed(2)})</div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                • Gradient m = (y2 - y1) / (x2 - x1)
              </div>
              <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                • m = {graphCalc.calculatedSlope.toFixed(3)} {graphCalc.unit}
              </div>
              <div>• y-Intercept (c) = {graphCalc.calculatedIntercept.toFixed(2)}</div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600" /> Physical Interpretation & Constant
            </h4>

            <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
              <p>
                <strong>Slope Meaning:</strong> {practical.graphConfig.physicalMeaningOfSlope}
              </p>
              <p>
                <strong>Intercept Meaning:</strong> {practical.graphConfig.physicalMeaningOfIntercept}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Derived {graphCalc.derivedConstantName} = {graphCalc.derivedConstantValue.toFixed(2)} {graphCalc.unit}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
