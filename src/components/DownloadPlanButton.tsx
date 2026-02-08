'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

interface DownloadPlanButtonProps {
  planId?: string;
}

export default function DownloadPlanButton({ planId = 'travel-plan' }: DownloadPlanButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAsPDF = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById(planId);
      if (!element) {
        alert('Plan not found');
        setIsDownloading(false);
        return;
      }
      // Create a clean, print-friendly clone of the plan so UI controls don't appear
      const cloneWrapper = document.createElement('div');
      cloneWrapper.setAttribute('aria-hidden', 'true');
      // Compact layout for 1-2 page PDF
      cloneWrapper.style.position = 'fixed';
      cloneWrapper.style.top = '-10000px';
      cloneWrapper.style.left = '0';
      cloneWrapper.style.width = '800px'; // Narrower for A4 (210mm ≈ 790px at 96dpi)
      cloneWrapper.style.padding = '12px';
      cloneWrapper.style.background = '#ffffff';
      cloneWrapper.style.fontFamily = 'Arial, sans-serif';
      cloneWrapper.style.color = '#0f172a';
      cloneWrapper.style.boxSizing = 'border-box';
      cloneWrapper.style.fontSize = '12px';
      cloneWrapper.style.lineHeight = '1.4';

      // Create compact header
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.marginBottom = '8px';
      header.style.paddingBottom = '6px';
      header.style.borderBottom = '2px solid #3b82f6';

      const title = document.createElement('div');
      title.innerHTML = `<h1 style="margin:0;font-size:16px;font-weight:700;">Tokyo 3-Day Itinerary</h1><div style="font-size:9px;color:#6b7280;margin-top:1px;">SmartTrip AI</div>`;

      const logo = document.createElement('div');
      logo.innerHTML = `<div style="width:40px;height:20px;background:linear-gradient(90deg,#3b82f6,#8b5cf6);border-radius:4px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:9px;">ST</div>`;

      header.appendChild(title);
      header.appendChild(logo);

      // Clone the target element
      const cloned = element.cloneNode(true) as HTMLElement;
      // Remove interactive elements that shouldn't appear in PDF
      cloned.querySelectorAll('button, input, textarea, a, [data-no-print]').forEach((n) => n.remove());
      
      // Strip all class names and gradient/problematic styles to avoid OKLCH parsing errors
      // Also apply compact styles to reduce PDF size
      const cleanElement = (el: HTMLElement) => {
        el.removeAttribute('class');
        el.style.background = 'transparent';
        el.style.backgroundImage = 'none';
        el.style.margin = '0';
        el.style.padding = '0';
        el.style.fontSize = '11px';
        el.style.lineHeight = '1.3';
        el.querySelectorAll('*').forEach((child) => {
          const c = child as HTMLElement;
          c.removeAttribute('class');
          c.style.background = 'transparent';
          c.style.backgroundImage = 'none';
          c.style.margin = '0';
          c.style.padding = '0';
          c.style.fontSize = '11px';
          c.style.lineHeight = '1.3';
          // Add small gap between sections
          if (c.tagName.match(/^(H[1-6]|DIV)$/i)) {
            c.style.marginTop = '3px';
            c.style.marginBottom = '2px';
          }
        });
      };
      cleanElement(cloned);
      
      // Ensure full width for print
      cloned.style.width = '100%';
      cloned.style.boxSizing = 'border-box';
      cloned.style.color = '#0f172a';
      cloned.style.fontFamily = 'Arial, sans-serif';
      cloned.style.fontSize = '11px';

      cloneWrapper.appendChild(header);
      cloneWrapper.appendChild(cloned);
      document.body.appendChild(cloneWrapper);

      // Dynamically import jsPDF and html2canvas
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Scale for clarity (lower = more compact, higher = clearer)
      const scale = 2;

      const canvas = await html2canvas(cloneWrapper, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: cloneWrapper.scrollWidth,
        windowHeight: cloneWrapper.scrollHeight,
      });

      // Remove clone from DOM
      document.body.removeChild(cloneWrapper);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pageWidth = 210; // mm
      const pageHeight = 297; // mm

      // Calculate image dimensions in mm
      const pxPerMm = canvas.width / (pageWidth * (scale));
      const imgWidthMm = canvas.width / pxPerMm;
      const imgHeightMm = canvas.height / pxPerMm;

      const totalPages = Math.ceil(imgHeightMm / pageHeight);

      // Add each page slice
      for (let page = 0; page < totalPages; page++) {
        const srcY = (canvas.height / totalPages) * page;
        const sHeight = Math.floor(canvas.height / totalPages);

        // Create a temporary canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sHeight;
        const ctx = pageCanvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, srcY, canvas.width, sHeight, 0, 0, pageCanvas.width, pageCanvas.height);

        const pageImgData = pageCanvas.toDataURL('image/png');

        const imgHeightForPdf = (pageCanvas.height * pageWidth) / pageCanvas.width;

        if (page > 0) pdf.addPage();
        pdf.addImage(pageImgData, 'PNG', 0, 0, pageWidth, imgHeightForPdf);

        // Footer with page number (only if multi-page)
        if (totalPages > 1) {
          pdf.setFontSize(8);
          pdf.setTextColor(150);
          pdf.text(`Page ${page + 1}`, pageWidth - 12, pageHeight - 6);
        }
      }

      pdf.save('tokyo-itinerary.pdf');
    } catch (error) {
      console.error('PDF download failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex gap-4 justify-center items-center mt-8 flex-wrap">
      <button
        onClick={downloadAsPDF}
        disabled={isDownloading}
        className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
      >
        <Download className="w-5 h-5" />
        {isDownloading ? 'Generating PDF...' : 'Download as PDF'}
      </button>
      <p className="text-sm text-gray-600">
        Auto-downloads to your device
      </p>
    </div>
  );
}

