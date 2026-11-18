// admin-inquiries.js - Restaurant Staff Inquiries Management
// Assigned to: Vivek Yadav
// Task: Display inquiries in table, handle status filter, and mark as replied

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('inquiriesTableBody');
  const countChip = document.getElementById('inquiryCountChip');
  const refreshBtn = document.getElementById('refreshBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const toast = document.getElementById('adminToast');

  let currentFilter = 'all';
  let toastTimer = null;
  let cachedInquiries = [];

  // Show toast notification
  function showToast(message, isSuccess = true) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.innerHTML = isSuccess
      ? `<span style="color: #67c23a;">✓</span> <span>${message}</span>`
      : `<span style="color: #f56c6c;">⚠</span> <span>${message}</span>`;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // Escape HTML helper to prevent XSS
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Format date helper
  function formatDate(isoStr) {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoStr;
    }
  }

  // Load inquiries: uses backend API with static/localStorage fallback for GitHub Pages
  async function loadInquiries(filter = currentFilter) {
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--body-text);">
            Fetching customer inquiries...
          </td>
        </tr>
      `;
    }

    let inquiries = [];
    let isLiveBackend = false;

    // 1. Try Live Backend API
    try {
      const url = filter && filter !== 'all'
        ? `/api/admin/contacts/list?status=${encodeURIComponent(filter)}`
        : '/api/admin/contacts/list';

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        inquiries = data.inquiries || [];
        isLiveBackend = true;
      }
    } catch (apiErr) {
      // Backend not running on this origin (e.g. GitHub Pages static deployment)
    }

    // 2. Fallback to localStorage & static backup if backend not available
    if (!isLiveBackend) {
      try {
        let localList = [];
        try {
          localList = JSON.parse(localStorage.getItem('saffron_contacts') || '[]');
        } catch (e) {
          localList = [];
        }

        let staticList = [];
        try {
          const staticRes = await fetch('../data/contacts.json');
          if (staticRes.ok) {
            staticList = await staticRes.json();
          }
        } catch (e) {
          staticList = [];
        }

        // Merge, preferring local items for latest status
        const mergedMap = new Map();
        staticList.forEach(item => {
          if (item && item.id) mergedMap.set(item.id, { ...item, status: item.status || 'pending' });
        });
        localList.forEach(item => {
          if (item && item.id) {
            const existing = mergedMap.get(item.id) || {};
            mergedMap.set(item.id, { ...existing, ...item, status: item.status || existing.status || 'pending' });
          }
        });

        inquiries = Array.from(mergedMap.values());
        cachedInquiries = inquiries;

        // Apply filter locally
        if (filter && filter !== 'all') {
          inquiries = inquiries.filter(c => (c.status || 'pending').toLowerCase() === filter.toLowerCase());
        }
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
      }
    }

    const total = inquiries.length;
    if (countChip) {
      const label = filter === 'all' ? 'Total' : filter.charAt(0).toUpperCase() + filter.slice(1);
      countChip.textContent = `${total} ${label} Inquir${total !== 1 ? 'ies' : 'y'}`;
    }

    renderTable(inquiries);
  }

  // Render rows in table
  function renderTable(inquiries) {
    if (!tableBody) return;

    if (!inquiries || inquiries.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <h3>No Inquiries Found</h3>
            <p>There are no customer inquiries matching "${escapeHtml(currentFilter)}".</p>
          </td>
        </tr>
      `;
      return;
    }

    const rowsHtml = inquiries.map(item => {
      const id = escapeHtml(item.id || 'N/A');
      const name = escapeHtml(item.name || 'Anonymous');
      const email = escapeHtml(item.email || '');
      const subject = escapeHtml(item.subject || 'General Inquiry');
      const message = escapeHtml(item.message || '');
      const status = (item.status || 'pending').toLowerCase();
      const dateText = formatDate(item.createdAt || item.submittedAt);

      const statusBadge = `
        <span class="status-badge ${status}">
          <span class="status-dot"></span>
          ${status}
        </span>
      `;

      const isReplied = status === 'replied';
      const actionButton = isReplied
        ? `<button type="button" class="btn-action done" disabled title="Already marked as replied">Replied &#10003;</button>`
        : `<button type="button" class="btn-action btn-mark-replied" data-id="${id}">Mark as Replied</button>`;

      return `
        <tr id="row-${id}">
          <td class="col-id">${id}</td>
          <td class="col-name">${name}</td>
          <td class="col-email">
            ${email ? `<a href="mailto:${email}">${email}</a>` : '<span style="color:#777;">—</span>'}
          </td>
          <td class="col-subject">${subject}</td>
          <td class="col-message">
            <div>${message}</div>
            ${dateText ? `<div class="col-date">${dateText}</div>` : ''}
          </td>
          <td class="col-status">${statusBadge}</td>
          <td class="col-action">${actionButton}</td>
        </tr>
      `;
    }).join('');

    tableBody.innerHTML = rowsHtml;
    attachActionListeners();
  }

  // Attach click listener for "Mark as Replied" buttons
  function attachActionListeners() {
    const buttons = tableBody.querySelectorAll('.btn-mark-replied');
    buttons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (!id) return;

        const originalText = e.currentTarget.textContent;
        e.currentTarget.disabled = true;
        e.currentTarget.textContent = 'Updating...';

        let updated = false;

        // 1. Try Backend API
        try {
          const res = await fetch('/api/admin/contacts/status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id,
              status: 'replied'
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              updated = true;
            }
          }
        } catch (apiErr) {
          // Backend offline or on GitHub Pages static deployment
        }

        // 2. Always persist status to localStorage as well
        try {
          const localList = JSON.parse(localStorage.getItem('saffron_contacts') || '[]');
          let found = false;
          localList.forEach(item => {
            if (item.id === id) {
              item.status = 'replied';
              found = true;
            }
          });
          if (!found) {
            localList.push({ id, status: 'replied' });
          }
          localStorage.setItem('saffron_contacts', JSON.stringify(localList));
          updated = true;
        } catch (storageErr) {
          console.error('Storage update error:', storageErr);
        }

        if (updated) {
          showToast(`Inquiry ${id} marked as replied!`);
          await loadInquiries(currentFilter);
        } else {
          showToast(`Could not update inquiry status`, false);
          e.currentTarget.disabled = false;
          e.currentTarget.textContent = originalText;
        }
      });
    });
  }

  // Filter button clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-status') || 'all';
      loadInquiries(currentFilter);
    });
  });

  // Refresh button click
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadInquiries(currentFilter);
      showToast('Inquiries refreshed');
    });
  }

  // Initial load on page load
  loadInquiries('all');
});
