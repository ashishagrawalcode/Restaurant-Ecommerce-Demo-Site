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

  // Fetch inquiries from backend API
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

    try {
      const url = filter && filter !== 'all'
        ? `/api/admin/contacts/list?status=${encodeURIComponent(filter)}`
        : '/api/admin/contacts/list';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const inquiries = data.inquiries || [];
      const total = typeof data.total === 'number' ? data.total : inquiries.length;

      // Update count badge
      if (countChip) {
        const label = filter === 'all' ? 'Total' : filter.charAt(0).toUpperCase() + filter.slice(1);
        countChip.textContent = `${total} ${label} Inquir${total !== 1 ? 'ies' : 'y'}`;
      }

      renderTable(inquiries);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
      if (tableBody) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 40px; color: #f56c6c;">
              Unable to load inquiries from server (${escapeHtml(err.message)}).<br>
              <button type="button" class="btn-refresh" style="margin-top: 12px;" onclick="window.location.reload()">Retry</button>
            </td>
          </tr>
        `;
      }
      if (countChip) countChip.textContent = 'Error loading';
      showToast('Could not load inquiries. Ensure the backend server is running.', false);
    }
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

          const data = await res.json();
          if (res.ok && data.success) {
            showToast(`Inquiry ${id} marked as replied!`);
            // Refresh list to update counts and filtered views properly
            await loadInquiries(currentFilter);
          } else {
            throw new Error(data.message || 'Status update failed');
          }
        } catch (err) {
          console.error('Error updating status:', err);
          showToast(`Error: ${err.message}`, false);
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
