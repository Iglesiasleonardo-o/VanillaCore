# ViewGenCore: The Mechanical Sympathy UI Engine

A minimalist, zero-dependency UI generator designed for **massive scale and tiny bundles**. No Virtual DOM, no reconciliation overhead, and zero "framework tax." 

**Build 50-route applications that load in under 500KB.**

---

## The Philosophy: Mechanical Sympathy
Modern frameworks treat the DOM as a "problem" to be managed through abstraction. **ViewGenCore** treats the DOM as a high-performance engine. By aligning our code with how browsers actually work, we eliminate the middleman.

### 1. The "No-Diff" Advantage
React and Vue spend CPU cycles on "Reconciliation" (comparing a Virtual DOM to the Real DOM). We don't.
* **The Competition:** `State Change` ➔ `VDOM Diff` ➔ `Patch Real DOM`
* **ViewGenCore:** `State Change` ➔ `Direct DOM Mutation`

### 2. Built-in Memory Management
We solve the "Zombie Listener" problem by utilizing **DOM Level 0** event properties (`onclick`) and shared function references.
* **Automatic Garbage Collection:** When an element is removed from the DOM, the browser automatically purges its handlers. No `useEffect` cleanup required.
* **Shared Reference:** Every element created uses the same `Append` reference in memory, rather than creating thousands of unique closures.

### 3. Dual-Path Execution
We separate **Layout** from **Styling** to ensure your "hot paths" (like 10,000-row tables) remain blazing fast.
* **Component:** Blazing fast. Uses `Object.assign` for direct property mapping.
* **RichComponent:** Flexible. Handles complex nested objects like `style` and `dataset`.

---

## Usage: View Generators

In **ViewGenCore**, we don't write "Components", we write **View Generators**.

### Standard UI Generation
Events like `onclick` are passed directly as parameters. This keeps your view logic pure and allows the browser to handle memory cleanup automatically.

```
import { div, h1, p, button } from './viewgencore.js';

/**
 * @param {Function} onButtonClick - Event handler passed from the controller
 */
export const createDashboardView = (onButtonClick) => {
    return div({ className: 'container' })
        .Append(
            h1({ textContent: 'Performance Metrics' }),
            p({ textContent: 'Direct DOM manipulation is active.' }),
            button({ 
                className: 'btn-primary', 
                onclick: onButtonClick 
            }).Append('Refresh Data')
        );
};
```

# High-Density Data Views
For large-scale applications, use specialized generators for repeating elements to maintain a low memory ceiling and high frame rates.

```
import { tr, td, button } from './viewgencore.js';

export const createUserRowView = (user, onDelete) => {
    return tr({ className: 'user-row' })
        .Append(
            td({ textContent: user.id }),
            td({ textContent: user.email }),
            td({ className: 'actions' }).Append(
                button({ 
                    onclick: () => onDelete(user.id),
                    textContent: 'Delete' 
                })
            )
        );
};
```

## Framework Comparison

| Feature | Modern Frameworks (React/Vue) | ViewGen-Core |
| :--- | :--- | :--- |
| **Bundle Size (50 Routes)** | 2MB - 10MB+ | **< 500KB** |
| **Compilation Time** | 2s - 30s+ (Wait for Build) | **0s (Native Refresh)** |
| **Developer Velocity** | Slowed by Tooling/Transpilation | **Instant (Save & See)** |
| **Rendering Strategy** | Virtual DOM (Heavy) | **Direct DOM (Fast)** |
| **Event Management** | `addEventListener` (Manual) | **DOM Level 0 (Auto-GC)** |
| **Dependencies** | 1,000+ npm packages | **Zero** |
| **Time to Interactive** | Delayed by JS Parsing | **Near-Instant** |
| **Build Step** | Required (Babel/Vite/Bundlers) | **None (Native JS Modules)** |