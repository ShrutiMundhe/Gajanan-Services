/* ============================================================
   Gajanan Cleaning Services — booking.js
   Injects the "Book Now" modal on every page.
   ============================================================ */

(function initBookingModal() {

  /* ── 1. Inject CSS link if not already present ── */
  if (!document.querySelector('link[href*="booking.css"]')) {
    const isSubpage = window.location.pathname.includes('/services/');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = isSubpage ? '../css/booking.css' : 'css/booking.css';
    document.head.appendChild(link);
  }

  /* ── 2. Modal HTML ── */
  const SERVICES = [
    'Home Cleaning', 'Deep Cleaning', 'Office Cleaning',
    'Sofa Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning',
    'Carpet Cleaning', 'Window Cleaning'
  ];

  const ROOMS = [
    'Living Room', 'Bedroom', 'Bathroom', 'Kitchen',
    'Balcony', 'Sofa', 'Windows', 'Curtains'
  ];

  const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa / Bungalow'];

  let selectedServices = new Set();
  let roomCounts = {};
  ROOMS.forEach(r => roomCounts[r] = 0);

  /* Build modal HTML */
  const backdrop = document.createElement('div');
  backdrop.id = 'booking-modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-labelledby', 'bk-title');

  backdrop.innerHTML = `
    <div id="booking-modal">

      <!-- Header -->
      <div class="bk-header">
        <div>
          <h2 class="bk-header-title" id="bk-title">📋 Book Your Cleaning Service</h2>
          <p class="bk-header-subtitle">Fill in the details and we'll get back to you shortly</p>
        </div>
        <button class="bk-close-btn" id="bk-close-btn" aria-label="Close booking form">&times;</button>
      </div>

      <!-- Body -->
      <div class="bk-body">

        <!-- Left: Form -->
        <div class="bk-form-col">

          <!-- Services -->
          <div class="bk-section">
            <div class="bk-section-title">🧹 Select Services</div>
            <div class="bk-services-grid" id="bk-services-grid"></div>
          </div>

          <!-- Property -->
          <div class="bk-section">
            <div class="bk-section-title">🏠 Property Type</div>
            <select class="bk-select" id="bk-bhk">
              ${BHK_OPTIONS.map(o => `<option>${o}</option>`).join('')}
            </select>
            <div id="bk-counters"></div>
          </div>

          <!-- Contact -->
          <div class="bk-section">
            <div class="bk-section-title">📞 Your Details</div>
            <input  class="bk-input" id="bk-name"  type="text"  placeholder="Full Name *" />
            <input  class="bk-input" id="bk-phone" type="tel"   placeholder="Phone / WhatsApp *" />
            <input  class="bk-input" id="bk-addr"  type="text"  placeholder="Area / Address (Pune)" />
            <textarea class="bk-input" id="bk-notes" placeholder="Special requests or notes…"></textarea>
          </div>

          <button class="bk-submit-btn" id="bk-submit-btn">✅ Book Now</button>
        </div>

        <!-- Right: Summary -->
        <div class="bk-summary-col">
          <div class="bk-summary-title">📄 Summary</div>
          <div id="bk-summary-content">
            <p class="bk-summary-empty">No selections yet</p>
          </div>
        </div>

      </div><!-- /bk-body -->
    </div><!-- /booking-modal -->
  `;

  document.body.appendChild(backdrop);

  /* Toast */
  const toast = document.createElement('div');
  toast.id = 'bk-toast';
  toast.textContent = '✅ Booking request sent! We\'ll contact you shortly.';
  document.body.appendChild(toast);

  /* ── 3. Render services checkboxes ── */
  function renderServices() {
    const grid = document.getElementById('bk-services-grid');
    grid.innerHTML = '';
    SERVICES.forEach(svc => {
      const label = document.createElement('label');
      label.className = 'bk-check-label' + (selectedServices.has(svc) ? ' checked' : '');
      label.innerHTML = `<input type="checkbox" ${selectedServices.has(svc) ? 'checked' : ''}> ${svc}`;
      label.querySelector('input').addEventListener('change', function () {
        if (this.checked) selectedServices.add(svc);
        else selectedServices.delete(svc);
        label.classList.toggle('checked', this.checked);
        renderSummary();
      });
      grid.appendChild(label);
    });
  }

  /* ── 4. Render room counters ── */
  function renderCounters() {
    const wrap = document.getElementById('bk-counters');
    wrap.innerHTML = '';
    ROOMS.forEach(room => {
      const row = document.createElement('div');
      row.className = 'bk-counter-row';
      row.innerHTML = `
        <span class="bk-counter-label">${room}</span>
        <div class="bk-counter-controls">
          <button class="bk-counter-btn" data-room="${room}" data-d="-1">−</button>
          <span class="bk-counter-num" id="cnt-${room.replace(/\s/g,'-')}">${roomCounts[room]}</span>
          <button class="bk-counter-btn" data-room="${room}" data-d="1">+</button>
        </div>`;
      wrap.appendChild(row);
    });

    wrap.querySelectorAll('.bk-counter-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const room = this.dataset.room;
        const delta = parseInt(this.dataset.d);
        roomCounts[room] = Math.max(0, roomCounts[room] + delta);
        document.getElementById('cnt-' + room.replace(/\s/g, '-')).textContent = roomCounts[room];
        renderSummary();
      });
    });
  }

  /* ── 5. Render summary panel ── */
  function renderSummary() {
    const wrap = document.getElementById('bk-summary-content');
    let html = '';

    if (selectedServices.size > 0) {
      html += `<div class="bk-summary-title" style="margin-bottom:6px;">Services</div>
               <div class="bk-summary-services-wrap">`;
      selectedServices.forEach(s => { html += `<span class="bk-summary-service-tag">${s}</span>`; });
      html += `</div><br>`;
    }

    const hasRooms = ROOMS.some(r => roomCounts[r] > 0);
    if (hasRooms) {
      html += `<div class="bk-summary-title" style="margin-bottom:6px;">Rooms</div>`;
      ROOMS.forEach(r => {
        if (roomCounts[r] > 0) {
          html += `<div class="bk-summary-item"><span>${r}</span><span>${roomCounts[r]}</span></div>`;
        }
      });
    }

    const bhk = document.getElementById('bk-bhk');
    if (bhk) {
      html += `<br><div class="bk-summary-item"><span>Property</span><span>${bhk.value}</span></div>`;
    }

    if (!html) html = `<p class="bk-summary-empty">No selections yet</p>`;
    wrap.innerHTML = html;
  }

  /* ── 6. Open / Close ── */
  function openModal() {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderServices();
    renderCounters();
    renderSummary();
    document.getElementById('bk-bhk').addEventListener('change', renderSummary);
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('bk-close-btn').addEventListener('click', closeModal);
  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
  });

  /* ── 7. Submit ── */
  document.getElementById('bk-submit-btn').addEventListener('click', function () {
    const name  = document.getElementById('bk-name').value.trim();
    const phone = document.getElementById('bk-phone').value.trim();
    if (!name || !phone) {
      document.getElementById('bk-name').style.borderColor  = name  ? '' : '#e53935';
      document.getElementById('bk-phone').style.borderColor = phone ? '' : '#e53935';
      return;
    }

    const bhk    = document.getElementById('bk-bhk').value;
    const addr   = document.getElementById('bk-addr').value.trim();
    const notes  = document.getElementById('bk-notes').value.trim();
    const svcStr = [...selectedServices].join(', ') || 'Not specified';
    const roomStr = ROOMS.filter(r => roomCounts[r] > 0)
                         .map(r => `${r}: ${roomCounts[r]}`).join(', ') || 'Not specified';

    const msg = encodeURIComponent(
      `Hello! I'd like to book a cleaning service.\n\n` +
      `*Name:* ${name}\n*Phone:* ${phone}\n*Property:* ${bhk}\n` +
      (addr  ? `*Address:* ${addr}\n`  : '') +
      `*Services:* ${svcStr}\n*Rooms:* ${roomStr}\n` +
      (notes ? `*Notes:* ${notes}` : '')
    );

    window.open(`https://wa.me/919011272813?text=${msg}`, '_blank');

    closeModal();
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  });

  /* ── 8. Wire up all "Book Now" / "Get Free Quote" / "Get Quote" buttons ── */
  function wireButtons() {
    document.querySelectorAll(
      '.book-now-btn, [data-book-now], .nav-cta a, .float-btn-wa[data-wa]'
    ).forEach(el => {
      /* Skip WhatsApp float btn — it has its own handler */
      if (el.classList.contains('float-btn-wa')) return;
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });
  }

  /* Also expose globally so inline onclick can call it */
  window.openBookingModal = openModal;

  /* Run after DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireButtons);
  } else {
    wireButtons();
  }

})();
