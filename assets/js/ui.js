let currentCampaign = null;
let lastValues = { cpc: 0, leads: 0, cpl: 0 };

// ===== DARK MODE LOGIC =====
function initDarkMode() {
  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme === 'true') {
    document.body.classList.add('dark');
  }
  
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('darkMode', isDark);
    });
  }
}

// ===== ANIMATIONS & VISUALS =====
function animateValue(element, start, end, duration = 800) {
  if (!element) return;
  let startTime = null;
  const isCurrency = element.id.includes('cpc') || element.id.includes('cpl');
  
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const current = start + (end - start) * progress;
    
    element.textContent = isCurrency 
      ? `$${current.toFixed(2)}` 
      : Math.round(current).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

function updateLeadQuality(cpl) {
  const card = document.getElementById('cardCPL');
  if (!card) return;
  
  if (cpl <= 20) {
    card.style.borderLeftColor = 'var(--success)';
  } else if (cpl <= 50) {
    card.style.borderLeftColor = 'var(--warning)';
  } else {
    card.style.borderLeftColor = 'var(--danger)';
  }
}

// ===== CORE DASHBOARD LOGIC =====
function updateDashboard() {
  const budgetEl = document.getElementById('budget');
  const clicksEl = document.getElementById('clicks');
  const convRateEl = document.getElementById('convRate');
  
  const budget = parseFloat(budgetEl.value);
  const clicks = parseFloat(clicksEl.value);
  const convRate = parseFloat(convRateEl.value);
  
  let isValid = true;
  [budgetEl, clicksEl, convRateEl].forEach(el => {
    const val = parseFloat(el.value);
    if (isNaN(val) || val <= 0) {
      el.classList.add('error');
      isValid = false;
    } else {
      el.classList.remove('error');
    }
  });

  if (!isValid) return;
  
  const metrics = calculateMetrics(budget, clicks, convRate);
  if (!metrics) return;
  
  animateValue(document.getElementById('cpcValue'), lastValues.cpc, metrics.cpc);
  animateValue(document.getElementById('cplValue'), lastValues.cpl, metrics.cpl);
  animateValue(document.getElementById('leadsValue'), lastValues.leads, metrics.leads);
  
  lastValues = { cpc: metrics.cpc, leads: metrics.leads, cpl: metrics.cpl };
  updateLeadQuality(metrics.cpl);
  
  currentCampaign = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    budget,
    clicks,
    convRate,
    cpc: metrics.cpc,
    leads: metrics.leads,
    cpl: metrics.cpl
  };
}

// ===== PROFESSIONAL PDF REPORT GENERATION =====
async function generateProfessionalReport() {
  if (!currentCampaign) {
    alert('Please calculate ROI first.');
    return;
  }

  const btn = document.getElementById('exportPdfBtn') || document.getElementById('reportBtn');
  const originalText = btn ? btn.textContent : '';
  if (btn) {
    btn.textContent = 'Generating...';
    btn.disabled = true;
  }

  // Create hidden report container
  const reportDiv = document.createElement('div');
  reportDiv.className = 'professional-report';
  // Use inline styles to ensure the hidden div looks good during capture
  Object.assign(reportDiv.style, {
    position: 'fixed',
    left: '-9999px',
    top: '0',
    width: '800px',
    padding: '40px',
    background: '#ffffff',
    color: '#0f172a',
    fontFamily: 'sans-serif'
  });

  document.body.appendChild(reportDiv);

  // Lead quality logic
  let qualityClass = 'quality-good';
  let qualityText = 'Excellent (CPL < $20)';
  let qualityColor = '#10b981';

  if (currentCampaign.cpl > 50) {
    qualityClass = 'quality-poor';
    qualityText = 'Needs Improvement (CPL > $50)';
    qualityColor = '#ef4444';
  } else if (currentCampaign.cpl > 20) {
    qualityClass = 'quality-warning';
    qualityText = 'Moderate (CPL $20–$50)';
    qualityColor = '#f59e0b';
  }

  reportDiv.innerHTML = `
    <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px;">
      <h1 style="color: #3b82f6; margin: 0;">📊 ROI Compass</h1>
      <p style="margin: 5px 0 0 0; color: #64748b;">Campaign Performance Report</p>
      <p style="font-size: 12px; color: #94a3b8;">Generated: ${new Date().toLocaleString()}</p>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="border-left: 4px solid #3b82f6; padding-left: 10px;">Campaign Inputs</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0;">Budget</td><td style="text-align: right;"><strong>$${currentCampaign.budget.toFixed(2)}</strong></td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0;">Clicks</td><td style="text-align: right;"><strong>${currentCampaign.clicks.toLocaleString()}</strong></td></tr>
        <tr><td style="padding: 10px 0;">Conversion Rate</td><td style="text-align: right;"><strong>${currentCampaign.convRate}%</strong></td></tr>
      </table>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="border-left: 4px solid #3b82f6; padding-left: 10px;">Key Metrics</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0;">Cost Per Click (CPC)</td><td style="text-align: right;"><strong>$${currentCampaign.cpc.toFixed(2)}</strong></td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0;">Cost Per Lead (CPL)</td><td style="text-align: right;"><strong>$${currentCampaign.cpl.toFixed(2)}</strong></td></tr>
        <tr><td style="padding: 10px 0;">Total Leads</td><td style="text-align: right;"><strong>${Math.round(currentCampaign.leads)}</strong></td></tr>
      </table>
      <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 5px solid ${qualityColor};">
        <strong style="color: ${qualityColor};">⚡ Lead Quality:</strong> ${qualityText}
      </div>
    </div>

    <div style="text-align: center; margin-top: 50px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
      ROI Compass – Data‑Driven Marketing Decisions
    </div>
  `;

  try {
    const canvas = await html2canvas(reportDiv, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`ROI_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  } catch (err) {
    console.error('PDF Error:', err);
    alert('Failed to generate report.');
  } finally {
    document.body.removeChild(reportDiv);
    if (btn) {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }
}

// ===== SEO PREVIEW =====
function initSEOPreview() {
  const titleInput = document.getElementById('seoTitle');
  const descInput = document.getElementById('seoDesc');
  const snippetTitle = document.getElementById('snippetTitle');
  const snippetDesc = document.getElementById('snippetDesc');
  
  if (!titleInput || !descInput) return;

  function updatePreview() {
    snippetTitle.textContent = titleInput.value.trim() || 'Your SEO Title';
    snippetDesc.textContent = descInput.value.trim() || 'Your meta description will appear here.';
  }
  
  titleInput.addEventListener('input', updatePreview);
  descInput.addEventListener('input', updatePreview);
}

// ===== CAMPAIGN TABLE LOGIC =====
function saveCurrentCampaign() {
  if (!currentCampaign) {
    alert('Please calculate ROI first.');
    return;
  }
  saveCampaign(currentCampaign);
  alert('Campaign saved successfully!');
  if (document.getElementById('campaignsTableBody')) renderCampaignsTable();
}

function renderCampaignsTable() {
  const campaigns = getCampaigns();
  const tbody = document.getElementById('campaignsTableBody');
  if (!tbody) return;

  if (campaigns.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem;">No campaigns saved yet.</td></tr>';
    return;
  }

  tbody.innerHTML = campaigns.map(campaign => `
    <tr data-id="${campaign.id}">
      <td>${new Date(campaign.timestamp).toLocaleDateString()}</td>
      <td>$${campaign.budget.toFixed(2)}</td>
      <td>${campaign.clicks.toLocaleString()}</td>
      <td>${campaign.convRate}%</td>
      <td>$${campaign.cpc.toFixed(2)}</td>
      <td>$${campaign.cpl.toFixed(2)}</td>
      <td>${Math.round(campaign.leads).toLocaleString()}</td>
      <td>
        <button class="delete-campaign" data-id="${campaign.id}">Delete</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.delete-campaign').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      deleteCampaign(id);
      renderCampaignsTable();
    });
  });
}

function initSorting() {
  const headers = document.querySelectorAll('table th');
  headers.forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      const text = header.textContent.toLowerCase();
      let key = 'timestamp';
      
      if (text.includes('budget')) key = 'budget';
      if (text.includes('clicks')) key = 'clicks';
      if (text.includes('conv')) key = 'convRate';
      if (text.includes('cpc')) key = 'cpc';
      if (text.includes('cpl')) key = 'cpl';
      if (text.includes('leads')) key = 'leads';

      const campaigns = getCampaigns();
      campaigns.sort((a, b) => b[key] - a[key]);
      renderCampaignsTable(); 
    });
  });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();

  const calculateBtn = document.getElementById('calculateBtn');
  if (calculateBtn) calculateBtn.addEventListener('click', updateDashboard);

  const saveBtn = document.getElementById('saveCampaignBtn');
  if (saveBtn) saveBtn.addEventListener('click', saveCurrentCampaign);

  // PDF Export (using the enhanced professional report)
  const exportBtn = document.getElementById('exportPdfBtn') || document.getElementById('reportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', generateProfessionalReport);
  }

  // SEO Tool
  if (document.getElementById('seoTitle')) {
    initSEOPreview();
  }

  // Table Management
  const clearAllBtn = document.getElementById('clearAllBtn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('Permanently delete all data?')) {
        clearAllCampaigns();
        renderCampaignsTable();
      }
    });
  }

  if (document.getElementById('campaignsTableBody')) {
    renderCampaignsTable();
    initSorting();
  }
});