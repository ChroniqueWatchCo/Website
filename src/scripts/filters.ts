  // Tiny progressive-enhancement filter/sort (<=2 KB gz). Without JS all cards show.
  const root = document.querySelector('[data-filters]');
  if (root) {
    const grid = document.getElementById('product-grid') as HTMLUListElement | null;
    const emptyMsg = document.querySelector('.filtered-empty') as HTMLElement | null;
    const countEl = document.querySelector('[data-count]') as HTMLElement | null;
    const clearBtn = root.querySelector('[data-clear]') as HTMLButtonElement | null;
    const sortSel = root.querySelector('[data-sort]') as HTMLSelectElement | null;
    if (grid) {
      const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-card]'));
      const total = cards.length;
      const active = new Map<string, string>();

      const apply = () => {
        let visible = 0;
        for (const c of cards) {
          let show = true;
          active.forEach((val, key) => {
            if (key === 'stock') { if (c.dataset.stock !== val) show = false; }
            else if (c.dataset[key] !== val) show = false;
          });
          c.hidden = !show;
          if (show) visible++;
        }
        if (emptyMsg) emptyMsg.hidden = visible !== 0;
        if (countEl) countEl.textContent = `${visible} ${visible === 1 ? 'watch' : 'watches'}`;
        if (clearBtn) clearBtn.hidden = active.size === 0;
      };

      root.querySelectorAll<HTMLButtonElement>('.chip[data-filter]').forEach((btn) => {
        btn.setAttribute('aria-pressed', 'false');
        btn.addEventListener('click', () => {
          const key = btn.dataset.filter!;
          const val = btn.dataset.value!;
          if (active.get(key) === val) {
            active.delete(key);
            btn.setAttribute('aria-pressed', 'false');
          } else {
            root.querySelectorAll<HTMLButtonElement>(`.chip[data-filter="${key}"]`).forEach((b) => b.setAttribute('aria-pressed', 'false'));
            active.set(key, val);
            btn.setAttribute('aria-pressed', 'true');
          }
          requestAnimationFrame(apply);
        }, { passive: true });
      });

      clearBtn?.addEventListener('click', () => {
        active.clear();
        root.querySelectorAll<HTMLButtonElement>('.chip[data-filter]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
        requestAnimationFrame(apply);
      }, { passive: true });

      sortSel?.addEventListener('change', () => {
        const mode = sortSel.value;
        requestAnimationFrame(() => {
          const sorted = [...cards].sort((a, b) => {
            if (mode === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
            if (mode === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
            return (b.dataset.created ?? '').localeCompare(a.dataset.created ?? '');
          });
          const frag = document.createDocumentFragment();
          for (const c of sorted) frag.appendChild(c);
          grid.appendChild(frag);
        });
      }, { passive: true });
    }
  }
