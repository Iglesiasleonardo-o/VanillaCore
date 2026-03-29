# VanillaCore

**A zero-dependency architecture for high-performance SPAs.**
VanillaCore proves that modern ES6+ features and a logic-centric pattern make bloated frameworks obsolete. No build tools, no npm-fatigue, just pure, documentable JavaScript.

## Getting Started: No Install Required
The **VanillaCore** architecture requires **no installation**. You can explore the core logic, documentation, and implementation examples directly by browsing the repository's public routes:
* **Core Logic:** Check `public/js/shared/README.md` for the ViewGenCore documentation, including how it functions and various usage examples.
* **Real-World Implementation:** See `public/js/quotations/quotation/parts/header/header-viewgen.js` to see a practical application of the ViewGenCore in action.

Full-Stack Sandbox (Optional):
1. `git clone https://github.com/Iglesiasleonardo-o/VanillaCore.git`
2. `npm install` (Only for the Node.js server example).
3. `npm start`

> **Note:** The core architecture itself requires zero dependencies; the sandbox is provided for full-stack demonstration.

## Performance at a Glance
| Feature | VanillaCore Standard | Standard Frameworks |
| :--- | :--- | :--- |
| **Dependencies** | 0 | 1,000+ |
| **Core Implementation** | ~5kB - 10kB | 150kB - 500kB+ |
| **50-Route Scale** | < 500kB Total | 5MB - 10MB+ |
| **State Tracking** | Native DOM | Virtual DOM / Proxy Observers |
| **Build/Compile Time** | 0s (Native Refresh) | 2s - 30s+ (Wait for Build) |
| **Rendering Strategy** | Direct DOM | Heavy Reconciliation (Diffing) |
| **Memory Management** | Auto-GC (DOM Level 0) | Manual Hooks/Cleanup Required |

## The Manifesto: The Framework-Free Web

* **Performance Over Bloat:** We prioritize execution speed. A 500KB Vanilla project can serve millions of users more efficiently than a 5MB framework bundle.
* **Low Cognitive Load:** The "Signpost" structure ensures that even with 100+ modules, the mental map remains flat and navigable.
* **Contextual Isolation:** Each view owns its behaviors. We avoid the "Tangled Web" of global dependencies.
* **Signpost Naming:** No more searching through ten folders for one feature. Everything is grouped in "Parts" (e.g., `quotations.js` lives inside the `/quotations` folder).

## The Core Lifecycle
VanillaCore follows a reactive, human-readable cycle without the "Fat Manager" overhead:

1. **Network:** The "Messenger." The starting point. It fetches the raw "Truth" (Data Object) from the server or prepares it to be sent back.
2. **Math:** The "Calculator." Processes the raw data. It performs pure business logic-like calculating IVA (tax) or totals.
3. **ViewModel:** The "Translator." A pure mapping layer. It takes the calculated data and translates it into "human-readable" strings (e.g., converting 2026-02-17 to 17/02/2026 or adding currency symbols).
4. **ViewGen:** The "Factory." Takes the translated strings from the VM and manufactures 100% safe, real DOM nodes. It doesn't know why a label says "Paid"; it just builds the tag.
5. **Render:** The "Diplomat." The final orchestrator. It is state-free and "dumb." It calls the previous steps in order and places the finished UI nodes into the document, while also managing the page lifecycle (navigation and cleanup).

## Core Framework
* **vanilla-router.js:** The URL matching engine. It parses the browser pathname and handles dynamic parameters (e.g., :id).
* **vanilla-render.js:** The central Lifecycle Manager. It handles the onpopstate (navigation), clears the main-wrapper, and provides the RenderView utility to inject new modules.
* **vanilla-viewgen.js:** Defines the application's global structural DNA (the Sidebar, Header, and Main Content containers).
* **vanilla-routes.js:** The central mapping file that directs specific URL paths to their corresponding Module Renders.
* **vanilla-global-state.js:** An optional repository for truly global, read-only data (like Company Info or User Permissions) that persists across all modules.

[Image of a software architecture diagram showing the separation of persistent data state and transient view state within a reactive loop]

## ViewGenCore: The Mechanical Sympathy Engine
In `shared/viewgencore.js`, we utilize the ViewGenCore pattern to build complex interfaces using a nested `.Append()` structure. These are *real DOM nodes*, not strings, ensuring maximum performance and native security.

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
The Resulting DOM (Native Output)
```html
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
├── /shared                # Universal UI DNA (viewgencore.js)
├── /quotations            # Feature Module (URL: /quotation)
│   ├── /_parts            # Internal Signpost (Flat Architecture)
│   │   ├── viewmodel.js   # Data translation
│   │   ├── viewgen.js     # UI construction
│   │   ├── render.js      # DOM coordination
│   │   ├── math.js        # Pure calculations
│   │   └── network.js     # API/Fetch calls
│   └── /parts             # Sub-Modules (URL: /quotation/parts/items)
│       └── /items         # (Follows the same flat internal structure)
├── router.js              # The Map
└── app.js                 # The Engine
```

## Proven in Production
Originally developed to meet Mozambican business realities (handling local taxes like IVA and MZN currency), the logic is universal and scalable worldwide.

* **Dynamic Inventory:** Real-time search and stock validation.
* **Complex Calculations:** Line-item totals and tax processing in pure JS.
* **Veritas Sync:** Distinguishes between Persistent Data and Temporary View State.

As your business grows, you simply add new modules. The architecture is designed to scale from a simple quote tool to a full ERP without changing the core DNA.



## Dealing with Complexity
We distinguish between the **Truth** and the **Live Tracker**:
1.  **The Truth (Data Object):** The persistent business data that gets sent to the server. It is updated only when an action is "Confirmed."
2.  **The Live Tracker (The DOM):** We use the DOM to track transient user changes (typing in an input, checking a box). We do not mirror these changes in a JS state object. We read the "Live Tracker" only when the user is ready to update "The Truth."


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
