// admin inquiries management
document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('inquiriesTableBody');
  const countChip = document.getElementById('inquiryCountChip');
  const refreshBtn = document.getElementById('refreshBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('adminSearchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const toast = document.getElementById('adminToast');

  let currentFilter = 'all';
  let searchQuery = '';
  let toastTimer = null;
  let cachedInquiries = [];

  // toast notification popup
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

  // escape html for safety
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // format date string for display
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

  // update dashboard metric cards
  function updateKpiCards(allList) {
    const totalEl = document.getElementById('kpiTotal');
    const pendingEl = document.getElementById('kpiPending');
    const repliedEl = document.getElementById('kpiReplied');
    const rateEl = document.getElementById('kpiRate');
    const rateSubEl = document.getElementById('kpiRateSub');
    const progressFill = document.getElementById('kpiProgressFill');

    if (!totalEl || !pendingEl || !repliedEl || !rateEl) return;

    const list = Array.isArray(allList) ? allList : [];
    const total = list.length;
    const pending = list.filter(i => (i.status || 'pending').toLowerCase() === 'pending').length;
    const replied = list.filter(i => (i.status || 'pending').toLowerCase() === 'replied').length;
    const rate = total > 0 ? Math.round((replied / total) * 100) : 0;

    totalEl.textContent = total;
    pendingEl.textContent = pending;
    repliedEl.textContent = replied;
    rateEl.textContent = `${rate}%`;

    if (rateSubEl) {
      rateSubEl.textContent = `${replied} of ${total} addressed`;
    }
    if (progressFill) {
      progressFill.style.width = `${rate}%`;
    }
  }

  // filter by status and search query, then render
  function applyFiltersAndRender() {
    let list = cachedInquiries;

    // filter by status tab
    if (currentFilter && currentFilter !== 'all') {
      list = list.filter(item => (item.status || 'pending').toLowerCase() === currentFilter.toLowerCase());
    }

    // filter by live search input
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => {
        const id = (item.id || '').toLowerCase();
        const name = (item.name || '').toLowerCase();
        const email = (item.email || '').toLowerCase();
        const subject = (item.subject || '').toLowerCase();
        const msg = (item.message || '').toLowerCase();
        return id.includes(q) || name.includes(q) || email.includes(q) || subject.includes(q) || msg.includes(q);
      });
    }

    // update count chip text
    if (countChip) {
      const label = currentFilter === 'all' ? 'Total' : currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1);
      const searchNote = searchQuery ? ` matching "${searchQuery}"` : '';
      countChip.textContent = `${list.length} ${label}${searchNote}`;
    }

    renderTable(list);
  }

  // fetch inquiries from backend with local fallback
  async function loadInquiries() {
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--body-text);">
            Fetching customer inquiries...
          </td>
        </tr>
      `;
    }

    let isLiveBackend = false;

    // fetch all inquiries from live api
    try {
      const response = await fetch('/api/admin/contacts/list');
      if (response.ok) {
        const data = await response.json();
        cachedInquiries = data.inquiries || [];
        isLiveBackend = true;
      }
    } catch (apiErr) {
      // offline or static host
    }

    // fallback to storage and static backup
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

        cachedInquiries = Array.from(mergedMap.values());
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
      }
    }

    updateKpiCards(cachedInquiries);
    applyFiltersAndRender();
  }

  // render inquiry table rows
  function renderTable(inquiries) {
    if (!tableBody) return;

    if (!inquiries || inquiries.length === 0) {
      const filterMsg = searchQuery
        ? `No inquiries matching "${escapeHtml(searchQuery)}".`
        : `There are no customer inquiries matching "${escapeHtml(currentFilter)}".`;

      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <h3>No Inquiries Found</h3>
            <p>${filterMsg}</p>
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

  // handle mark as replied clicks
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

        // update backend status
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
          // offline fallback
        }

        // save to local storage
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
          cachedInquiries.forEach(item => {
            if (item.id === id) item.status = 'replied';
          });
          updateKpiCards(cachedInquiries);
          applyFiltersAndRender();
        } else {
          showToast(`Could not update inquiry status`, false);
          e.currentTarget.disabled = false;
          e.currentTarget.textContent = originalText;
        }
      });
    });
  }

  // live search input event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (searchClearBtn) {
        searchClearBtn.hidden = !searchQuery;
      }
      applyFiltersAndRender();
    });
  }

  // clear search button
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      searchClearBtn.hidden = true;
      applyFiltersAndRender();
      if (searchInput) searchInput.focus();
    });
  }

  // filter button clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-status') || 'all';
      applyFiltersAndRender();
    });
  });

  // refresh button click
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadInquiries();
      showToast('Inquiries refreshed');
    });
  }

  // initial load
  loadInquiries();
});
