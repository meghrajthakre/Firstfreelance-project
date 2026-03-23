import { useState, useMemo } from "react";

const RECEIVING_DATA = [
  { id: 1, name: "Amit (ADMIN7)", balance: 34040.43 },
  { id: 2, name: "raju (STAR)", balance: 24739312.18 },
  { id: 3, name: "NGPP (AKASH)", balance: 92324.74 },
  { id: 4, name: "warud (Gopi)", balance: 30497.25 },
  { id: 5, name: "Abcd (Vikey)", balance: 8510.71 },
  { id: 6, name: "Vijw (santosh)", balance: 1265.00 },
  { id: 7, name: "Demo (DEMO)", balance: 78082.00 },
  { id: 8, name: "Bhau (Ajay)", balance: 15993.93 },
  { id: 9, name: "Nammu (ADMIN391)", balance: 0.38 },
  { id: 10, name: "HHC (HHCC)", balance: 30001.44 },
];

const PAID_DATA = [
  { id: 1, name: "BHAYA (JAMMU)", balance: 5881.75 },
  { id: 2, name: "AMAR (ADMIN638)", balance: 280983.51 },
  { id: 3, name: "TESTSM (ADMIN659)", balance: 15955.00 },
];

const CLEAR_DATA = [];

function fmt(n) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function LedgerTable({ title, titleColor, data, emptyBalance = false }) {
  const total = useMemo(() => data.reduce((s, r) => s + r.balance, 0), [data]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 min-w-[280px]">
      {/* Title */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className={`text-sm font-bold uppercase tracking-wide ${titleColor}`}>{title}</h2>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-5 py-2.5 text-left font-semibold text-gray-700">Name</th>
            <th className="px-5 py-2.5 text-right font-semibold text-gray-700">Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className={`px-5 py-2.5 font-medium ${titleColor}`}>{row.name}</td>
              <td className="px-5 py-2.5 text-right text-gray-700 tabular-nums">{fmt(row.balance)}</td>
            </tr>
          ))}

          {/* Total row */}
          <tr className="bg-blue-50">
            <td className="px-5 py-2.5 font-bold text-gray-800">TOTAL</td>
            <td className="px-5 py-2.5 text-right font-bold text-gray-800 tabular-nums">
              {emptyBalance ? "0.00" : fmt(total)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function CashLedgerPage() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }`}
      </style>

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Cash Ledger</h1>

          <div className="flex flex-wrap gap-5 items-start">

            {/* Payment Receiving From */}
            <LedgerTable
              title="PAYMENT RECEIVING FROM (Lena Hai)"
              titleColor="text-green-600"
              data={RECEIVING_DATA}
            />

            {/* Payment Paid To */}
            <LedgerTable
              title="PAYMENT PAID TO (Dena Hai)"
              titleColor="text-red-500"
              data={PAID_DATA}
            />

            {/* Payment Clear */}
            <LedgerTable
              title="PAYMENT CLEAR (Clear Hai)"
              titleColor="text-gray-700"
              data={CLEAR_DATA}
              emptyBalance={true}
            />

          </div>
        </div>
      </div>
    </>
  );
}