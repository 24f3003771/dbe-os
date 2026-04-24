# Module 1: Introduction to Web Development

## 1.0 Welcome to the Module
*   **Purpose:** This module serves as the theoretical foundation for web development, covering how the internet connects devices and how websites are delivered.
*   **Scope:** Includes the role of browsers, core technologies (HTML, CSS, JavaScript), server communication, and the evolution of digital business.
*   **Learning Strategy:** 
    *   Focus on understanding how elements work together rather than memorization.
    *   Do not write code while watching videos; watch first, then practice independently.
    *   **Troubleshooting:** Solving problems independently is a core skill for developers.

## 1.1 What is Internet and a Website
*   **Definition of Internet:** At its core, the internet is a **massive network of wires and connections** (a global web of wires) connecting millions of computers worldwide.
*   **Physical Infrastructure:** 
    *   Data travels across oceans and continents via **massive underwater submarine cables** laid on the ocean floor.
    *   Signals travel through these cables at the **speed of light**, allowing content to load in milliseconds.
*   **Website:** A collection of files (HTML, CSS, JS) stored on a server that is accessed via the internet.

## 1.2 Web Browser, DNS, Hosting, and Servers
#### Key Components of Web Access
*   **Server:** A specialized computer that is **always connected** to the internet. It stores and sends information (e.g., videos, images, web pages) to users.
*   **Client:** The user's device (phone, tablet, or laptop) that requests data from the server.
*   **IP Address:** A **unique address** assigned to every device connected to the internet (e.g., `132.431.53.134`). It acts like a "home address" for computers.
*   **ISP (Internet Service Provider):** Companies (e.g., Jio, Airtel, BSNL) that connect your browser to the rest of the internet.
*   **DNS (Domain Name System):** 
    *   Known as the **"Internet's Phone Book."**
    *   It translates human-readable **Domain Names** (e.g., `youtube.com`) into machine-readable **IP Addresses**.
*   **Web Browser:** An application (e.g., Chrome, Safari, Edge, Firefox) used to request, receive, and display web pages by "stitching together" various files from a server.

## 1.3 Role of HTML, CSS, and JavaScript
These three technologies form the core building blocks of every webpage.

| Technology | Full Name | Primary Role | Analogy | Key Features |
| :--- | :--- | :--- | :--- | :--- |
| **HTML** | Hypertext Markup Language | **Structure** | Skeleton | Headings, paragraphs, lists, sections, and titles. |
| **CSS** | Cascading Style Sheets | **Style** | Clothing/Skin | Colors, fonts, positioning, backgrounds, and animations. |
| **JavaScript** | JavaScript | **Interactivity** | Brain/Muscles | Logic, "if-this-then-that," calculations, and pop-ups. |

*   **HTML:** Provides the rudimentary outline and foundation.
*   **CSS:** Transforms plain text into a visually appealing layout.
*   **JavaScript:** Adds dynamic features such as shopping cart updates, image sliders, and interactive navigation.

## 1.4 Request-Response Cycles & HTTP Requests
*   **The Process:** 
    1.  User types a URL in the browser.
    2.  Browser sends an **HTTP Request** to the server.
    3.  Server processes the request and sends back an **HTTP Response** containing files (HTML, CSS, JS).
    4.  Browser interprets these files and renders the website.
*   **HTTP (Hypertext Transfer Protocol):** The standard "grammar" or set of rules that allows browsers and servers to communicate effectively regardless of the device or network.
*   **Common Protocols:**
    *   **HTTPS:** The secure version of HTTP.
    *   **FTP (File Transfer Protocol):** Used for transferring files.
    *   **SMTP (Simple Mail Transfer Protocol):** Used for sending emails.

## 1.5 Frontend and Backend
Web development is divided into two distinct sides:

#### 1.5.1 Frontend (The User-Facing Side)
*   Everything a user sees and interacts with in the browser.
*   **Elements:** Layouts, colors, fonts, buttons, and images.
*   **Technologies:** HTML, CSS, and JavaScript.
*   **Focus:** User Interface (UI) and User Experience (UX).

#### 1.5.2 Backend (Behind the Scenes)
*   Responsible for data storage, processing, and management.
*   **Tasks:** Handling user logins, database retrieval, and processing transactions.
*   **Technologies:** Python, Java, Ruby, or Node.js.
*   **Use Case:** Required for "heavy" applications like Netflix, Amazon, or social media platforms that need personalized data and authentication.

## 1.6 Impact of Internet and digital business since 1990s
*   **Early 1990s:** **Tim Berners Lee** invented HTTP and HTML, creating the World Wide Web. Early sites were static and text-based.
*   **Dot-com Boom (Late 1990s):** Rapid growth of internet businesses (e.g., Netscape).
*   **Dot-com Bubble Burst (2000):** Market crash where companies without real substance disappeared. Survivors like **Google** and **Amazon** thrived by offering real value.
*   **India's Digital Evolution:**
    *   **2000s:** Growth of Rediff, Naukri, MakeMyTrip, and Flipkart (2007).
    *   **2010s (Mobile Era):** Launch of iPhone (2007) and later **Reliance Jio (2016)**, which provided affordable data and skyrocketed internet access.
    *   **Fintech Revolution:** Launch of **UPI (Unified Payment Interface)** in 2016 transformed India into a leader in digital payments (PhonePe, GooglePay).
*   **Modern Era:** Transition to **Cloud Computing** (AWS, Azure) allowed startups like Swiggy and Zomato to scale without physical servers. Big Data and 30+ years of internet data now fuel **AI systems**.

## Quick Revision Summary
*   **Key Definitions:**
    *   **Internet:** A global network of connected computers.
    *   **DNS:** Translates URLs to IP Addresses.
    *   **HTTP:** The protocol used for browser-server communication.
    *   **Frontend:** The "client-side" (what you see).
    *   **Backend:** The "server-side" (logic and data).
*   **Must-Remember Points:**
    *   HTML = Structure, CSS = Presentation, JavaScript = Behavior.
    *   Browsers do not see names; they see **IP Addresses** provided by the DNS.
    *   **Tim Berners Lee** is the creator of the World Wide Web (HTML/HTTP).
    *   The **2016 Jio launch and UPI** were turning points for India's digital economy.

# Module 2: Business, Design and Product Perspectives for Web Development

## 2.1 Introduction
*   **Core Focus:** Transitioning from technical basics (HTML/CSS) to the **business, product, and design strategy** required before building a website.
*   **Goal:** Aligning technical decisions with clear business outcomes to ensure the website is functional, impactful, and user-oriented.

## 2.2 Identifying Business Objectives
*   **Definition:** The core purpose of a website that guides decisions regarding content, design, and user experience.
*   **Consequence of No Objectives:** A website without a purpose is like a "store without signs," leading to user confusion and frustration.

#### Primary Website Types & Objectives
| Website Type | Primary Goal | Focus Areas | Example |
| :--- | :--- | :--- | :--- |
| **Informational** | Inform and engage | Organized content, readability, typography. | TechCrunch |
| **E-commerce** | Drive sales | Vibrant design, product reviews, checkout flow. | Nykaa, Flipkart |
| **Lead Generating** | Capture user data | Prominent sign-up forms, bold CTAs. | Insurance/SaaS sites |

## 2.3 Product Management Principles
*   **First Principles:** Always ask: *Why is this website needed?* and *What do we want to achieve?*
*   **User Journeys:** Mapping the path a user takes to reach a goal (e.g., Landing page → Search → Product page → Cart → Payment).
*   **Friction:** Design should aim to have **minimal friction** to prevent users from dropping out of the journey.
*   **Feature Prioritization:** Not all features are equal. Prioritize those with high **ROI (Return on Investment)**.
    *   *High Priority:* "Buy Now" buttons, Lead forms.
    *   *Low Priority:* Social media sharing (depending on the business model).
*   **Testing & Iteration:** Use **A/B Testing** and tools like **Google Analytics** to analyze user behavior and improve the site continuously.

## 2.4 Color Theory
*   **Color Psychology:** The study of how colors influence emotions, behaviors, and decision-making.
*   **Contrast:** High contrast grabs attention (e.g., Netflix's Red/Black); subtle tones promote relaxation (e.g., wellness sites).

#### Color Associations
*   **Red:** Urgency, excitement, danger. Used for sales and "Stop" signs.
*   **Blue:** Trust, reliability, calmness. Dominant in banking (PayPal, Razorpay) and healthcare.
*   **Green:** Nature, growth, health, freshness. Used by grocery brands and for "Success" signals.
*   **Yellow:** Creativity, happiness, energy. Attention-grabbing (e.g., Mokobara).
*   **White:** Simplicity, clarity, sophistication (e.g., Apple).
*   **Black:** Formality, luxury, security.
*   **Brown:** Ruggedness, dependability, nature.

#### Design Tools
*   **Color Hunt:** For curated, modern color palettes.
*   **Adobe Color:** To create triadic or complementary color schemes.
*   **Coolors.co:** A generator to visualize how different color combinations look together.

## 2.5 Typography
*   **Core Pillars:**
    1.  **Legibility:** How easy it is to distinguish individual letters (e.g., Roboto distinguishes '0' from 'O').
    2.  **Readability:** How easily a reader engages with the text as a whole (influenced by spacing and size).

#### Font Families
*   **Serif:** Fonts with "little feet" (e.g., Times New Roman). Convey **tradition, authority, and luxury**. Best for print and academic journals.
*   **Sans Serif:** Fonts without "feet" (e.g., Arial, Helvetica). Convey **modernity, cleanliness, and friendliness**. Preferred for digital screens.
*   **Script/Display:** Cursive or bold decorative fonts. Use **sparingly** for headings or invitations; never for long paragraphs.

#### Typography Rules
*   **Word Superiority Effect:** Our brains recognize entire words faster than letters. **Lowercase** is generally easier to read than **ALL CAPS**.
*   **Line Length:** Ideal readability is between $40$ to $60$ characters per line.
*   **Visual Hierarchy:** Use varying sizes (e.g., Title: 46px, Subheading: 24px, Body: 16px).

## 2.6 Call to Action (CTA)
*   **Definition:** A trigger designed to guide users toward a specific goal.
*   **Signposts:** CTAs act as signs directing the user's journey.
*   **Types:** 
    *   **Lead Generation:** "Sign Up," "Give us your email."
    *   **Purchase:** "Add to Cart," "Buy Now."
    *   **Educational:** "Learn More," "No More" (Kia example).
*   **Best Practices:**
    *   **Action-Oriented Language:** Use verbs like "Download," "Get Started."
    *   **Visual Prominence:** Large size, high contrast, and plenty of **white space**.
    *   **Sticky CTAs:** Buttons that stay visible even as the user scrolls.

## 2.7 User Interface (UI)
*   **Visual Hierarchy:** The principle that determines the order in which information is processed. Eyes gravitate to the **biggest, boldest, and brightest** elements first.
*   **Scanning Patterns:**
    1.  **F-Pattern:** Users scan from top-left to right, then down. Best for text-heavy sites.
    2.  **Z-Pattern:** Users scan in a 'Z' shape. Best for landing pages with visuals.
*   **Alignment:** Reducing the number of alignment points creates a "polished" look. Use a single axis (center or left).
*   **White Space (Negative Space):** Not "empty" space; it lets the design breathe. More white space = **Premium/Sophisticated feel** (e.g., Apple).

## 2.8 Software Installation & Design Tools
*   **Google Fonts:** Free resource for a wide variety of web-safe fonts.
*   **Browser Inspection:** Tools to evaluate color contrast for accessibility.
*   **Grid Lines:** Used during the planning phase to ensure items align professionally.

## 2.9 Example - Assignment: Website Analysis
*   **Objective:** Analyze a small business website to identify strengths and weaknesses.
*   **Evaluation Criteria:**
    *   **Business Goal:** Is the purpose clear?
    *   **User Flow:** Is the journey intuitive?
    *   **Design Elements:** Do the colors and typography match the brand?
    *   **CTA Effectiveness:** Are they prominent and action-oriented?

## 2.11 Key Takeaways
- **Design with Purpose:** Every layout choice should guide user actions.
- **Prioritization:** Focus on features that drive revenue or leads.
- **Hierarchy:** Use size, color, and white space to direct the user's eye.
- **Responsiveness:** Designs must adapt to both mobile (touch-friendly, larger buttons) and desktop (precision clicking, detailed layouts).

## Quick Revision Summary
- **Key Definitions:**
    - **Visual Hierarchy:** Order of importance created by design.
    - **Friction:** Anything that prevents a user from completing a task.
    - **Sans Serif:** The standard font family for web/digital screens.
- **Important Rules:**
    - **Line Length:** $40-60$ characters for optimal reading.
    - **F vs Z Patterns:** F is for reading; Z is for scanning.
- **Must-remember points:**
    - Blue = Trust (Finance); Red = Urgency (Sales).
    - White space prevents clutter and creates a "premium" brand image.
    - Sticky CTAs increase conversion by remaining accessible during scroll.

# Module 3: HTML Basics and Building Webpages

## 3.1 Introduction to HTML
*   **HyperText Markup Language (HTML):** The foundation of web development. It defines the content and structure of a webpage.
*   **Hypertext:** Text that links to other resources or pages.
*   **Markup:** Providing additional information on how content should be rendered using tags (similar to using symbols in apps to make text bold).
*   **History:** The first website was created by **Tim Berners-Lee** in 1991 using HTML.
*   **Core Role:** While CSS (style) and JavaScript (interactivity) enhance a site, a functional website can be built using **HTML alone**.

## 3.2 HTML Elements
*   **Element Structure:** Consists of an **opening tag**, **content**, and a **closing tag**.
    *   Format: `<tagname> Content </tagname>`
*   **Closing Tags:** Indicated by a forward slash `/` before the tag name.
*   **Headings:** Used to structure information like book chapters.
    *   There are six levels: `<h1>` (most important/largest) to `<h6>` (least important/smallest).
    *   **Rule:** Never skip heading levels (e.g., do not jump from `<h1>` to `<h3>`) to maintain SEO and visual hierarchy.

## 3.3 HTML Structure
Every standard HTML5 document requires a specific "Boilerplate" structure to function correctly across browsers.

#### Key Structure Components
| Tag | Purpose |
| :--- | :--- |
| `<!DOCTYPE html>` | Declares the document is running **HTML5**. |
| `<html>` | The **root element** of the entire document. Usually includes the `lang="en"` attribute. |
| `<head>` | Contains **metadata** (not visible to users) like character set (`UTF-8`), viewport settings, and the title. |
| `<title>` | Defines the text shown on the browser tab. |
| `<body>` | Contains all **visible content** (text, images, links). |

## 3.4 Indent
*   **Definition:** The spaces used at the beginning of a line to show hierarchy.
*   **Nesting:** A child element exists within a parent element and is indented one level deeper.
*   **Purpose:**
    *   **Readability:** Makes code easy to understand at a glance.
    *   **Debugging:** Helps spot unclosed tags quickly.
    *   **Collaboration:** Ensures different teams can read each other's code.
*   **Tools:** Extensions like **Prettier** can autogenerate correct indentation. Standard practice is often **4 spaces** per tab.

## 3.5 Paragraph Tag
*   **Tag:** `<p>`
*   **Function:** Used to organize text into blocks. Without it, the browser ignores line breaks in the code and runs all text together.
*   **Accessibility:** Helps screen readers identify the start and end of text segments for visually impaired users.
*   **Placeholder Text:** Developers use `lipsum.com` (Lorem Ipsum) to generate sample text for layout testing.

## 3.6 Closing tag and Void Tags
*   **Regular Tags:** Require both opening and closing tags (e.g., `<p></p>`, `<h1></h1>`).
*   **Void Tags (Self-Closing):** Tags that do not contain text content and **do not** require a closing tag.
    *   `<br>`: Insert a single line break (useful for addresses or poetry).
    *   `<hr>`: Insert a horizontal rule (line) to visually separate content.
    *   `<img>`: For images.
    *   `<input>`: For form fields.
*   **Formatting:** Modern HTML does not require a trailing slash (e.g., `<br />`), but it is often used for developer consistency.

## 3.7 Ordered and Unordered list
#### List Types
1.  **Unordered List (`<ul>`):** Used when the order of items does not matter. Renders with **bullet points**.
2.  **Ordered List (`<ol>`):** Used when items must follow a specific sequence (e.g., directions). Renders with **numbers**.
3.  **List Item (`<li>`):** The tag used for each entry inside a `<ul>` or `<ol>`.

*   **Nesting Lists:** You can place a list inside an `<li>` to create sub-points. This establishes a parent-child relationship between the items.

## 3.9 Anchor Tag
*   **Tag:** `<a>`
*   **Purpose:** Creates hyperlinks for navigation.
*   **Primary Attribute:** `href` (Hyperlink Reference). It specifies the destination URL.
    *   Example: `<a href="https://iimb.ac.in">Visit IIMB</a>`
*   **Behavior:** By default, links appear blue and underlined.
*   **Scope:** An anchor tag can wrap text, images, or even entire list items to make them clickable.

## 3.10 Image Tag
*   **Tag:** `<img>` (Void element).
*   **Required Attributes:**
    *   `src` (Source): The URL or file path of the image.
    *   `alt` (Alternate Text): A text description for screen readers or if the image fails to load. Crucial for **SEO**.
*   **Optional Attributes:** `height` and `width` (measured in pixels).
*   **Format:** **WebP** is recommended over GIF or JPG as it produces smaller file sizes while maintaining quality, leading to faster load times.

## 3.11 HTML Comments
*   **Syntax:** `<!-- Your comment here -->`
*   **Function:** Notes or reminders within the code that are **not rendered** by the browser.
*   **Use Cases:**
    *   Documenting tricky code sections.
    *   Temporarily disabling code during debugging.
    *   Leaving feedback for collaborators.
*   **Shortcut:** In VS Code, use `Ctrl + /` (Windows) or `Cmd + /` (Mac).

## 3.12 Inline vs Block Elements
HTML elements are categorized based on how they occupy space in the layout.

| Category | Behavior | Examples |
| :--- | :--- | :--- |
| **Block Elements** | Take up the **full width** available. Always start on a new line. | `<h1>`, `<p>`, `<div>`, `<hr>`, `<ol>`, `<ul>` |
| **Inline Elements** | Take up only the **necessary space**. Do not start on a new line. | `<span>`, `<a>`, `<img>` |

*   **Generic Elements:**
    *   `<div>`: A generic **block** container for grouping elements.
    *   `<span>`: A generic **inline** container for styling specific parts of a text.

## 3.13 Forms
*   **Tag:** `<form>`
*   **Core Attribute:** `action`. Specifies the URL/endpoint where the form data should be sent (e.g., a backend server or Google Sheet).
*   **Elements:** Forms contain inputs, labels, and buttons to facilitate user interaction (login, registration, search).

## 3.14 Buttons
*   **Tag:** `<button>`
*   **Types:**
    *   `type="submit"`: Default behavior inside a form. Sends the data to the `action` URL.
    *   `type="button"`: No default behavior. Primarily used with JavaScript for custom actions.
*   **Location:** Buttons outside a form do not submit data unless linked via script.

## 3.15 Submit and Names
*   **The `name` Attribute:** Acts as a **label** for the data.
*   **Data Handling:** When a form is submitted, data is sent as **Key-Value Pairs** in the URL.
    *   *Example:* If an input has `name="username"` and the user types "John", the URL will show `?username=John`.
*   **Requirement:** Without a `name` attribute, the data in that input field will **not** be sent to the server.

## 3.16 Forms Example (Input Types & Validation)
#### Common Input Types
*   `type="text"`: Standard text field.
*   `type="email"`: Automatically validates that the input contains an `@` symbol.
*   `type="number"`: Restricts input to numeric values and adds increment/decrement arrows.
*   `type="color"`: Opens a color picker.
*   `type="checkbox"`: For "Yes/No" or "Agree to terms" selections.
*   `type="radio"`: For selecting one option from a group. **Rule:** All radio buttons in a group must share the **same `name` attribute** to allow only one selection.

#### HTML5 Form Validation Attributes
*   `required`: Prevents form submission if the field is empty.
*   `minlength` / `maxlength`: Enforces character limits (e.g., names between $2$ and $12$ characters).
*   `value`: Specifies the data sent to the server (crucial for radio buttons and checkboxes).

## 3.17 Tables
*   **Purpose:** To display structured tabular data in rows and columns.
*   **Basic Tags:**
    *   `<table>`: The container.
    *   `<tr>` (Table Row): Groups a single row of cells.
    *   `<td>` (Table Data): A standard data cell.
    *   `<th>` (Table Header): A header cell (rendered bold and centered by default).
*   **Attributes:**
    *   `rowspan`: Makes a cell span across multiple rows.
    *   `colspan`: Makes a cell span across multiple columns.
*   **Constraint:** Tables should only be used for **data**, not for webpage layouts.

## 3.18 Semantic HTML
*   **Definition:** Using tags that describe their **meaning** rather than just their appearance.
*   **Benefits:** Improves **SEO**, **Accessibility** (for screen readers), and code **maintainability**.

#### Common Semantic Elements
*   `<header>`: Introductory content or navigation links at the top.
*   `<nav>`: Defines a set of navigation links.
*   `<main>`: Specifies the unique, primary content of the document.
*   `<section>`: Groups related content into thematic blocks.
*   `<article>`: Self-contained content (e.g., a blog post).
*   `<footer>`: Content at the bottom (copyright, contact info).
*   Table semantics: `<thead>`, `<tbody>`, `<tfoot>`.

## 3.19 File Path and Details
Paths are used to locate resources like images or link to other HTML pages.

| Path Type | Definition | Best Use Case |
| :--- | :--- | :--- |
| **Absolute Path** | Starts from the **root** (e.g., `C:/Users/...` or `https://...`). | Linking to external websites. |
| **Relative Path** | Starts from the **current folder**. | Linking internal project files (Images, CSS, Pages). |

#### Relative Path Symbols
*   `. /` : Refers to the **current** folder.
*   `.. /` : Moves **one level up** to the parent folder.
*   **Recommendation:** Always use **relative paths** for local projects to ensure they remain functional if the project folder is moved or hosted.

## 3.20 Webpage and Connection
*   **Multi-page Websites:** Consist of multiple HTML files (e.g., `home.html`, `about.html`) stored in a structured folder system.
*   **Linking Pages:** Use anchor tags with relative paths.
    *   *Example:* `<a href="./events.html">Events</a>`
*   **Consistency:** Reuse the same `<header>` and `<nav>` across all pages for a cohesive user experience.

## 3.21 Hosting Website
*   **Hosting:** The process of uploading local files to a **Web Server** connected to the internet 24/7.
*   **Index File:** The main homepage **must** be named `index.html`. Browsers and hosting services (like GitHub Pages) look for this file by default.
*   **GitHub Pages:** A free service to host static websites.
    *   **Workflow:** Create a public repository $\rightarrow$ Upload files $\rightarrow$ Go to Settings $\rightarrow$ Pages $\rightarrow$ Select `main` branch $\rightarrow$ Save.

## 3.22 Resume Website
*   **Assignment Objective:** Build a personal resume using HTML.
*   **Required Elements:**
    *   Header (Name and tagline).
    *   Photo (`<img>` with `alt` text).
    *   Summary/Objective.
    *   Sections for Work Experience and Education.
    *   Semantic tags for structure.
    *   A table for skills or certifications.

## Quick Revision Summary
*   **Key Definitions:**
    *   **HTML:** Skeleton of the web.
    *   **Void Tags:** `<img>`, `<br>`, `<hr>`, `<input>`.
    *   **Semantic HTML:** Tags with meaning (`<nav>`, `<header>`, etc.).
*   **Must-Remember Points:**
    *   `index.html` is the mandatory name for the homepage.
    *   Relative paths (`./` and `../`) are essential for portability.
    *   The `name` attribute is required for form data to be sent.
    *   Tables are for **data only**, never for layout.
    *   WebP is the preferred image format for web speed.

# Module 4: Introduction to CSS and Styling

## 4.1 Introduction to CSS
*   **Definition:** CSS stands for **Cascading Style Sheets**.
*   **Purpose:** It separates **content** (HTML) from **presentation** (Design). It allows developers to specify colors, fonts, spacing, and layouts.
*   **Analogy:** If HTML represents "nouns" (e.g., a button), CSS represents "adjectives" (e.g., a purple, large, rounded button).
*   **History:** CSS was created in 1996 to solve the problem of cluttered HTML code where styling tags like `<font>` were overused.

## 4.2 Ways to add CSS
There are three methods to apply CSS to a webpage:

| Method | Description | Best Use Case |
| :--- | :--- | :--- |
| **Inline CSS** | Applied directly within an HTML element using the `style` attribute. | Quick testing or individual element adjustments. |
| **Internal CSS** | Written inside a `<style>` tag within the `<head>` section of an HTML file. | Single-page websites. |
| **External CSS** | Written in a separate `.css` file and linked using the `<link>` tag in the `<head>`. | Multi-page websites; keeps code clean and reusable. |

*   **External Link Syntax:** `<link rel="stylesheet" href="style.css">`

## 4.3 Syntax and Selectors
#### CSS Syntax
A CSS rule consists of a **Selector** and a **Declaration Block**.
*   `selector { property: value; }`
*   **Selector:** Targets the HTML element.
*   **Declaration:** Contains a property (e.g., `color`) and a value (e.g., `blue`), separated by a colon and ending with a semicolon.

#### Basic Selectors
1.  **Element Selector:** Targets all elements of a specific tag (e.g., `p { color: red; }`).
2.  **Class Selector:** Targets elements with a specific class attribute. Uses a **dot** (`.`). (e.g., `.orange-text { color: orange; }`).
3.  **ID Selector:** Targets a single unique element. Uses a **hash** (`#`). (e.g., `#main-header { text-align: center; }`).
4.  **Universal Selector:** Targets every element on the page. Uses an **asterisk** (`*`).

## 4.4 Tools and References
*   **MDN Web Docs:** The primary resource for looking up CSS properties, syntax, and browser compatibility.
*   **Online Tools:** Color pickers, CSS generators (for rounded corners or gradients), and Google Fonts for custom typography.

## 4.5 Colors and Fonts
#### Color Formats
*   **Named Colors:** Standard names like `red`, `blue`, `aqua`.
*   **HEX Codes:** Six-character codes starting with `#` (e.g., `#FF0000`). Uses Hexadecimal ($0-9$ and $A-F$).
*   **RGB:** Red, Green, Blue additive model. Values range from $0$ to $255$. Syntax: `rgb(255, 0, 0)`.

#### Font Properties
*   **font-size:** Can be absolute (px, pt) or relative (em, rem).
    *   `px` (Pixel): Fixed size ($1px \approx 0.26mm$).
    *   `em`: Relative to the **parent** element's font size.
    *   `rem`: Relative to the **root** (`<html>`) element's font size.
*   **font-weight:** Controls thickness ($100$ to $900$; $400$ is normal, $700$ is bold).
*   **font-family:** Defines the typeface. Uses a **Font Stack** (fallback list) to ensure a font loads if the primary is unavailable.
*   **font-style:** Used for `italic`, `normal`, or `oblique`.
*   **text-align:** Horizontal alignment: `left`, `right`, `center`, or `justify`.

## 4.6 CSS Inspection
*   **Chrome Developer Tools:** Opened via `Right Click > Inspect` or `F12`.
*   **Elements Tab:** View HTML structure and applied CSS.
*   **Styles Section:** Allows **Live Editing** of CSS (temporary changes for testing).
*   **Computed Tab:** Shows the final calculated values for all properties, resolving conflicts from overrides.
*   **CSS Overview:** A tool in DevTools to see a summary of all colors, fonts, and unused declarations on a page.

## 4.7 Box Model
Every element is treated as an invisible box consisting of four parts:
1.  **Content:** The actual text or image.
2.  **Padding:** Transparent space **inside** the border, around the content.
3.  **Border:** The edge around the padding and content.
4.  **Margin:** Transparent space **outside** the border, separating the element from others.

#### Value Directions (Clockwise Rule)
*   **1 Value:** Applies to all four sides.
*   **2 Values:** `[Top/Bottom] [Left/Right]`
*   **4 Values:** `[Top] [Right] [Bottom] [Left]`

*   **Margin Stacking:** Adjacent vertical margins do not add up; the browser applies only the larger of the two.
*   **Border Collapse:** Used in tables (`border-collapse: collapse;`) to merge individual cell borders into a single line.

## 4.8 CSS Cascade and Specificity
#### The Cascade
Styles follow a "waterfall" flow. If two rules have the same weight, the one defined **later** in the code (lower down) takes priority.

#### Specificity (Ranking System)
When different selectors target the same element, the most specific one wins:
1.  **Inline Styles** (Highest Priority)
2.  **ID Selectors**
3.  **Class Selectors** (includes pseudo-classes and attributes)
4.  **Element Selectors** (Lowest Priority)

*   **!important:** A keyword added to a property to override all other specificity rules. **Not recommended** as it makes debugging difficult.

## 4.9 Combining CSS Selectors
*   **Descendant Selector:** `div p` (Space). Targets all `<p>` inside a `<div>`, regardless of depth.
*   **Child Selector:** `div > p`. Targets only **direct** children.
*   **Adjacent Sibling:** `h1 + p`. Targets the element immediately following another.
*   **Grouping:** `h1, h2, p` (Comma). Applies the same style to multiple selectors.
*   **Chaining:** `button.active` (No space). Targets a `<button>` that specifically has the class `active`.

## 4.10 Pseudo Selectors
#### Pseudo-classes (States)
Target elements based on user interaction or position:
*   `:hover`: Triggered when the mouse is over an element.
*   `:active`: Triggered when an element is being clicked.
*   `:nth-of-type(n)`: Targets the $n^{th}$ child of its type (e.g., every 3rd list item).

#### Pseudo-elements (Parts)
Target specific parts of an element. Uses **double colons** (`::`):
*   `::first-letter`: Styles the very first character.
*   `::first-line`: Styles only the first line of text.
*   `::selection`: Styles the part of the text highlighted by the user.

## 4.11 Inheritance
*   **Inherited Properties:** Automatically passed from parent to child (e.g., `color`, `font-family`, `text-align`).
*   **Non-Inherited Properties:** Properties that affect the "box" are not passed down (e.g., `border`, `margin`, `padding`).
*   **Force Inheritance:** Use the `inherit` keyword (e.g., `color: inherit;`) to force an element (like a button) to take its parent's color.

## 4.12 Span
*   **Tag:** `<span>`
*   **Type:** Inline element.
*   **Use Case:** Used to wrap a small portion of text within a block (like a paragraph or heading) to apply specific styles without breaking the line or flow.

## 4.13 Display Property
Controls how an element sits in the document flow:
*   **block:** Takes full width; starts on a new line (e.g., `<div>`, `<h1>`).
*   **inline:** Takes only necessary width; does not respect height/width/vertical margins (e.g., `<span>`, `<a>`).
*   **inline-block:** Stays in line with text but **respects** height, width, and padding.
*   **none:** Completely removes the element from the page layout.

## 4.14 Position Property
*   **static:** Default flow; top/left/right/bottom values are ignored.
*   **relative:** Positioned relative to its **original position**; the original space is preserved.
*   **absolute:** Positioned relative to its **nearest positioned ancestor** (non-static); removed from normal flow.
*   **fixed:** Positioned relative to the **viewport**; stays in place during scroll.
*   **sticky:** Toggles between `relative` and `fixed` based on the user's scroll position.

## 4.15 Float and Clear
*   **float:** Moves an element to the `left` or `right`, allowing text to wrap around it (common in newspaper layouts).
*   **clear:** Prevents an element from being positioned next to a floated element. Values: `left`, `right`, or `both`.
*   **Note:** Floats are older techniques; Flexbox and Grid are preferred for modern layouts.

## 4.18 Key Takeaways
- Use **External CSS** for maintainability.
- The **Box Model** is Content $\rightarrow$ Padding $\rightarrow$ Border $\rightarrow$ Margin.
- **Specificity** is the hierarchy of selectors (ID > Class > Element).
- **Relative units** (em, rem, %) are better for responsive design than pixels.
- Use **Span** for inline text styling and **Div** for block grouping.

## Quick Revision Summary
- **Key Definitions:**
    - **Cascade:** Flow of styles where later rules override earlier ones.
    - **Specificity:** The weight assigned to different selector types.
    - **Inheritance:** Automatic passing of properties from parents to children.
- **Must-remember facts:**
    - Hex codes have **6** characters; RGB has values from **0 to 255**.
    - `display: none` hides an element, while `visibility: hidden` would keep the space.
    - An element with `position: absolute` needs a parent with `position: relative` (or any non-static value) to be contained within that parent.
    - Padding is **inside** the border; Margin is **outside**.

# Module 5: Advanced CSS and Responsive Design

## 5.1 Styling Tips and Resources
#### Multiple Classes in HTML
*   **Technique:** Instead of creating one class for every unique combination of styles, you can assign **multiple classes** to a single HTML element by separating them with a **space**.
    *   *Example:* `<p class="standard-text high-priority blue-background">...</p>`
*   **Modularity:** This approach makes CSS modular and clean. You define a style once and mix-and-match it across elements.
*   **Reusability:** Updates are easier. Changing the "highlight" class color updates every element using that class simultaneously.
*   **Logic:** It makes code more **semantic**. It is easy to understand which styles are applied just by reading the class names in HTML.

## 5.2 Flexbox and Grid Layout Systems
Traditional layout methods (Tables, Floats) were cumbersome and not intended for complex web design. Modern CSS uses Flexbox and Grid.

#### 5.2.1 Flexbox (1-Dimensional Layout)
*   **Core Concept:** Best for arranging items in a single direction—either a **row** or a **column**.
*   **Main Axis vs. Cross Axis:**
    *   **Row:** Main Axis = Horizontal; Cross Axis = Vertical.
    *   **Column:** Main Axis = Vertical; Cross Axis = Horizontal.
*   **Parent Properties (Flex Container):**
    *   `display: flex;`: Activates flex behavior.
    *   `flex-direction`: `row` (default), `row-reverse`, `column`, `column-reverse`.
    *   `justify-content`: Aligns items along the **Main Axis** (`flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`).
    *   `align-items`: Aligns items along the **Cross Axis** (`flex-start`, `flex-end`, `center`, `baseline`).
    *   `flex-wrap`: Controls if items should wrap to the next line (`nowrap`, `wrap`, `wrap-reverse`).
    *   `align-content`: Aligns multiple lines of items when wrapping is active.
*   **Child Properties (Flex Items):**
    *   `order`: Sets the visual order of items (default is $0$; higher numbers appear later).
    *   `flex-grow`: Determines how much an item grows relative to others.
    *   `flex-shrink`: Determines how much an item shrinks when space is tight.
    *   `flex-basis`: Sets the initial size before extra space is distributed.
    *   `flex`: Shorthand for `flex-grow`, `flex-shrink`, and `flex-basis`.
    *   `align-self`: Overrides the parent's `align-items` for a specific child.

#### 5.2.2 CSS Grid (2-Dimensional Layout)
*   **Core Concept:** Handles both **rows and columns** simultaneously. Perfect for overall page structure.
*   **Parent Properties (Grid Container):**
    *   `display: grid;`: Activates grid behavior.
    *   `grid-template-columns` / `grid-template-rows`: Defines the size and number of tracks.
    *   `gap`: Sets the spacing between cells (`row-gap` and `column-gap`).
    *   `grid-template-areas`: Visually names sections (e.g., `"header header" "sidebar main"`) to define layout structure.
*   **Grid Functions and Units:**
    *   `fr` (Fractional Unit): Represents a fraction of the available space.
    *   `repeat(n, size)`: Repeats a column/row definition $n$ times.
    *   `minmax(min, max)`: Defines a range for column/row size.
    *   `auto-fit` / `auto-fill`: Automatically calculates how many columns can fit in a line.
*   **Child Properties (Grid Items):**
    *   `grid-column-start` / `grid-column-end`: Determines where an item begins and ends horizontally.
    *   `grid-row-start` / `grid-row-end`: Determines where an item begins and ends vertically.
    *   `span`: Shorthand to tell an item to take up $X$ number of cells (e.g., `grid-column: span 3;`).

#### 5.2.3 Comparison: Flexbox vs. Grid
| Feature | Flexbox | CSS Grid |
| :--- | :--- | :--- |
| **Dimension** | 1D (Row OR Column) | 2D (Row AND Column) |
| **Control** | Content-first (items define the flow) | Layout-first (container defines the structure) |
| **Best Use** | Components (navbars, button groups) | Whole Page Layout (header, sidebar, main, footer) |

## 5.3 Responsive Design and Media Queries
*   **Responsive Design:** Ensuring a website looks and functions well across all screen sizes (mobile, tablet, desktop).
*   **Breakpoints:** Specific pixel widths where the layout changes to adapt to the device.
*   **Media Query Syntax:**
    *   `@media (condition) { /* CSS rules here */ }`
*   **Conditions:**
    *   `max-width`: "Up to" a certain size (e.g., `max-width: 750px` targets mobile).
    *   `min-width`: "At least" a certain size (e.g., `min-width: 1200px` targets large desktops).
*   **Logical Combinations:** You can combine `min-width` and `max-width` to target a specific range (e.g., tablets).
*   **Common Use Case:** Changing a 4-column desktop grid to a 1-column mobile layout.

## 5.4 Introduction to CSS Frameworks (Bootstrap/Tailwind)
#### Bootstrap
*   **Definition:** A front-end framework providing pre-made CSS components and a powerful grid system.
*   **Installation:** Usually linked via **CDN (Content Delivery Network)** in the HTML `<head>`.
*   **Pros:** Extremely fast development, professional-looking components (buttons, cards, navbars), built-in responsiveness.
*   **Cons:** Can lead to code clutter (too many classes), difficult to achieve unique/custom designs.
*   **Grid System:** Uses a **12-column system**.
    *   Class `row` creates a flex container.
    *   Class `col-4` spans 4 out of 12 columns (1/3 of the width).
*   **Utility Classes:** Predefined classes for margin (`m-`), padding (`p-`), color (`text-primary`), and borders.

#### Tailwind
*   An alternative framework that is gaining popularity, particularly among startups, for its utility-first approach.

## 5.5 Learning Interludes
*   **Figma to CSS:** Translating design blueprints into code requires inspecting properties like sizes, colors, and font stacks in design tools.
*   **Viewport Units:**
    *   `vh`: Viewport Height ($100vh$ = full screen height).
    *   `vw`: Viewport Width ($100vw$ = full screen width).

## Quick Revision Summary
*   **Key Definitions:**
    *   **Flexbox:** 1D tool for alignment and distribution.
    *   **Grid:** 2D tool for complex page structures.
    *   **CDN:** Content Delivery Network used to load frameworks like Bootstrap without downloading files.
*   **Important Formulas:**
    *   **Bootstrap Grid:** Total columns = $12$. (e.g., `col-6` + `col-6` fills one row).
    *   **Flex Growth:** Growth of Item B = (Total growth factor) $\times$ (applied multiplier).
*   **Must-remember points:**
    *   `justify-content` = Main Axis; `align-items` = Cross Axis.
    *   `min-width` is for **Mobile-First** design (starting small and adding styles for larger screens).
    *   Bootstrap `container` class is essential for centering and padding the main content.
    *   Always use a **Font Stack** for compatibility.

# Module 6: Basics of JavaScript

## 6.1 JavaScript Fundamentals
*   **Definition:** JavaScript is a versatile, interpreted programming language that adds interactivity and dynamic behavior to static HTML/CSS websites.
*   **History:** Born in 1995 at Netscape (created by Brendan Eich). Originally called **LiveScript**. Standardized as **ECMAScript (ES)**.
*   **Comparison:** JavaScript is an **interpreted** language (runs directly in browsers), whereas Java is a **compiled** language. They are entirely different ("as similar as bat and battery").
*   **Development Environment:** 
    *   **Console:** Found in Browser Developer Tools (`F12`). Used for quick tests and debugging.
    *   **Snippets:** Located in the "Sources" tab of Chrome DevTools; allows writing and saving longer blocks of code.
*   **Basic Commands:**
    *   `alert()`: Displays a pop-up message.
    *   `prompt()`: Collects text input from the user.
    *   `console.log()`: Prints values to the console for debugging.

## 6.2 Data Types and Variables
#### Data Types
*   **Primitive Types:**
    *   **String:** Text sequences enclosed in quotes or backticks.
    *   **Number:** All numeric values (integers, decimals, floating points).
    *   **Boolean:** Only two values—`true` or `false`.
    *   **Undefined:** A variable declared but not yet assigned a value.
    *   **Null:** An intentional assignment representing "no value" (technically returns "object" when checked with `typeof`).
*   **Non-Primitive Types:** Objects and Arrays.
*   **Checking Types:** Use the `typeof` operator (e.g., `typeof "Hello"` returns "string").

#### Variables
*   **Declaration Keywords:**
    *   `let`: Modern way to declare variables; values **can** be reassigned.
    *   `const`: Used for constants; values **cannot** be reassigned.
    *   `var`: Older way to declare variables; differs in terms of scope (avoid in modern JS).
*   **Naming Rules:**
    *   Must not start with a number.
    *   Cannot use reserved keywords (e.g., `break`, `function`).
    *   **Case-Sensitive:** `NAME` and `name` are different variables.
    *   **Convention:** Use **camelCase** (e.g., `userName`, `totalAmount`).

## 6.3 Strings and Numbers
#### Strings
*   **Indexing:** Zero-based. The first character is at position $0$.
*   **Immutability:** Strings cannot be changed in place. To change a string, you must reassign the variable to a new value.
*   **Template Literals:** Use backticks (`` ` ``) and `${variable}` to embed expressions or variables directly. Supports multi-line strings.
*   **String Methods:**
    *   `.length`: Returns the number of characters (Property, no brackets).
    *   `.toUpperCase()` / `.toLowerCase()`: Changes text case.
    *   `.trim()`: Removes white space from both ends.
    *   `.indexOf(substring)`: Returns the index of the first occurrence; returns $-1$ if not found.
    *   `.slice(start, end)`: Extracts a part of the string (does not include the end index).
    *   `.replace(old, new)`: Replaces the first matching instance.

#### Numbers and Math
*   **Arithmetic Operators:** Addition (`+`), Subtraction (`-`), Multiplication (`*`), Division (`/`), Modulus (`%` - returns remainder), Power (`**`).
*   **Shorthand Operators:** `++` (increment by 1), `--` (decrement by 1), `+=` (compound assignment).
*   **Type Coercion:** JavaScript automatically converts numbers to strings during concatenation (e.g., `"1" + 1` becomes `"11"`).
*   **Math Object:** 
    *   `Math.PI`: Returns the value of $\pi$.
    *   `Math.round()`: Rounds to the nearest integer.
    *   `Math.floor()`: Rounds **down** to the nearest integer.
    *   `Math.ceil()`: Rounds **up** to the nearest integer.
    *   `Math.random()`: Generates a random decimal between $0$ (inclusive) and $1$ (exclusive).
    *   `Math.abs()`: Returns absolute value.

## 6.4 Control Flow
#### Comparison Operators
*   `==` (Loose Equality): Compares values after type conversion.
*   `===` (Strict Equality): Compares both **value and data type**. (Highly recommended).
*   `!=` / `!==`: Not equal and strictly not equal.
*   `>`, `<`, `>=`, `<=`: Greater than, less than, etc.

#### Logical Operators
*   `&&` (AND): Returns true only if **both** sides are true.
*   `||` (OR): Returns true if **at least one** side is true.
*   `!` (NOT): Inverts the Boolean value.

#### Conditionals
*   **if-else:** Executes blocks of code based on conditions.
*   **else if:** Used to check multiple related conditions sequentially.
*   **Nested Conditions:** Placing an `if` inside another `if`.
*   **Truthy/Falsy:**
    *   **Falsy values:** `false`, `0`, `""`, `null`, `undefined`, `NaN`.
    *   **Truthy values:** Everything else (including `[]`, `{}`, and negative numbers).

## 6.5 Arrays
*   **Definition:** An ordered, indexed collection of values. Can hold multiple data types (mixed arrays).
*   **Reference Type:** Arrays are compared by **memory address**, not content. `[1] === [1]` returns `false`.

| Method | Action |
| :--- | :--- |
| `.push()` | Adds element(s) to the **end**. |
| `.pop()` | Removes and returns the **last** element. |
| `.unshift()` | Adds element(s) to the **beginning**. |
| `.shift()` | Removes and returns the **first** element. |
| `.concat()` | Combines arrays into a **new** array. |
| `.includes()` | Checks if a value exists (returns Boolean). |
| `.splice()` | Adds/removes/replaces elements at a specific index (mutates original). |
| `.slice()` | Returns a shallow copy of a portion of the array. |

## 6.6 Objects
*   **Structure:** Collections of **key-value pairs** wrapped in curly braces `{}`. Keys are treated as strings.
*   **Accessing Properties:**
    *   **Dot Notation:** `object.key` (Preferred for known keys).
    *   **Bracket Notation:** `object["key"]` (Required for keys with numbers/spaces or when using variables).
*   **Methods:** Functions stored as object properties.
*   **`this` Keyword:** Refers to the object the method belongs to.
*   **Static Methods:** `Object.keys(obj)`, `Object.values(obj)`, and `Object.entries(obj)` return arrays of keys, values, or pairs.

## 6.7 Loops
*   **for loop:** Used when the number of iterations is known.
    *   `for (let i = 0; i < 10; i++) { ... }`
*   **while loop:** Used when the number of iterations is unknown; runs as long as the condition is true.
*   **for...of loop:** Best for iterating over **values** in an iterable (Arrays, Strings).
*   **for...in loop:** Used to iterate over the **keys** (properties) of an object.
*   **Nested Loops:** A loop inside another loop (common for multi-dimensional arrays/matrices).
*   **Break Keyword:** Immediately terminates the loop.

## 6.8 Functions
*   **Purpose:** Reusable blocks of code that follow the **DRY (Don't Repeat Yourself)** principle.
*   **Terminology:**
    *   **Parameters:** Placeholders defined in the function declaration.
    *   **Arguments:** Actual values passed when calling the function.
*   **Return Statement:** Sends a value back to the caller and **stops** function execution.
*   **Anonymous Functions:** Functions without a name, often assigned to variables.
*   **Callback Functions:** Passing a function as an argument to another function.
*   **Recursion:** A function calling itself. Requires a **base condition** to prevent infinite loops and crashes.

## Quick Revision Summary
*   **Key Definitions:**
    *   **Hoisting:** Ability to call functions before they are defined (not recommended).
    *   **Immutable:** Values that cannot be changed once created (Strings).
    *   **Mutable:** Values that can be modified (Arrays, Objects).
*   **Must-Remember Points:**
    *   `parseInt()` converts strings to integers.
    *   `===` checks both value and type; always use it for reliability.
    *   Arrays and Objects are **Reference Types**; they point to memory locations.
    *   `for...of` = Values; `for...in` = Keys.
    *   `Math.random() * 10 + 1` is a common way to get a random number between 1 and 10.

# Module 7: JavaScript DOM Manipulation

## 7.1 Introduction to DOM Manipulation
#### Document Object Model (DOM) Definition
*   The **DOM** is the programming interface for web documents. It acts as the **bridge** between JavaScript and a webpage.
*   It represents the HTML document as a structured **tree of objects**. 
*   Every element on the page is a **node** in this tree, with defined relationships (parent, child, sibling).

#### Purpose of the DOM
*   Allows JavaScript to access and update content, styles, and structure in **real-time** without reloading the page.
*   Enables dynamic features like form validation, image sliders, live score updates, and interactive menus.

## 7.2 Selecting and Modifying HTML Elements
To manipulate the page, JavaScript must first target (select) specific elements.

#### DOM Selector Methods
| Method | Description | Return Type |
| :--- | :--- | :--- |
| `getElementById()` | Selects a single element by its unique ID. | Single Element |
| `getElementsByClassName()` | Selects all elements sharing a specific class. | HTML Collection |
| `getElementsByTagName()` | Selects all elements of a specific tag type (e.g., `div`). | HTML Collection |
| **`querySelector()`** | Selects the **first** element matching a CSS selector (`.class`, `#id`, `tag`). | Single Element |
| **`querySelectorAll()`** | Selects **all** elements matching a CSS selector. | NodeList |

*   **Best Practice:** `querySelector` and `querySelectorAll` are preferred for their flexibility and use of standard CSS syntax.
*   **Const vs Var:** Use `const` when selecting elements; while the element's properties may change, the **reference** to that DOM node should remain stable.

#### DOM Traversing (Navigating the Tree)
*   **`.parentElement`**: Accesses the immediate parent node.
*   **`.children`**: Returns an HTML Collection of all child elements (ignores text nodes).
*   **`.firstElementChild` / `.lastElementChild`**: Accesses the first or last child element specifically.
*   **`.nextElementSibling` / `.previousElementSibling`**: Navigates between elements at the same hierarchical level (siblings).
*   **`.childElementCount`**: Returns the total number of children belonging to an element.

## 7.3 Manipulating Attributes and Content
#### Content Modification
1.  **`innerText`**: Represents only the **visible** text contained within an element.
2.  **`textContent`**: Represents the **raw** text, including content hidden by CSS or script tags.
3.  **`innerHTML`**: Gets or sets the text **including HTML tags**. 
    *   **Security Warning:** Avoid using `innerHTML` for user-generated content to prevent security vulnerabilities (XSS).

#### Style Manipulation
*   **The `.style` Property**: Used to set **inline styles**.
*   **Naming Convention:** In JavaScript, CSS properties with hyphens are converted to **camelCase**.
    *   *CSS:* `background-color` $\rightarrow$ *JS:* `backgroundColor`
    *   *CSS:* `font-size` $\rightarrow$ *JS:* `fontSize`
*   **Class Manipulation (`classList`)**: The preferred method for styling.
    *   `.add('className')`: Adds a class.
    *   `.remove('className')`: Removes a class.
    *   `.toggle('className')`: Adds the class if it's missing, removes it if it exists.
    *   `.contains('className')`: Returns a Boolean if the class exists.

#### Attribute Manipulation
*   **`getAttribute('name')`**: Retrieves the value of a specific attribute (e.g., `src`, `href`).
*   **`setAttribute('name', 'value')`**: Sets or updates the value of an attribute.

#### Structural Manipulation (Creating/Removing)
*   **`document.createElement('tag')`**: Creates a new HTML element in memory.
*   **`.append()` / `.appendChild()`**: Injects the created element into the page as the last child of a parent.
*   **`.remove()`**: Deletes the selected element from the DOM.
*   **`.insertBefore(newNode, referenceNode)`**: Places a new element specifically before a chosen sibling.
*   **`.insertAdjacentElement(pos, element)`**: Flexible positioning using: `beforebegin`, `afterbegin`, `beforeend`, or `afterend`.

## 7.4 Event Listeners and Interactions
#### Definitions
*   **Event:** A signal or notification that something occurred (user click, mouse move, page load).
*   **Event Listener:** A method that "listens" for a specific event and triggers a **callback function** in response.

#### Implementation
*   **Syntax:** `element.addEventListener('event', callbackFunction);`
*   **Common Events:** `click`, `mouseover`, `keydown`, `submit`, `scroll`, `DOMContentLoaded` (fires when the initial HTML is fully loaded).

#### The Event Object (`e`)
When an event fires, JavaScript automatically passes an object containing metadata:
*   **`e.target`**: The specific element that triggered the event (the "child" that was clicked).
*   **`e.currentTarget`**: The element to which the event listener is attached (the "parent").
*   **`e.altKey`**: A Boolean indicating if the Alt key was held during the action.

#### Event Bubbling and Delegation
*   **Bubbling:** An event triggered on a child element "bubbles up" through its parents.
*   **Event Delegation:** A performance technique where you attach one listener to a **parent** element to manage events for all its **children**. This is more efficient than attaching thousands of individual listeners.

## 7.5 Designing Website (Logic & Animation)
#### Delay and Timing Functions
*   **`setTimeout(function, delay)`**: Executes code once after a specified time ($delay$ in milliseconds).
*   **`setInterval(function, interval)`**: Repeatedly executes code at fixed time intervals.
*   **Asynchronous JS:** These functions allow the program to run animations or fetch data without blocking the rest of the code from executing.

#### Advanced Techniques
*   **Recursion:** A function that calls itself. Useful for complex animations (like character-by-character typing effects) where `for` loops are too fast to see.
*   **Modular Arithmetic:** Using the `%` operator to reset counters (e.g., `index % array.length`) ensures a loop stays within the bounds of a list and repeats infinitely.

## Quick Revision Summary
*   **Key Definitions:**
    *   **DOM:** The JavaScript representation of the HTML document.
    *   **Node:** Any individual piece of the DOM tree (element, text, or comment).
    *   **Event Delegation:** Managing child events via a parent listener.
*   **Important Rules:**
    *   Place `<script>` tags at the **bottom of the body** to ensure the DOM is loaded before JS runs.
    *   Use **camelCase** for CSS properties in JS (e.g., `fontSize`).
    *   $1000ms = 1$ second.
*   **Must-remember Points:**
    *   `querySelector` uses CSS selectors; `getElementById` does not use the `#` prefix.
    *   `innerText` = visible text; `innerHTML` = text + tags.
    *   `e.target` is the origin of the event; `e.currentTarget` is where the listener sits.
    *   `classList.toggle` is excellent for switching between "dark" and "light" modes.

# Module 8: CMS and WordPress Basics

## 8.1 Introduction to CMS and WordPress
*   **CMS (Content Management System):** A software application that allows users to build, manage, and modify website content without needing specialized technical or coding knowledge.
*   **WordPress Overview:** 
    *   The most popular CMS globally, powering over **40% of all websites**.
    *   Offers a **drag-and-drop** approach, making it accessible to non-programmers.
    *   **Features:** Highly customizable through thousands of themes and plugins.

#### wordpress.org vs. wordpress.com
| Feature | wordpress.org | wordpress.com |
| :--- | :--- | :--- |
| **Type** | Self-hosted (Original open-source software). | Hosting platform (Service-based). |
| **Control** | Full control over customization and monetization. | Limited customization in free/beginner tiers. |
| **Hosting** | You must provide your own domain and hosting. | They handle the hosting for you. |
| **Complexity** | Higher (requires manual installation). | Lower (beginner-friendly). |

## 8.2 Setting up a Blog site with WordPress
*   **Initialization:** Requires signing up, choosing a domain (e.g., `demo.wordpress.com`), and selecting a theme.
*   **Templates and Themes:** Finalizing a theme is recommended before building content on top of it. Style variants allow changes to typography and color schemes globally.
*   **Publishing:** Changes are not visible to the public until the **Publish** or **Update** button is clicked.

#### Pages vs. Posts
*   **Pages:** Used for static content that doesn't change often (e.g., **Home**, **About Us**, **Contact Us**).
*   **Posts:** Used for dynamic, chronological content like **blogs**, **news updates**, or **upcoming programs**.

#### Key Management Tools
*   **Dashboard (Admin Panel):** The central hub for editing the site, managing pages, and installing plugins.
*   **Widgets and Plugins:** Add specific functionalities like maps, contact forms, SEO tools, and security enhancements.
*   **Navigation Menus:** Located under the navigation settings; used to arrange links so visitors can easily find different pages.
*   **Document Overview:** A "tree view" (similar to the DOM) that shows the structure of the header, footer, and body elements.

## 8.3 Use of AI Models for Development
*   **AI Power Tools:** Tools like **ChatGPT** and **Claude** speed up development, fix errors, and optimize existing code.
*   **Capabilities:** AI can generate layouts, suggest better coding practices, and automate complex JavaScript functions.

#### Best Practices for AI Prompting
1.  **Be Specific:** Clearly define the task (e.g., "Create a typewriter animation").
2.  **Break it Down:** Instead of asking for a whole script, ask for components step-by-step.
3.  **Set Constraints:** Tell the AI what to avoid (e.g., "Use only Vanilla JavaScript, no jQuery").
4.  **Provide Structure:** Mention the IDs and Classes you are using in your HTML/CSS so the AI code fits your project.
5.  **Leverage Knowledge:** Use your understanding of basics (like `querySelector`) to correct suboptimal code generated by AI.

#### Asynchronous JavaScript and AI
*   AI often provides code using **asynchronous** concepts (like `setTimeout` or `setInterval`).
*   **Event Loop:** Allows functions to be executed outside the main flow so the website doesn't "freeze" during animations.

## 8.4 Conclusion and Final Project
*   **Project Goal:** Identify a real small business (bakery, salon, café) and build a professional, responsive website tailored to their needs.
*   **Development Stack:** Choice of HTML/CSS/JS, Bootstrap, Tailwind, or WordPress.

#### Project Development Steps
1.  **Interview:** Understand the purpose (showcase products, collect leads, or bookings).
2.  **Wireframe:** Create a basic sketch of the layout on paper or digitally.
3.  **Development:** Ensure the design is **mobile-friendly** and accessible.
4.  **AI Collaboration:** Use AI for code snippets, content ideas, or debugging.
5.  **Hosting:** Deploy the site using free services like **GitHub Pages**.

## Quick Revision Summary
*   **Key Definitions:**
    *   **CMS:** Software to manage content without code (e.g., WordPress).
    *   **CDN (Content Delivery Network):** A system to link external libraries (like Bootstrap) into your HTML `<head>`.
    *   **Asynchronous JS:** Code that runs without blocking other tasks.
*   **Must-remember points:**
    *   WordPress powers **nearly half** of the internet.
    *   `index.html` is the mandatory name for the main page when hosting.
    *   **AI is a "helping hand"**: It requires specific, structured prompts to generate high-quality, usable code.
    *   **Responsive design** is a necessity in modern web development to cater to mobile users.