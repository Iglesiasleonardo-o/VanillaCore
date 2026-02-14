# VanillaCore

A zero-dependency architecture for high-performance SPAs. VanillaCore proves that modern ES6+ features and a logic-centric pattern make bloated frameworks obsolete. No build tools, no npm-fatigue, just pure, documentable JavaScript.

## Sandbox & Implementation
To see the architecture in action, including the Node.js server implementation:

1. **Clone:** `git clone https://github.com/Iglesiasleonardo-o/VanillaCore.git`
2. **Install:** `npm install` (Only for the Node.js server example).
3. **Run:** `npm start`

> **Note:** The core architecture itself requires zero dependencies; the sandbox is provided for full-stack demonstration.

## Performance at a Glance
| Feature | VanillaCore | Standard Frameworks |
| :--- | :--- | :--- |
| **Dependencies** | 0 | 1,000+ |
| **Build Step** | None | Webpack/Vite/Babel |
| **Bundle Size** | 5kB | 500KB - 2MB+ |
| **Security** | XSS-Safe Objects | String-based / Virtual DOM |

## The Manifesto: The Framework-Free Web

* **Performance Over Bloat:** We prioritize execution speed. A 500KB Vanilla project can serve millions of users more efficiently than a 5MB framework bundle.
* **Low Cognitive Load:** The "Signpost" structure ensures that even with 100+ modules, the mental map remains flat and navigable.
* **Contextual Isolation:** Logic is rarely shared permanently. Each view owns its behaviors to avoid the "Tangled Web" of global dependencies.
* **Signpost Naming:** No more searching through ten folders for one feature. Everything is grouped in "Parts" (e.g., `quotations.js` lives inside the `/quotations` folder).

## The Core Lifecycle

VanillaCore follows a reactive, human-readable cycle. We avoid **"Fat Managers"** by ensuring each layer has a single responsibility:

1. **Logic (L):** The "Brain." Home of the **Data State**.
   * **data-state.js:** The local source of truth (the data that usually needs to be sent to the database).
   * **math.js:** Pure business calculations.
   * **network.js:** API communication and data fetching.
2. **Events (E):** The "Senses." Slim listeners that trigger Logic and manage the **View State**, temporary UI data like spinners, search queries, or toggles.
3. **ViewGen (V):** The "Factory." Pure functions that construct UI elements as 100% safe DOM nodes.
4. **Render (R):** The "Diplomat." It is "dumb" and state-free. It speaks to the DOM, placing what ViewGen built exactly where it belongs.

[Image of a software architecture diagram showing the separation of persistent data state and transient view state within a reactive loop]

## The Component Architecture

In `shared/components.js`, we define the DNA of the app. By using a nested Append structure, we build complex interfaces that look like HTML but are real DOM nodes:

```javascript
div({id:"container"}).Append(
  div({className:"row"}).Append(
    div({className:"cell"}).Append(
      paragraph({textContent:"Inventory Item"}),
      div({className:"red", textContent:"Item inside item"})
    )
  )
)
```
The Resulting DOM (The Output)
```
<div id="container">
  <div class="row">
    <div class="cell">
      <p>Inventory Item</p>
      <div class="red">Item inside item</div>
    </div>
  </div>
</div>
```

## Directory Structure
This structure keeps architectural logic separate from business routes, ensuring that even as the project grows to hundreds of modules, the *Cognitive Load* remains near zero. To avoid collisions with URL routes named "parts", internal architectural folders are prefixed with an underscore `(_parts).`

```
/src
├── /shared                 # Universal UI DNA (div, paragraph, button types)
│   └── components.js
├── /quotations             # Feature Module (URL: /quotation)
│   ├── /_parts             # Internal Arch: Events, Logic, Render, ViewGen
│   │   ├── quotations.js   # The Signpost: Joins the sequence
│   │   ├── /events         # Slim listeners & View State
│   │   ├── /logic          # The Brain
│   │   │   ├── data-state.js # Persistent Data (The Truth)
│   │   │   ├── math.js     # Pure business logic
│   │   │   └── network.js  # API/Fetch calls
│   │   ├── /render         # DOM placement (The "Dumb" Painter)
│   │   └── /viewgen        # Interface construction
│   └── /parts              # Sub-Route Module (URL: /quotation/parts)
│       └── ...             # Follows the same internal _parts structure
├── router.js               # The Map
└── app.js                  # The Engine
```

## Proven in Production
Originally developed to meet Mozambican business realities (handling local taxes like IVA and MZN currency), the logic is universal and scalable worldwide.

* **Dynamic Inventory:** Real-time search and stock validation.
* **Complex Calculations:** Line-item totals and tax processing in pure JS.
* **Veritas Sync:** Distinguishes between Persistent Data and Temporary View State.

As your business grows, you simply add new modules. The architecture is designed to scale from a simple quote tool to a full ERP without changing the core DNA.



## Dealing with Complexity
To avoid **"Fat Managers,"** we distinguish between what the business needs and what the browser needs:

1.  **Data State:** Persistent business data that usually needs to be sent to the database (e.g., the items array). It lives in `data-state.js`.
2.  **View State:** Temporary visual info (e.g., `isLoading`, `_debounceTimer`). It lives in **Events** because it is disposable and only matters for the current interaction.



## Documentation: The "Signpost" Method
We don't believe in external manuals that get outdated. We document at the point of action:

* **Level 1 (The Map):** This main README explains the global philosophy.
* **Level 2 (The Manuals):** Internal `README.md` files in each folder explaining local rules (e.g., why Logic must be pure).
* **Level 3 (The Code):** Self-describing functions like `calculateTotalsWithTax()` ensure the code explains itself.



## Security & Reliability
By avoiding `innerHTML` and using a nested Append pattern, we ensure the app is immune to XSS attacks while maintaining maximum rendering performance. Every element is treated as a real object, not a string of text.

## License
This project is licensed under the MIT License.

## Contact
If you have questions, want to collaborate, or are interested in custom engineering solutions, you can reach me here:

* **GitHub:** [@Iglesiasleonardo-o](https://github.com/Iglesiasleonardo-o)
* **Email:** iglesiasleonardo@outlook.com
* **LinkedIn:** https://www.linkedin.com/in/iglesiasleonardo/
