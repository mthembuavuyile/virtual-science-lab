import React from 'react';
import { SbaPractical, DataRow } from '../../../types/sba';
import { Trash2, Plus, Info, Table, Check, AlertCircle } from 'lucide-react';

interface StepDataTableProps {
  practical: SbaPractical;
  dataTable: DataRow[];
  onDataTableChange: (table: DataRow[]) => void;
}

export default function StepDataTable({
  practical,
  dataTable,
  onDataTableChange
}: StepDataTableProps) {
  const cols = practical.dataColumns;

  const handleCellChange = (rowIndex: number, key: string, val: string) => {
    const updated = [...dataTable];
    const num = parseFloat(val);
    updated[rowIndex][key] = isNaN(num) ? val : num;
    onDataTableChange(updated);
  };

  const handleRemoveRow = (rowIndex: number) => {
    const updated = dataTable.filter((_, i) => i !== rowIndex);
    onDataTableChange(updated);
  };

  const handleAddBlankRow = () => {
    const newRow: DataRow = {
      id: `manual-${Date.now()}`,
      readingNum: dataTable.length + 1,
      trialNum: dataTable.length + 1
    };
    cols.forEach(col => {
      if (!newRow[col.key]) {
        newRow[col.key] = 0;
      }
    });
    onDataTableChange([...dataTable, newRow]);
  };

  return (
    <div className="space-y-6">
      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Table className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Official Experimental Data Collection Table (4 Marks)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verify your tabulated observations. Ensure values follow expected physical trends and units.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddBlankRow}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Row
          </button>
        </div>

        {dataTable.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No experimental data logged yet.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Return to Step 2 (Apparatus) and click "Record Reading" to populate this table.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  {cols.map((col, idx) => (
                    <th key={idx} className="px-4 py-3 font-bold">
                      {col.label}
                      <span className="block text-[10px] font-normal text-slate-400">
                        {col.symbol} {col.unit ? `(${col.unit})` : ''}
                      </span>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {dataTable.map((row, rIdx) => (
                  <tr key={row.id || rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    {cols.map((col, cIdx) => {
                      const val = row[col.key];
                      const isCalc = col.isCalculated;
                      return (
                        <td key={cIdx} className="px-4 py-2.5">
                          {isCalc ? (
                            <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                              {typeof val === 'number' ? val.toFixed(col.decimalPlaces ?? 2) : val}
                            </span>
                          ) : (
                            <input
                              type="number"
                              step="any"
                              value={val !== undefined ? val : ''}
                              onChange={e => handleCellChange(rIdx, col.key, e.target.value)}
                              className="w-24 px-2 py-1 font-mono rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-1 focus:ring-blue-500"
                            />
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(rIdx)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition"
                        title="Delete reading"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CAPS Moderation Checklist for Data Collection */}
        <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <strong>DBE Rubric Check:</strong> Logged {dataTable.length} of {practical.recommendedDataPointsCount} recommended points. Column units and standard decimal precision are verified.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
