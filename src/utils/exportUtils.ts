import { Holding } from '@/data/holdings';
import { formatCurrency, formatNumber, formatPercent } from './formatters';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ExtendedHolding extends Holding {
  company?: string;
  prevClose?: number;
}

export function exportToCSV(holdings: ExtendedHolding[]) {
  const headers = [
    'Symbol',
    'Company',
    'Sector',
    'Shares',
    'Avg Price',
    'Current Price',
    'Daily Change',
    'Cost Basis',
    'Market Value',
    'Gain/Loss',
    'Gain/Loss %',
    'Dividend Yield',
    'Annual Income'
  ];

  const rows = holdings.map(h => [
    h.symbol,
    h.company || h.symbol,
    h.sector,
    formatNumber(h.shares),
    formatCurrency(h.avgPrice),
    formatCurrency(h.currentPrice),
    formatPercent((h.currentPrice - (h.prevClose || h.currentPrice)) / (h.prevClose || h.currentPrice)),
    formatCurrency(h.costBasis),
    formatCurrency(h.shares * h.currentPrice),
    formatCurrency(h.shares * h.currentPrice - h.costBasis),
    formatPercent((h.shares * h.currentPrice - h.costBasis) / h.costBasis),
    formatPercent(h.dividendYield / 100),
    formatCurrency(h.shares * h.currentPrice * (h.dividendYield / 100))
  ]);

  const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `holdings-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function exportToPDF(holdings: ExtendedHolding[]) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Portfolio Holdings', 14, 20);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

  // Calculate totals
  const totalCostBasis = holdings.reduce((sum, h) => sum + h.costBasis, 0);
  const totalMarketValue = holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  const totalGainLoss = totalMarketValue - totalCostBasis;
  const totalGainLossPercent = (totalGainLoss / totalCostBasis) * 100;
  const totalAnnualIncome = holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice * (h.dividendYield / 100)), 0);

  // Add summary
  doc.setFontSize(12);
  doc.text('Portfolio Summary:', 14, 40);
  doc.setFontSize(10);
  doc.text([
    `Total Cost Basis: ${formatCurrency(totalCostBasis)}`,
    `Total Market Value: ${formatCurrency(totalMarketValue)}`,
    `Total Gain/Loss: ${formatCurrency(totalGainLoss)} (${formatPercent(totalGainLossPercent)})`,
    `Total Annual Income: ${formatCurrency(totalAnnualIncome)}`
  ], 14, 50);

  // Add holdings table
  const tableData = holdings.map(h => [
    h.symbol,
    h.company || h.symbol,
    h.sector,
    formatNumber(h.shares),
    formatCurrency(h.avgPrice),
    formatCurrency(h.currentPrice),
    formatPercent((h.currentPrice - (h.prevClose || h.currentPrice)) / (h.prevClose || h.currentPrice)),
    formatCurrency(h.costBasis),
    formatCurrency(h.shares * h.currentPrice),
    formatCurrency(h.shares * h.currentPrice - h.costBasis),
    formatPercent((h.shares * h.currentPrice - h.costBasis) / h.costBasis),
    formatPercent(h.dividendYield / 100),
    formatCurrency(h.shares * h.currentPrice * (h.dividendYield / 100))
  ]);

  (doc as any).autoTable({
    startY: 70,
    head: [['Symbol', 'Company', 'Sector', 'Shares', 'Avg Price', 'Current Price', 'Daily Change', 'Cost Basis', 'Market Value', 'Gain/Loss', 'Gain/Loss %', 'Dividend Yield', 'Annual Income']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [22, 163, 74] }
  });

  // Save the PDF
  doc.save(`holdings-${new Date().toISOString().split('T')[0]}.pdf`);
} 