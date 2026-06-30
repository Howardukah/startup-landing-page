// =========================================================================
// Supabase Configuration
// Paste your project's URL and Anon Key below to integrate the database.
// =========================================================================
const SUPABASE_URL = "https://tyqbfnahadfsayryyizx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_KpdxnzWZObLyy-1dCUL_kQ_v16yyz8v";

let supabaseClient = null;
if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
  if (SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Navbar Scroll Effect ----------
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
  }

  // ---------- Mobile Menu Toggle ----------
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && e.target !== menuBtn) {
        mobileMenu.classList.remove('open');
      }
    });
  }

  // ---------- Typewriter Effect ----------
  const PHRASES = [
    "What if your data could think?",
    "We build the AI your business deserves.",
    "Turn raw data into real decisions.",
    "Your next product, powered by machine learning.",
    "The future is intelligent. Is your business?"
  ];
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    
    const escapeHTML = (str) => {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    
    const tick = () => {
      const currentPhrase = PHRASES[phraseIdx];
      if (!isDeleting && charIdx === currentPhrase.length) {
        setTimeout(() => {
          isDeleting = true;
          tick();
        }, 2200); // Wait before starting to erase
        return;
      }
      if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % PHRASES.length;
      }
      
      charIdx += isDeleting ? -1 : 1;
      
      const visible = currentPhrase.substring(0, charIdx);
      const ghost = currentPhrase.substring(charIdx);
      
      typewriterEl.innerHTML = `<span class="typed-text">${escapeHTML(visible)}</span><span class="cursor"></span><span class="typed-ghost">${escapeHTML(ghost)}</span>`;
      
      setTimeout(tick, isDeleting ? 30 : 65); // Erasing is faster
    };
    
    tick();
  }

  // ---------- Scroll Reveal Animations ----------
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '-60px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ---------- Animated Counters (Stats) ----------
  const statNumbers = document.querySelectorAll('.stat-num');
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetVal = parseInt(el.dataset.count, 10);
          const duration = 1800; // ms
          const startTime = performance.now();
          
          const updateCount = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
            
            el.textContent = Math.floor(easeProgress * targetVal) + '+';
            
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = targetVal + '+';
            }
          };
          
          requestAnimationFrame(updateCount);
          counterObserver.unobserve(el);
        }
      });
    }, { rootMargin: '-30px' });

    statNumbers.forEach(num => counterObserver.observe(num));
  }

  // ---------- Active Nav Link Highlight — Shooting Indicator ----------
  const navLinksContainer = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-links a[data-section]');
  const sectionIds = Array.from(navLinkEls).map(a => a.dataset.section);
  const sectionEls = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  // Inject the sliding indicator bar into the nav-links list
  let indicator = null;
  if (navLinksContainer) {
    indicator = document.createElement('span');
    indicator.className = 'nav-indicator';
    navLinksContainer.appendChild(indicator);
  }

  // Move the indicator under a given anchor element
  const moveIndicator = (anchorEl) => {
    if (!indicator || !navLinksContainer) return;
    const navRect = navLinksContainer.getBoundingClientRect();
    const linkRect = anchorEl.getBoundingClientRect();
    const offsetLeft = linkRect.left - navRect.left;
    indicator.style.width  = linkRect.width + 'px';
    indicator.style.transform = `translateX(${offsetLeft}px)`;
    indicator.style.opacity = '1';
  };

  const clearIndicator = () => {
    if (indicator) indicator.style.opacity = '0';
    navLinkEls.forEach(a => a.classList.remove('active'));
  };

  const setActiveLink = (id) => {
    navLinkEls.forEach(a => {
      if (a.dataset.section === id) {
        a.classList.add('active');
        moveIndicator(a);
      } else {
        a.classList.remove('active');
      }
    });
  };

  // Hover preview — shoot to hovered link, restore on mouse-leave
  navLinkEls.forEach(a => {
    a.addEventListener('mouseenter', () => moveIndicator(a));
    a.addEventListener('mouseleave', () => {
      // Restore to currently active section
      const activeEl = document.querySelector('.nav-links a.active');
      if (activeEl) moveIndicator(activeEl);
      else clearIndicator();
    });
  });

  // IntersectionObserver: active section = middle 40% of viewport
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sectionEls.forEach(el => navObserver.observe(el));

  // Clear when scrolled back to hero top
  window.addEventListener('scroll', () => {
    if (window.scrollY < 100) {
      clearIndicator();
    }
  });

  // Intercept all hash link clicks for custom smooth scroll
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    
    if (href === '#' || href === '#home') {
      e.preventDefault();
      try {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } catch (scrollErr) {
        // Fallback scrollTo for compatibility
        window.scrollTo(0, 0);
        console.warn("Smooth scroll failed, fallback applied:", scrollErr);
      }
      return;
    }

    const targetId = href.substring(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      e.preventDefault();
      try {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      } catch (scrollErr) {
        // Fallback scrollIntoView for compatibility
        try {
          targetEl.scrollIntoView();
        } catch (innerErr) {
          console.error("Scroll to element failed completely:", innerErr);
        }
        console.warn("Smooth scroll failed, fallback applied:", scrollErr);
      }
    }
  });

  // ---------- Booking Form Submission & Supabase Integration ----------
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccessCard = document.getElementById('bookingSuccessCard');
  const contactSubtext = document.getElementById('contactSubtext');
  const submitBookingBtn = document.getElementById('submitBookingBtn');
  const resetBookingBtn = document.getElementById('resetBookingBtn');

  // Custom Segmented Date & Time Pickers Logic
  const dateDay = document.getElementById('dateDay');
  const dateMonth = document.getElementById('dateMonth');
  const dateYear = document.getElementById('dateYear');
  const timeHour = document.getElementById('timeHour');
  const timeMin = document.getElementById('timeMin');
  const timeAmpm = document.getElementById('timeAmpm');
  const pickerDayBadge = document.getElementById('pickerDayBadge');
  const hiddenDateInput = document.getElementById('bookingDate');
  const hiddenTimeInput = document.getElementById('bookingTime');

  let dayVal, monthVal, yearVal, hourVal, minVal, ampmVal;
  let digitBuffer = '';
  let bufferTimeout = null;

  function pad(num, size = 2) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  function getDaysInMonth(m, y) {
    return new Date(y, m, 0).getDate();
  }

  function updateHiddenInputs() {
    const yStr = pad(yearVal, 4);
    const mStr = pad(monthVal, 2);
    const dStr = pad(dayVal, 2);
    if (hiddenDateInput) hiddenDateInput.value = `${yStr}-${mStr}-${dStr}`;

    let h24 = hourVal;
    if (ampmVal === 'PM' && h24 < 12) h24 += 12;
    if (ampmVal === 'AM' && h24 === 12) h24 = 0;
    if (hiddenTimeInput) hiddenTimeInput.value = `${pad(h24, 2)}:${pad(minVal, 2)}`;
  }

  function updatePickerUI() {
    if (dateDay) dateDay.textContent = pad(dayVal, 2);
    if (dateMonth) dateMonth.textContent = pad(monthVal, 2);
    if (dateYear) dateYear.textContent = pad(yearVal, 4);
    if (timeHour) timeHour.textContent = pad(hourVal, 2);
    if (timeMin) timeMin.textContent = pad(minVal, 2);
    if (timeAmpm) timeAmpm.textContent = ampmVal;

    if (pickerDayBadge) {
      const dObj = new Date(yearVal, monthVal - 1, dayVal);
      if (!isNaN(dObj.getTime())) {
        pickerDayBadge.textContent = dObj.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
      }
    }

    updateHiddenInputs();
  }

  function resetPickers() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    dayVal = tomorrow.getDate();
    monthVal = tomorrow.getMonth() + 1;
    yearVal = tomorrow.getFullYear();

    hourVal = 12;
    minVal = 0;
    ampmVal = 'PM';

    updatePickerUI();
  }

  function clearBuffer() {
    digitBuffer = '';
  }

  function handleSegmentKey(e, segment) {
    const type = segment.dataset.type;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      incrementSegment(type, 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      incrementSegment(type, -1);
    } else if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      handleDigitInput(type, e.key);
    } else if (type === 'ampm' && (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'p')) {
      e.preventDefault();
      ampmVal = e.key.toUpperCase() + 'M';
      updatePickerUI();
    }
  }

  function incrementSegment(type, dir) {
    digitBuffer = '';
    if (type === 'day') {
      const maxDays = getDaysInMonth(monthVal, yearVal);
      dayVal += dir;
      if (dayVal > maxDays) dayVal = 1;
      if (dayVal < 1) dayVal = maxDays;
    } else if (type === 'month') {
      monthVal += dir;
      if (monthVal > 12) monthVal = 1;
      if (monthVal < 1) monthVal = 12;
      const maxDays = getDaysInMonth(monthVal, yearVal);
      if (dayVal > maxDays) dayVal = maxDays;
    } else if (type === 'year') {
      yearVal += dir;
      if (yearVal < 2025) yearVal = 2035;
      if (yearVal > 2035) yearVal = 2025;
      const maxDays = getDaysInMonth(monthVal, yearVal);
      if (dayVal > maxDays) dayVal = maxDays;
    } else if (type === 'hour') {
      hourVal += dir;
      if (hourVal > 12) hourVal = 1;
      if (hourVal < 1) hourVal = 12;
    } else if (type === 'minute') {
      minVal += dir;
      if (minVal > 59) minVal = 0;
      if (minVal < 0) minVal = 59;
    } else if (type === 'ampm') {
      ampmVal = ampmVal === 'AM' ? 'PM' : 'AM';
    }
    updatePickerUI();
  }

  function handleDigitInput(type, digit) {
    clearTimeout(bufferTimeout);
    digitBuffer += digit;

    const maxLen = (type === 'year') ? 4 : 2;
    if (digitBuffer.length > maxLen) {
      digitBuffer = digit;
    }

    const val = parseInt(digitBuffer, 10);

    if (type === 'day') {
      const maxDays = getDaysInMonth(monthVal, yearVal);
      if (val >= 1 && val <= maxDays) {
        dayVal = val;
      }
    } else if (type === 'month') {
      if (val >= 1 && val <= 12) {
        monthVal = val;
        const maxDays = getDaysInMonth(monthVal, yearVal);
        if (dayVal > maxDays) dayVal = maxDays;
      }
    } else if (type === 'year') {
      yearVal = val;
      const maxDays = getDaysInMonth(monthVal, yearVal);
      if (dayVal > maxDays) dayVal = maxDays;
    } else if (type === 'hour') {
      if (val >= 1 && val <= 12) {
        hourVal = val;
      }
    } else if (type === 'minute') {
      if (val >= 0 && val <= 59) {
        minVal = val;
      }
    }

    updatePickerUI();
    bufferTimeout = setTimeout(clearBuffer, 1000);
  }

  // Initialize pickers
  resetPickers();

  // Attach interactive events to all picker segments
  document.querySelectorAll('.picker-seg').forEach(seg => {
    seg.addEventListener('keydown', (e) => handleSegmentKey(e, seg));
    seg.addEventListener('click', () => {
      seg.focus();
      clearBuffer();
    });
    seg.addEventListener('focus', () => {
      clearBuffer();
    });
  });

  // Automatic Drag up tease scroll animation
  const pageWrapper = document.getElementById('pageWrapper');
  if (pageWrapper) {
    let bounceInterval = null;

    function triggerBounce() {
      pageWrapper.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      pageWrapper.style.transform = 'translateY(-40px)';
      
      setTimeout(() => {
        pageWrapper.style.transform = 'translateY(0)';
      }, 500);
    }

    // Trigger bounce automatically 1.8 seconds after load if user is still at the top
    setTimeout(() => {
      if (window.scrollY < 50) {
        triggerBounce();
      }
    }, 1800);

    // Setup periodic interval to tease the user every 6 seconds if they stay idle at the top
    bounceInterval = setInterval(() => {
      if (window.scrollY < 50) {
        triggerBounce();
      } else {
        clearInterval(bounceInterval);
      }
    }, 6000);

    // Clear interval on manual scroll to prevent any bouncing when reading
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 50 && bounceInterval) {
        clearInterval(bounceInterval);
        bounceInterval = null;
      }
    });
  }


  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Retrieve form fields
      const name = document.getElementById('bookingName').value.trim();
      const phone = document.getElementById('bookingPhone').value.trim();
      const service = document.getElementById('bookingService').value;
      const date = document.getElementById('bookingDate').value;
      const time = document.getElementById('bookingTime').value;

      // Update button state (loading state)
      const btnText = submitBookingBtn.querySelector('.btn-text');
      const btnSpinner = submitBookingBtn.querySelector('.btn-spinner');
      submitBookingBtn.disabled = true;
      if (btnText) btnText.textContent = "Booking...";
      if (btnSpinner) btnSpinner.classList.remove('hidden');

      try {
        if (supabaseClient) {
          // Push booking to Supabase table 'bookings'
          const { error } = await supabaseClient
            .from('bookings')
            .insert([
              {
                name: name,
                phone: phone,
                service: service,
                booking_date: date,
                booking_time: time
              }
            ]);

          if (error) throw error;
        } else {
          // Fallback demo mode if keys are not configured yet
          console.warn("Supabase is not initialized. Simulating submission database sync...");
          await new Promise(resolve => setTimeout(resolve, 1200)); // simulated latency
        }

        // Show Success Overlay
        document.getElementById('successName').textContent = name;
        document.getElementById('successService').textContent = service;
        document.getElementById('successPhone').textContent = phone;

        // format date cleanly for display
        const dateObj = new Date(date + 'T' + time);
        const formattedDate = isNaN(dateObj.getTime()) 
          ? `${date} at ${time}`
          : dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) + ' at ' + time;
        document.getElementById('successDateTime').textContent = formattedDate;

        // Transition UI states
        bookingForm.classList.add('hidden');
        if (contactSubtext) contactSubtext.classList.add('hidden');
        if (bookingSuccessCard) bookingSuccessCard.classList.remove('hidden');

      } catch (err) {
        console.error("Booking Error:", err);
        alert("There was an error saving your booking. Please try again. " + (err.message || ''));
      } finally {
        // Reset button loading state
        submitBookingBtn.disabled = false;
        if (btnText) btnText.textContent = "Confirm Booking";
        if (btnSpinner) btnSpinner.classList.add('hidden');
      }
    });
  }

  if (resetBookingBtn) {
    resetBookingBtn.addEventListener('click', () => {
      if (bookingForm) {
        bookingForm.reset();
        resetPickers();
        bookingForm.classList.remove('hidden');
      }
      if (contactSubtext) contactSubtext.classList.remove('hidden');
      if (bookingSuccessCard) bookingSuccessCard.classList.add('hidden');
    });
  }

  // Recalculate on resize (link positions change)
  window.addEventListener('resize', () => {
    const activeEl = document.querySelector('.nav-links a.active');
    if (activeEl) moveIndicator(activeEl);
  });

});
