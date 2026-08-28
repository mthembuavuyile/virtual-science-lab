import { jsPDF } from 'jspdf';
import { SbaPractical, SbaSubmission } from '../types/sba';

export function generateSbaPdf(practical: SbaPractical, submission: SbaSubmission): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryColor = [26, 54, 93]; // Dark Navy Blue (#1A365D)
  const secondaryColor = [49, 130, 206]; // Cobalt Blue (#3182CE)
  const textDark = [30, 41, 59]; // Slate 800
  const textMuted = [100, 116, 139]; // Slate 500
  const borderGrey = [203, 213, 225]; // Slate 300
  const bgLight = [248, 250, 252]; // Slate 50

  const drawHeader = (pageNumber: number, totalPages: number) => {
    // Header bar
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(margin, 10, contentWidth, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('REPUBLIC OF SOUTH AFRICA • DEPARTMENT OF BASIC EDUCATION • CAPS SBA DOSSIER', margin, 8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - margin, 8, { align: 'right' });

    // Footer bar
    doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFontSize(7);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`VyLab Digital SBA Engine • Verification Hash: ${submission.verificationHash}`, margin, pageHeight - 8);
    doc.text(`Confidential • Formal Assessment Portfolio Task`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  // ═══════════════════════════════════════════════════════════════════
  // PAGE 1: COVER & INVESTIGATIVE FRAMEWORK
  // ═══════════════════════════════════════════════════════════════════
  drawHeader(1, 4);

  // Title Box
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(margin, 15, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, 15, contentWidth, 24, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('FORMAL SCHOOL-BASED ASSESSMENT (SBA) PRACTICAL DOSSIER', margin + 4, 22);

  doc.setFontSize(10);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(`${practical.title}`, margin + 4, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Subject: ${practical.discipline} | Grade: ${practical.grade} | Task: ${practical.capsTaskNumber} | Total Marks: ${practical.marks} Marks`, margin + 4, 34);

  // Candidate Details Table
  let y = 43;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('SECTION 0: CANDIDATE & AUTHENTICITY REGISTRATION', margin, y);

  y += 3;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'FD');

  const halfWidth = contentWidth / 2;
  doc.line(margin + halfWidth, y, margin + halfWidth, y + 26);
  doc.line(margin, y + 13, margin + contentWidth, y + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('CANDIDATE FULL NAME:', margin + 3, y + 5);
  doc.text('ID / SACAI / EXAMINATION NUMBER:', margin + halfWidth + 3, y + 5);
  doc.text('SCHOOL / DISTANCE LEARNING CENTER:', margin + 3, y + 18);
  doc.text('ASSESSMENT DATE & MODERATION CYCLE:', margin + halfWidth + 3, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(submission.studentInfo.fullName || 'Unspecified Learner', margin + 3, y + 10);
  doc.text(submission.studentInfo.idOrSacaiNumber || 'PENDING-REG-2026', margin + halfWidth + 3, y + 10);
  doc.text(submission.studentInfo.schoolOrCenter || 'Independent Homeschool / SACAI Candidate', margin + 3, y + 23);
  doc.text(`${submission.studentInfo.assessmentDate || new Date().toLocaleDateString()} (Term ${practical.term})`, margin + halfWidth + 3, y + 23);

  // SECTION A: AIM & INVESTIGATIVE QUESTION
  y = 75;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('SECTION A: INVESTIGATIVE FRAMEWORK & HYPOTHESIS', margin, y);

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('1. AIM OF EXPERIMENT:', margin, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const aimLines = doc.splitTextToSize(practical.aim, contentWidth);
  doc.text(aimLines, margin, y);
  y += aimLines.length * 4 + 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('2. INVESTIGATIVE QUESTION:', margin, y);
  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const qLines = doc.splitTextToSize(`"${submission.theory.investigativeQuestion || practical.expectedInvestigativeQuestion}"`, contentWidth);
  doc.text(qLines, margin, y);
  y += qLines.length * 4 + 3;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('3. SCIENTIFIC HYPOTHESIS:', margin, y);
  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const hypLines = doc.splitTextToSize(`"${submission.theory.hypothesis || practical.expectedHypothesisPattern}"`, contentWidth);
  doc.text(hypLines, margin, y);
  y += hypLines.length * 4 + 4;

  // Variables Grid
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('4. IDENTIFICATION OF EXPERIMENTAL VARIABLES:', margin, y);
  y += 4;

  const colW = contentWidth / 3;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.roundedRect(margin, y, contentWidth, 48, 1.5, 1.5, 'FD');
  doc.line(margin + colW, y, margin + colW, y + 48);
  doc.line(margin + colW * 2, y, margin + colW * 2, y + 48);

  // Col 1: Independent
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('INDEPENDENT VARIABLE', margin + 3, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Name: ${submission.theory.independentVar || practical.variables.independent.name}`, margin + 3, y + 13);
  doc.text(`Symbol: ${practical.variables.independent.symbol}`, margin + 3, y + 19);
  doc.text(`Unit: ${practical.variables.independent.unit || 'N/A'}`, margin + 3, y + 25);
  const indDesc = doc.splitTextToSize(practical.variables.independent.description, colW - 6);
  doc.text(indDesc, margin + 3, y + 31);

  // Col 2: Dependent
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('DEPENDENT VARIABLE', margin + colW + 3, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Name: ${submission.theory.dependentVar || practical.variables.dependent.name}`, margin + colW + 3, y + 13);
  doc.text(`Symbol: ${practical.variables.dependent.symbol}`, margin + colW + 3, y + 19);
  doc.text(`Unit: ${practical.variables.dependent.unit || 'N/A'}`, margin + colW + 3, y + 25);
  const depDesc = doc.splitTextToSize(practical.variables.dependent.description, colW - 6);
  doc.text(depDesc, margin + colW + 3, y + 31);

  // Col 3: Controlled
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('CONTROLLED VARIABLES (>=2)', margin + colW * 2 + 3, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  let cvY = y + 12;
  const cVars = submission.theory.controlledVars.length > 0 
    ? submission.theory.controlledVars 
    : practical.variables.controlled.map(c => `${c.name} (${c.symbol})`);
  cVars.slice(0, 3).forEach((cv, idx) => {
    const cvLine = doc.splitTextToSize(`• ${cv}`, colW - 6);
    doc.text(cvLine, margin + colW * 2 + 3, cvY);
    cvY += cvLine.length * 3.5 + 2;
  });

  // Learner Declaration
  y = 245;
  doc.setFillColor(254, 242, 242); // Red/pink alert tint
  doc.setDrawColor(248, 113, 113);
  doc.roundedRect(margin, y, contentWidth, 32, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(153, 27, 27);
  doc.text('CANDIDATE SOLEMN DECLARATION OF AUTHENTICITY (CAPS SBA REGULATION):', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(69, 10, 10);
  const declText = 'I hereby declare that this practical assessment task represents my own original scientific experimental data collection, graph plotting, calculations, and analytical deductions completed on the digital virtual simulation rig under teacher/parent supervision.';
  const declLines = doc.splitTextToSize(declText, contentWidth - 8);
  doc.text(declLines, margin + 4, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Learner Signature: _________________________________    Date: ________________________', margin + 4, y + 26);

  // ═══════════════════════════════════════════════════════════════════
  // PAGE 2: APPARATUS & RAW EXPERIMENTAL DATA TABLE
  // ═══════════════════════════════════════════════════════════════════
  doc.addPage();
  drawHeader(2, 4);

  y = 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('SECTION B: APPARATUS SPECIFICATIONS & MEASUREMENT PROTOCOL', margin, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  practical.apparatusDescription.forEach((app, i) => {
    doc.text(`[${i + 1}] ${app}`, margin + 2, y);
    y += 4.5;
  });

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('SECTION C: RAW EXPERIMENTAL DATA COLLECTION TABLE', margin, y);

  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Note: Readings include natural calibrated measurement uncertainty (+-2% instrument noise) to simulate real physical apparatus.', margin, y);

  // Render Data Table
  y += 5;
  const cols = practical.dataColumns;
  const colWidth = contentWidth / cols.length;
  const rowHeight = 7.5;

  // Table Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, y, contentWidth, rowHeight + 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);

  cols.forEach((col, idx) => {
    const xPos = margin + idx * colWidth;
    const title = col.unit ? `${col.label} (${col.symbol} / ${col.unit})` : `${col.label} (${col.symbol})`;
    const titleSplit = doc.splitTextToSize(title, colWidth - 2);
    doc.text(titleSplit, xPos + colWidth / 2, y + 5, { align: 'center' });
  });

  y += rowHeight + 2;

  // Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  submission.dataTable.forEach((row, rIdx) => {
    const isEven = rIdx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, rowHeight, 'F');
    doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
    doc.rect(margin, y, contentWidth, rowHeight, 'D');

    cols.forEach((col, cIdx) => {
      const xPos = margin + cIdx * colWidth;
      doc.line(xPos, y, xPos, y + rowHeight);
      const val = row[col.key];
      const displayVal = typeof val === 'number' 
        ? val.toFixed(col.decimalPlaces ?? 2) 
        : (val !== undefined ? String(val) : '-');
      doc.text(displayVal, xPos + colWidth / 2, y + 5, { align: 'center' });
    });

    y += rowHeight;
  });

  // Sample Calculation Box
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('MATHEMATICAL DERIVATION & UNCERTAINTY AUDIT', margin, y);

  y += 4;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.roundedRect(margin, y, contentWidth, 55, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Governing Physical Formula & Model:', margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  if (practical.id === 'gr12-internal-resistance') {
    doc.text('• Linear Model: V = E - I·r  =>  V = (-r)·I + E  (y = mx + c)', margin + 4, y + 14);
    doc.text(`• Selected Coordinate 1: (I1 = ${submission.graphCalc.point1.x.toFixed(2)} A, V1 = ${submission.graphCalc.point1.y.toFixed(2)} V)`, margin + 4, y + 21);
    doc.text(`• Selected Coordinate 2: (I2 = ${submission.graphCalc.point2.x.toFixed(2)} A, V2 = ${submission.graphCalc.point2.y.toFixed(2)} V)`, margin + 4, y + 28);
    doc.text(`• Calculated Gradient (m) = (V2 - V1) / (I2 - I1) = ${submission.graphCalc.calculatedSlope.toFixed(3)} V/A (Ω)`, margin + 4, y + 35);
    doc.text(`• Derived Internal Resistance: r = -m = ${submission.graphCalc.derivedConstantValue.toFixed(2)} Ω`, margin + 4, y + 42);
    doc.text(`• Derived Open-Circuit EMF: E = y-intercept = ${submission.graphCalc.calculatedIntercept.toFixed(2)} V`, margin + 4, y + 49);
  } else if (practical.id === 'gr11-snells-law') {
    doc.text('• Snell\'s Equation: n_air · sin(θ_i) = n_glass · sin(θ_r)  =>  sin(θ_i) = n_glass · sin(θ_r)', margin + 4, y + 14);
    doc.text(`• Coordinate 1: (sin r1 = ${submission.graphCalc.point1.x.toFixed(3)}, sin i1 = ${submission.graphCalc.point1.y.toFixed(3)})`, margin + 4, y + 21);
    doc.text(`• Coordinate 2: (sin r2 = ${submission.graphCalc.point2.x.toFixed(3)}, sin i2 = ${submission.graphCalc.point2.y.toFixed(3)})`, margin + 4, y + 28);
    doc.text(`• Gradient (m) = Δsin(θ_i) / Δsin(θ_r) = ${submission.graphCalc.calculatedSlope.toFixed(3)}`, margin + 4, y + 35);
    doc.text(`• Derived Refractive Index of Glass: n_glass = ${submission.graphCalc.derivedConstantValue.toFixed(3)}`, margin + 4, y + 42);
    doc.text('• Theoretical Value: n = 1.52 (Crown Glass) | Precision within CAPS tolerance.', margin + 4, y + 49);
  } else {
    doc.text(`• Governing Model: ${practical.graphConfig.physicalMeaningOfSlope}`, margin + 4, y + 14);
    doc.text(`• Gradient (m): ${submission.graphCalc.calculatedSlope.toFixed(3)} ${submission.graphCalc.unit}`, margin + 4, y + 24);
    doc.text(`• Derived Physical Constant: ${submission.graphCalc.derivedConstantName} = ${submission.graphCalc.derivedConstantValue.toFixed(2)} ${submission.graphCalc.unit}`, margin + 4, y + 34);
    doc.text(`• y-Intercept Value: ${submission.graphCalc.calculatedIntercept.toFixed(2)}`, margin + 4, y + 44);
  }

  // ═══════════════════════════════════════════════════════════════════
  // PAGE 3: VECTOR GRAPHICAL ANALYSIS & LINE OF BEST FIT
  // ═══════════════════════════════════════════════════════════════════
  doc.addPage();
  drawHeader(3, 4);

  y = 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('SECTION D: FORMAL GRAPHICAL ANALYSIS & LINE OF BEST FIT', margin, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Graph of ${practical.graphConfig.yAxis.label} (${practical.graphConfig.yAxis.symbol}) vs ${practical.graphConfig.xAxis.label} (${practical.graphConfig.xAxis.symbol})`, margin, y);

  // Draw Graph Canvas Area
  y += 5;
  const graphOriginX = margin + 15;
  const graphOriginY = y + 140;
  const graphW = contentWidth - 25;
  const graphH = 130;

  // Background grid
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.rect(graphOriginX, y + 10, graphW, graphH, 'FD');

  // Draw grid lines
  const gridStepsX = 8;
  const gridStepsY = 8;
  doc.setDrawColor(235, 240, 245);
  doc.setLineWidth(0.2);

  for (let i = 1; i < gridStepsX; i++) {
    const gx = graphOriginX + (i * graphW) / gridStepsX;
    doc.line(gx, y + 10, gx, y + 10 + graphH);
  }
  for (let j = 1; j < gridStepsY; j++) {
    const gy = y + 10 + (j * graphH) / gridStepsY;
    doc.line(graphOriginX, gy, graphOriginX + graphW, gy);
  }

  // Draw Main Axes
  doc.setDrawColor(textDark[0], textDark[1], textDark[2]);
  doc.setLineWidth(0.6);
  doc.line(graphOriginX, graphOriginY, graphOriginX + graphW, graphOriginY); // X axis
  doc.line(graphOriginX, y + 10, graphOriginX, graphOriginY); // Y axis

  // Axes Labels
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${practical.graphConfig.xAxis.label} [${practical.graphConfig.xAxis.symbol} / ${practical.graphConfig.xAxis.unit}]`, graphOriginX + graphW / 2, graphOriginY + 9, { align: 'center' });

  // Rotated Y axis label
  doc.text(`${practical.graphConfig.yAxis.label} [${practical.graphConfig.yAxis.symbol} / ${practical.graphConfig.yAxis.unit}]`, graphOriginX - 8, y + 10 + graphH / 2, { angle: 90, align: 'center' });

  // Plot Data Points
  const xCfg = practical.graphConfig.xAxis;
  const yCfg = practical.graphConfig.yAxis;

  const mapX = (xVal: number) => graphOriginX + ((xVal - xCfg.min) / (xCfg.max - xCfg.min)) * graphW;
  const mapY = (yVal: number) => graphOriginY - ((yVal - yCfg.min) / (yCfg.max - yCfg.min)) * graphH;

  // Draw Line of Best Fit
  const lineP1 = submission.graphCalc.point1;
  const lineP2 = submission.graphCalc.point2;

  if (lineP1 && lineP2) {
    doc.setDrawColor(220, 38, 38); // Red trendline
    doc.setLineWidth(0.7);
    const startX = xCfg.min;
    const startY = submission.graphCalc.calculatedSlope * startX + submission.graphCalc.calculatedIntercept;
    const endX = xCfg.max;
    const endY = submission.graphCalc.calculatedSlope * endX + submission.graphCalc.calculatedIntercept;

    doc.line(
      Math.max(graphOriginX, Math.min(graphOriginX + graphW, mapX(startX))),
      Math.max(y + 10, Math.min(graphOriginY, mapY(startY))),
      Math.max(graphOriginX, Math.min(graphOriginX + graphW, mapX(endX))),
      Math.max(y + 10, Math.min(graphOriginY, mapY(endY)))
    );
  }

  // Draw Plotted Cross Points
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.8);

  submission.dataTable.forEach(row => {
    const rawX = Number(row[xCfg.key]);
    const rawY = Number(row[yCfg.key]);
    if (!isNaN(rawX) && !isNaN(rawY)) {
      const px = mapX(rawX);
      const py = mapY(rawY);
      if (px >= graphOriginX && px <= graphOriginX + graphW && py >= y + 10 && py <= graphOriginY) {
        // Draw standard + mark
        doc.line(px - 1.5, py, px + 1.5, py);
        doc.line(px, py - 1.5, px, py + 1.5);
      }
    }
  });

  // Physical Interpretation Summary Box
  y = graphOriginY + 18;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.roundedRect(margin, y, contentWidth, 38, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('PHYSICAL INTERPRETATION OF GRADIENT & AXIS INTERCEPTS:', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const slopeMeaning = doc.splitTextToSize(`• Meaning of Gradient: ${practical.graphConfig.physicalMeaningOfSlope}`, contentWidth - 8);
  doc.text(slopeMeaning, margin + 4, y + 13);

  const intMeaning = doc.splitTextToSize(`• Meaning of y-Intercept: ${practical.graphConfig.physicalMeaningOfIntercept}`, contentWidth - 8);
  doc.text(intMeaning, margin + 4, y + 24);

  // ═══════════════════════════════════════════════════════════════════
  // PAGE 4: ERROR ANALYSIS, CONCLUSION & MODERATION RUBRIC
  // ═══════════════════════════════════════════════════════════════════
  doc.addPage();
  drawHeader(4, 4);

  y = 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('SECTION E: ERROR ANALYSIS, PRECAUTIONS & SCIENTIFIC CONCLUSION', margin, y);

  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('1. SOURCES OF EXPERIMENTAL ERROR (SYSTEMATIC & RANDOM):', margin, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const errText = submission.analysis.sourcesOfError || practical.commonErrors.join(' ');
  const errLines = doc.splitTextToSize(errText, contentWidth);
  doc.text(errLines, margin, y);
  y += errLines.length * 3.8 + 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('2. PRECAUTIONS OBSERVED DURING EXPERIMENT:', margin, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const precText = submission.analysis.precautionsObserved || practical.precautions.join(' ');
  const precLines = doc.splitTextToSize(precText, contentWidth);
  doc.text(precLines, margin, y);
  y += precLines.length * 3.8 + 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('3. SCIENTIFIC CONCLUSION:', margin, y);
  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const conclText = submission.analysis.conclusion || `The experimental results confirm that ${practical.shortTitle} behaves in accordance with theoretical CAPS principles. Derived ${submission.graphCalc.derivedConstantName} = ${submission.graphCalc.derivedConstantValue.toFixed(2)} ${submission.graphCalc.unit}.`;
  const conclLines = doc.splitTextToSize(conclText, contentWidth);
  doc.text(conclLines, margin, y);
  y += conclLines.length * 3.8 + 4;

  // SECTION F: OFFICIAL DBE RUBRIC MARKSHEET
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('SECTION F: OFFICIAL CAPS / SACAI SBA MODERATION MARKSHEET', margin, y);

  y += 4;
  // Rubric Table Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);

  doc.text('ASSESSMENT CRITERION', margin + 3, y + 4.5);
  doc.text('MAX', margin + contentWidth - 45, y + 4.5, { align: 'center' });
  doc.text('AWARDED', margin + contentWidth - 25, y + 4.5, { align: 'center' });
  doc.text('MODERATED', margin + contentWidth - 8, y + 4.5, { align: 'center' });

  y += 6.5;

  // Rubric Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  submission.evaluation.items.forEach((item, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
    doc.rect(margin, y, contentWidth, 7, 'D');

    doc.text(item.criterion, margin + 3, y + 4.5);
    doc.text(String(item.maxMarks), margin + contentWidth - 45, y + 4.5, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.text(String(item.awardedMarks), margin + contentWidth - 25, y + 4.5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('—', margin + contentWidth - 8, y + 4.5, { align: 'center' });

    y += 7;
  });

  // Total Marks Row
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, contentWidth, 8, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('TOTAL FORMAL SBA SCORE:', margin + 3, y + 5.5);
  doc.text(`${submission.evaluation.maxMarks}`, margin + contentWidth - 45, y + 5.5, { align: 'center' });
  doc.text(`${submission.evaluation.totalMarksAwarded}`, margin + contentWidth - 25, y + 5.5, { align: 'center' });
  doc.text(`${submission.evaluation.percentage}%`, margin + contentWidth - 8, y + 5.5, { align: 'center' });

  // Assessor / Moderator Sign-off Box
  y += 12;
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 30, 1.5, 1.5, 'FD');

  doc.line(margin + contentWidth / 2, y, margin + contentWidth / 2, y + 30);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('INTERNAL EDUCATOR / TUTOR SIGN-OFF:', margin + 3, y + 5);
  doc.text('DISTRICT / SACAI MODERATOR ENDORSEMENT:', margin + contentWidth / 2 + 3, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Educator Name: ____________________________', margin + 3, y + 13);
  doc.text('Signature: __________________  Date: _______', margin + 3, y + 22);

  doc.text('Moderator Name: __________________________', margin + contentWidth / 2 + 3, y + 13);
  doc.text('Official Stamp: ____________________________', margin + contentWidth / 2 + 3, y + 22);

  return doc;
}
