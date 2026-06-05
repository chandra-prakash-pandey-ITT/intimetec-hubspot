# ITT-2026 Theme Changelog

This document tracks all changes made to the ITT-2026 theme.

---

## 2026.02.12 - SW Landing Page 03: SW Pillar Section defaults use content_area_group.heading_items

**Version number:** 2026.02.12.11.32

### Templates

**SW Landing Page 03.html**
- **SW Pillar Section defaults:** Updated Section 1 and Section 3 dnd_module defaults from legacy `heading_items=[...]` at root to `content_area_group.heading_items` nested under `content_area_group`, matching the new primary column heading repeater structure.
- **Purpose:** Align template defaults with `content_area_group.heading_items` (alias mapping and legacy field approach per `docs/ALIAS-MAPPING-STANDARD.md` §8).

---

## 2026.01.14 - SW Landing Page 03: Section 7a Addition, SW Pillar Section CTA Visibility Fix, and Checkmark List Styling

### Templates

**SW Landing Page 03.html**
- **Section 7a Addition:**
  - Added new Section 7a above Section 7 with SR Pattern 02 module
  - Configured with position "top", flip enabled, and height 30px
  - Renamed previous Section 7a to Section 7b (position "bottom", height 40px)
  - Section 7 now has wave patterns both above and below
- **Files Modified:** `sw-templates/SW Landing Page 03.html`

### Modules

**SW Pillar Section.module**
- **CTA Button Visibility Fix:** Removed media type restriction from CTA buttons visibility rules
  - CTA buttons section now visible in UI regardless of Image/Video selection
  - All CTA button fields (text, link, style, arrow) now visible when video is selected
  - Buttons still only render in HTML when respective toggle is enabled
  - Allows users to configure CTA buttons when using video media type
- **Files Modified:** `sw-modules/SW Pillar Section.module/fields.json`

### CSS

**custom-styles.css**
- **Checkmark List Styling:** Added `padding-left: 0 !important;` to `ul.checkmark-list`
  - Removes default list padding for cleaner appearance
  - Maintains existing checkmark icon positioning via `padding-left: 25px` on list items
- **Files Modified:** `css/custom-styles.css`

**Purpose:** These changes improve the landing page visual flow with wave patterns above and below Section 7, enable CTA button configuration when using video in the Pillar Section module, and refine checkmark list styling.

---

## 2026.01.14 - SW Landing Page 03: Section 7 Updates and SR Pattern 02 Module Addition

### Templates

**SW Landing Page 03.html**
- **Section 7 Updates:**
  - Added background color `#fafafa` to Section 7 (ROI Section)
  - Section 7 now contains only SW Image & Text module
- **Section 7a Addition:**
  - Created new Section 7a for SR Pattern 02 module (separate section structure)
  - Configured SR Pattern 02 with default height of 40px for subtle wave pattern
  - Set Section 7a to full width for proper pattern display
- **Section Comments:** Updated all section comments to use module name + section number format for easier communication
- **Files Modified:** `sw-templates/SW Landing Page 03.html`

### Modules

**SR Pattern 02.module** (NEW)
- **Module Addition:** Copied SR Pattern 01 from ISBS/sr theme and renamed to SR Pattern 02
- **Location:** `custom-modules/SR Pattern 02.module/`
- **Purpose:** Provides decorative wave patterns for section transitions
- **Files Added:** `custom-modules/SR Pattern 02.module/` (all files)

**Purpose:** Section 7 now has a light gray background with a subtle wave pattern at the bottom, creating a visual transition effect. The SR Pattern 02 module is available for use across the theme.

---

## 2026.01.13 - SW Simple Hero Module: Background Size Override for Breakpoints

### Modules

**SW Simple Hero.module**
- **Background Size Override:** Added breakpoint-specific background size controls
  - Added `hero_background_size_lg` field (visible when "Override LG Image" is ON)
  - Added `hero_background_size_md` field (visible when "Override MD Image" is ON)
  - Added `hero_background_size_sm` field (visible when "Override SM Image" is ON)
  - Each field has same choices as XL: Cover, Contain, Stretch to Fill, Natural Size
  - Default value: "contain" (matching XL default)
  - Background size now cascades properly: XL → LG → MD → SM, with override options when toggles are enabled
- **Logic Updates:**
  - Updated module.html to check override toggles and set breakpoint-specific CSS variables
  - Created CSS variables: `--hero-bg-size-lg`, `--hero-bg-size-md`, `--hero-bg-size-sm`
  - When override toggle is ON: Uses breakpoint-specific size
  - When override toggle is OFF: Cascades from previous breakpoint (or XL base)
- **CSS Updates:**
  - Added `background-size` to media queries for Desktop (LG), Tablet (MD), and Mobile (SM)
  - Each breakpoint uses its specific CSS variable with proper fallback cascading
- **Files Modified:** `sw-modules/SW Simple Hero.module/module.html`, `sw-modules/SW Simple Hero.module/module.css`, `sw-modules/SW Simple Hero.module/fields.json`

**Purpose:** Allows independent background size control for LG, MD, and SM breakpoints when their respective override toggles are enabled, matching the behavior of image and position overrides.

---

## 2026.01.13 - SW Cards Module: Icon and Button Alignment Fixes

### Modules

**SW Cards.module**
- **Icon/Image Alignment Fix:** Fixed icon alignment not working for images and SVGs
  - Extended CSS to include `.sw-cards__image` and `.sw-cards__svg` in addition to `.sw-cards__icon`
  - Icon alignment now works correctly for all media types (icons, images, SVGs)
  - Uses existing global `icon_position` setting (Left/Center/Right)
- **Button Alignment Fix:** Fixed button alignment not working
  - Replaced inline styles with CSS classes for better reliability
  - Added CSS classes: `.sw-cards__button--left`, `.sw-cards__button--right`, `.sw-cards__button--center`
  - Button alignment now works correctly for all alignment options
  - Still supports per-card alignment (user can set same value for all cards)
- **Files Modified:** `sw-modules/SW Cards.module/module.html`

**Purpose:** These fixes resolve icon/image alignment issues when using images instead of icons, and ensure button alignment works correctly regardless of the selected option.

---

## 2026.01.13 - SW Pillar Section Module: Video Support, Border Radius Override, and UI Improvements

### Modules

**SW Pillar Section.module**
- **Video Functionality:** Added comprehensive video support with media type selector (Image/Video)
  - Added `media_type` field (Image/Video radio selector)
  - Added `video_type` field (HubSpot Video/External Embed selector)
  - Added `hubspot_video` field (HubSpot video player)
  - Added `embed_field` field (External embed for YouTube, Vimeo, etc.)
  - Added `video_poster` field (Optional poster image for videos)
  - Updated template to conditionally render video or image based on media type
  - Added responsive video container styling with 16:9 aspect ratio
  - Added oEmbed JavaScript functionality for external video embeds
- **Field Label Update:** Changed "Pillar Image" label to "Image or Video"
- **Border Radius Override:** Added border radius functionality with override toggle
  - Added `override_image_border_radius` toggle field
  - Added `image_border_radius` field (only visible when override is enabled)
  - When toggle is OFF: Uses Global Border Radius from theme settings (`theme.misc.border_radius`)
  - When toggle is ON: Uses custom `image_border_radius` value (can be set to 0 for no radius)
  - Border radius applies to images only, not videos
- **CTA Visibility:** Updated CTA buttons to only show when media type is "Image"
  - Added visibility rules to hide CTA buttons section when video is selected
  - Updated all CTA button child fields with advanced visibility rules
- **HubSpot Video Player Fix:** Fixed HubSpot video player rendering
  - Wrapped video player in proper container with responsive styling
  - Removed conflicting width/height parameters when using `full_width`
  - Added proper CSS for HubSpot video widget elements
- **Files Modified:** `sw-modules/SW Pillar Section.module/module.html`, `sw-modules/SW Pillar Section.module/module.css`, `sw-modules/SW Pillar Section.module/module.js`, `sw-modules/SW Pillar Section.module/fields.json`

**Purpose:** These updates add comprehensive video support to the SW Pillar Section module, allowing users to choose between images and videos. The border radius override provides flexible styling options while maintaining consistency with global theme settings. The CTA visibility update ensures a cleaner interface when using videos.

---

## 2026.01.09 - SW Tabs Module Addition, SR Stats 01 Module Addition, Template Updates, and Macro Safety Improvements

### Modules

**SW Tabs.module** (NEW)
- **Module Addition:** Added SW Tabs module from master theme to ITT-2026 theme
- **Default Configuration Updates:**
  - Reduced default tabs from 5 to 3 tabs (default occurrence changed from 5 to 3)
  - Removed default heading (heading occurrence set to 0, heading text default set to empty string)
  - Removed default class "image-cutout" (changed to empty string)
  - Updated background options defaults:
    - Background Option: "custom" (was "image")
    - Background Color: #fff with 0% opacity (transparent background)
    - Text Align: "LEFT" (was "CENTER")
    - Text Color: "primary" (was "white")
- **Files Added:** `sw-modules/SW Tabs.module/module.html`, `sw-modules/SW Tabs.module/module.css`, `sw-modules/SW Tabs.module/module.js`, `sw-modules/SW Tabs.module/fields.json`, `sw-modules/SW Tabs.module/meta.json`

**SR Stats 01.module** (NEW)
- **Module Addition:** Copied SR Stats 01 module from "Smithworks Legacy SR" theme to ITT-2026 theme
- **Files Added:** `custom-modules/SR Stats 01.module/module.html`, `custom-modules/SR Stats 01.module/module.css`, `custom-modules/SR Stats 01.module/module.js`, `custom-modules/SR Stats 01.module/fields.json`, `custom-modules/SR Stats 01.module/meta.json`

### Templates

**SW Landing Page 02.html**
- **Module Integration:**
  - Replaced Blank Section 1 with SW Tabs module (label: "Tabs Section")
  - Replaced Blank Section 4 with SR Stats 01 module (label: "Stats Section")
- **Required Modules Documentation:** Updated to include SW Tabs and SR Stats 01 in required modules list
- **Files Modified:** `sw-templates/SW Landing Page 02.html`

### Partials

**sw-macros.html**
- **Color Macro Null Safety:** Added null checks to prevent `convert_rgb` errors:
  - Added check for `value` and `value.color` existence before calling `convert_rgb`
  - Returns `transparent` if value is null or missing color property
  - Prevents "Passed #null into convert_rgb" warnings
- **Shadow Property Safety:** Fixed shadow property access error:
  - Added check for `form.styles.shadow` existence before accessing `.shadow` property
  - Prevents "Cannot resolve property 'shadow' in 'false'" error
- **Files Modified:** `sw-templates/sw-macros.html`

**Purpose:** These changes add powerful new modules to the theme and improve template flexibility. The SW Tabs module provides comprehensive tab navigation with customizable styling and transparent background defaults, while SR Stats 01 adds animated statistics display. The macro updates prevent runtime errors when color and shadow values are null or false, improving module stability.

---

## 2026.01.09 - SW Tabs Module: Class Name Update, Container Spacing Fix, Alignment Fixes, and Default Content Updates

### Modules

**SW Tabs.module**
- **Class Name Update:** Changed content wrapper class from `col-content` to `tab-section-content` to prevent conflicts with theme CSS styling (e.g., `.sw-itt-header` from `sw-overrides.css`)
- **Container Spacing Fix:** Fixed spacing controls (margin above/below and padding) to properly apply to `.sr-tabs-02-wrapper`:
  - Added CSS rules to apply `design_settings.container_styles.spacing.margin` (top, bottom, left, right) to `.sr-tabs-02-wrapper`
  - Added CSS rules to apply `design_settings.container_styles.spacing.padding` (top, bottom, left, right) to `.sr-tabs-02-wrapper`
  - Ensures Container Styles spacing controls in the editor now properly affect the tabs wrapper container
- **Tabs Alignment Fix:** Fixed left/right alignment by adding conditional flex behavior:
  - When alignment is "start" (Left) or "end" (Right): tabs use `flex: 0 0 auto !important;` to allow `justify-content` to position them properly
  - When alignment is "center": tabs use `flex: 1 1 0 !important;` to maintain equal width distribution
  - Prevents tabs from always appearing centered regardless of alignment setting
- **Default Styling Updates:**
  - Updated border radius on both tab bar and tab section to 100px (from 20px)
  - Set tab section background color to transparent (from #cdcdcd)
  - Removed second column from all three default tab sections
  - Removed CTA button from all three default tab sections' first columns
  - Enabled lead text by default in all tab section columns
- **Default Content Updates:**
  - Tab 1 (Education): Heading "Modern tool for modern learning", Content "Purpose-built software that supports educator workflows, simplifies certification and course management, and creates seamless experiences for students and families."
  - Tab 2 (Health & Human Services): Heading "Technology to help you serve people faster", Content "Secure, human-centered platforms that reduce administrative burden, improve case management, and support timely, informed decisions for the communities you serve."
  - Tab 3 (Insurance): Heading "Strengthening insurance operations", Content "Purpose-built internal tools that simplify insurance workflows, improve agent and staff efficiency, and support long-term operational modernization."
- **Files Modified:** `sw-modules/SW Tabs.module/module.html`, `sw-modules/SW Tabs.module/module.css`, `sw-modules/SW Tabs.module/fields.json`

**Purpose:** These changes fix styling conflicts with theme CSS, enable proper left/right tab alignment, ensure Container Styles spacing controls work correctly, and update default styling and content to match the ITT-2026 theme requirements.

---

## 2026.01.09 - Form Submit Button Margin Update

### Partials

**sw-macros.html**
- **Form Submit Button Styling:** Updated button positioning from negative offsets to margin:
  - Removed `position: relative !important;`, `top: -5px !important;`, and `left: -4px !important;`
  - Added `margin: 5px !important;` to provide consistent spacing around submit buttons
  - Applies to all form submit button selectors (`.hs-button.primary`, `.hsfc-Button`, etc.)
- **Files Modified:** `sw-templates/sw-macros.html`

**Purpose:** This change replaces negative positioning offsets with a standard margin approach, providing consistent 5px spacing around form submit buttons while maintaining proper button alignment and appearance.

---

## 2026.01.09 - SW Horizontal Wave Spacer Module: Multiple Design Options and Instance Scoping

### Modules

**SW Horizontal Wave Spacer.module**
- **Multiple Design Options:** Added dropdown field to select from three spacer designs:
  - Design 1: Original SVG curve border (default) - uses `background-size: cover`, 100px min-height
  - Design 2: Pretty Divider (1) PNG - uses `background-size: 100% 100%` to stretch to fill container, 200px min-height
  - Design 3: Pretty Divider (2) PNG - uses `background-size: 100% 100%` to stretch to fill container, 200px min-height
  - Design 2 and 3 use center-center positioning and stretch to fill container exactly without cropping
- **Instance Scoping:** Added `data-instance` attribute for CSS isolation:
  - Each module instance has unique `data-instance="{{ name|escape }}"` attribute
  - CSS rules scoped to individual instances prevent cross-instance style conflicts
  - Instance-specific styles applied inline in `module.html` for reliable image loading
- **Background Image Handling:**
  - Images loaded via inline styles for Design 2 and 3 to ensure reliable loading
  - URL encoding fixed for parentheses in image paths (`%28` and `%29`)
  - Design 1 continues to use original SVG from HubSpot assets
- **Files Modified:** `sw-modules/SW Horizontal Wave Spacer.module/module.html`, `sw-modules/SW Horizontal Wave Spacer.module/module.css`, `sw-modules/SW Horizontal Wave Spacer.module/fields.json`

### Templates

**SW Landing Page 02.html**
- Updated template version to 2026.01.09
- Template uses SW Horizontal Wave Spacer module with Design 2 and Design 3 defaults
- **Files Modified:** `sw-templates/SW Landing Page 02.html`

**Purpose:** These changes enable multiple wave spacer designs with proper instance isolation, ensuring that CSS changes affect only the specific module instance. Design 2 and 3 stretch to fill the container exactly without cropping, matching the container height (200px) and width perfectly.

---

## 2026.01.09 - SW Cards Module: Per-Card Icon Color Control and Icon Type Label Updates

### Modules

**SW Cards.module**
- **Per-Card Icon Color Control:** Moved icon color from global to per-card control:
  - Removed `icon_color` field from global `cards_layout` group
  - Added `icon_color` field to individual `cards` group (positioned between SVG Code and Rich Text fields)
  - Field visibility: Only shows when `icon_type == 'icon'` OR `icon_type == 'svg'`
  - Each card now has independent icon color control
  - Default value: #222222 at 100% opacity
  - Added per-card icon color variable in card loop: `{% set _card_icon_color = card.icon_color|default({'color': '#222222', 'opacity': 100}) %}`
- **Icon Color Application:**
  - FontAwesome icons: Color applied via inline `style="color: ..."` on `.sw-cards__icon` container
  - SVG Code (pasted): Color applied via inline `style="color: ..."` on `.sw-cards__svg` container
  - Added CSS rule: `.sw-cards__svg { fill: currentColor; }` to ensure SVG fill inherits color
  - SVG/PNG Images (uploaded): Icon color field is hidden (cannot be colored via CSS)
- **Icon Type Label Updates:**
  - Changed "Image" to "SVG/PNG" in icon_type dropdown and field label
  - Changed "SVG" to "SVG Code" in icon_type dropdown and field label
  - Updated help text for SVG Code field: "Paste your SVG code below"
  - Updated icon color help text: "Color for FontAwesome icons and SVG code. Does not affect uploaded images."
- **Files Modified:** `sw-modules/SW Cards.module/module.html`, `sw-modules/SW Cards.module/fields.json`

**Purpose:** These changes enable individual control over icon colors for each card, with support for FontAwesome icons and pasted SVG code. Icon type labels were updated for clarity, distinguishing between uploaded images (SVG/PNG) and pasted SVG code.

---

## 2026.01.08 - SW Cards Module Enhancements: Heading Button, Text Container Padding, Heading Padding, and Button Nesting

### Modules

**SW Cards.module**
- **Heading Button Feature:** Added heading button functionality with alignment options:
  - New `heading_button` group field with button text, link, style, size, arrow, and alignment options
  - Button appears to the right of headings on desktop, stacks on mobile (max-width: 991px)
  - Alignment options: Top, Middle, Bottom (default: Bottom)
  - Uses same button style options as card buttons
  - Button fields are always visible (removed visibility conditions based on button text)
  - Button text defaults to blank
  - Gutter spacing applied to `.sw-cards__heading-wrapper` instead of individual heading elements
  - Fixed button visibility condition to only require button text (removed URL requirement)
- **Text Container Padding Override:** Added ability to set separate padding for text container:
  - New toggle field `text_container_padding_override` in Cards Layout group
  - When enabled, card padding set to 0 (images/icons reach edges) while text container has separate padding
  - New `text_container_padding` field (spacing type) with default: Top 0px, Right 20px, Bottom 20px, Left 20px
  - Padding applies to both `.sw-cards__content` and nested `.sw-cards__button` elements
  - Fields positioned directly below "Card Spacing" in Cards Layout group
- **Heading Padding Fields:** Added padding top and bottom controls for headings:
  - New `heading_padding_top` and `heading_padding_bottom` fields in Heading group
  - Default values: 0px for both
  - Overrides theme defaults with `!important` flags
  - Sets all margins to 0 and only applies top/bottom padding
  - Applies to all heading elements (h1-h6)
- **Button Nesting:** Moved card button inside content container:
  - `.sw-cards__button` now nested inside `.sw-cards__content`
  - Text container padding now applies to both content and button
  - Content div created if either rich text or button exists
  - Button alignment and styling preserved
- **Overflow Hidden:** Added overflow hidden to cards with rounded corners:
  - Added `overflow: hidden` when `border-radius` is applied
  - Prevents images/backgrounds from showing through rounded corners
- **Heading Margin Removal:** Removed margin-bottom from `.sw-cards__heading`:
  - Added `margin-bottom: 0 !important` to override theme defaults
- **Files Modified:** `sw-modules/SW Cards.module/module.html`, `sw-modules/SW Cards.module/fields.json`

**Purpose:** These changes enhance the SW Cards module with heading button functionality, flexible text container padding controls, heading spacing options, improved button integration, and visual polish for rounded corner cards.

---

## 2026.01.08 - Header Breakpoint Fixes and Link Text Decoration Removal

### Modules

**SW Header ITT.module**
- **Header Breakpoint Fixes:** Fixed header styling jumps at 1367px and 1601px viewport widths:
  - Changed navbar margin/padding breakpoint from `@media (max-width: 1366px)` to `@media (min-width: 1200px)` to apply correct styling (padding: 14px, margin: 32px 0 0 0) to all viewport widths 1200px and above
  - Changed nav-right-items margin breakpoint from `@media (min-width: 1200px) and (max-width: 1600px)` to `@media (min-width: 1200px)` to maintain consistent 160px margin for all viewport widths 1200px and above
  - Ensures consistent header appearance from 1200px-1366px continues at 1367px+ and 1601px+, matching live site behavior
- **Link Text Decoration Removal:** Removed text decoration underline from all links in header module:
  - Added comprehensive rule targeting all links within `.itt-header-section`
  - Removes underlines for all link states: `:link`, `:visited`, `:hover`, `:focus`, `:active`
  - Uses `text-decoration: none !important` to override any conflicting styles
  - Applies to navigation links, dropdown toggles, logo link, tab links, and all other links in header module
- **Files Modified:** `sw-modules/SW Header ITT.module/module.css`

**Purpose:** These changes ensure the header maintains consistent styling across all desktop viewport widths (1200px+) without jumps or layout shifts, and removes all link underlines throughout the header module for a cleaner appearance matching the live site.

---

## 2026.01.08 - Language Switcher Mobile Positioning, Hamburger Outline Fix, Dropdown Triangle Border, and Bootstrap Container Overrides

### CSS Overrides

**sw-overrides.css**
- **Bootstrap Container & Gutter Overrides:** Added comprehensive Bootstrap container/gutter override system:
  - Set `--bs-gutter-x: 0` on `body.sw-itt-header` (containers should have 0 padding, not 15px)
  - Reset `--bs-gutter-x: 1.5rem` within `.itt-header-section` to preserve header module's Bootstrap grid
  - Added explicit container padding override: all container variants set to `padding-right: 0; padding-left: 0;`
  - Added explicit row margin override: `.row` set to `margin-right: 0; margin-left: 0;` (since containers have 0 padding, rows don't need negative margins)
  - Column padding remains `15px` (columns still need spacing between them)
  - All overrides use `:not(.itt-header-section ...)` exceptions to preserve header Bootstrap grid functionality
- **Files Modified:** `css/sw-overrides.css`

### Modules

**SW Header ITT.module**
- **Hamburger Menu Outline Fix:** Removed outline on hamburger menu button when clicked:
  - Added comprehensive outline removal for all states: `:focus`, `:active`, `:focus-visible`, `.active`, `:not(.collapsed)`
  - Added `outline: none !important;`, `box-shadow: none !important;`, `border: none !important;` to all states
  - Applied to both base rule and mobile media query
- **Language Switcher Mobile Positioning:** Fixed language switcher to appear just to the left of hamburger menu on mobile:
  - Added mobile language switcher HTML to `sw-site_header-itt.html` partial in `mob-right-section` div (before hamburger button)
  - Added `itt-mobile-only` class for mobile-only visibility
  - Added CSS rules to show mobile version on mobile, hide desktop version on mobile
  - Added CSS rules to hide mobile version on desktop, show desktop version on desktop
  - Updated JavaScript to sync mobile switcher visibility with module setting
  - Positioned with `margin-right: 10px` to sit next to hamburger button
- **Language Switcher Down Arrow Removal:** Removed down caret/arrow next to globe icon:
  - Removed `<span class="itt-mobile-arrow">` SVG element from module HTML
  - Updated CSS to always hide arrow (was causing display issues)
- **Language Switcher Dropdown Triangle Border:** Fixed triangle pointer border to match dropdown box:
  - Updated `::before` pseudo-element border styling
  - Changed from transparent borders to visible `border-top: 1px solid #d9d9d9` and `border-left: 1px solid #d9d9d9`
  - Adjusted size and positioning (from 20px × 20px to 10px × 10px, from top: -10px to top: -5px)
  - Creates proper speech bubble effect with matching border on triangle
- **Files Modified:** `sw-modules/SW Header ITT.module/module.html`, `sw-modules/SW Header ITT.module/module.css`

### Partials

**sw-site_header-itt.html**
- Added mobile language switcher HTML structure in `mob-right-section` div
- Language switcher positioned before hamburger button
- Uses same structure as desktop version but with `itt-mobile-only` class for responsive visibility
- JavaScript automatically syncs visibility based on module setting (checks if desktop version exists)
- **Files Modified:** `sw-partials/sw-site_header-itt.html`

**Purpose:** These changes fix the language switcher mobile positioning (now appears next to hamburger menu), remove unwanted hamburger outline on click, remove the down arrow from the language switcher button, fix the dropdown triangle border to create a proper speech bubble effect, and implement Bootstrap container/gutter overrides to set container padding to 0px instead of 15px while preserving header module's Bootstrap grid system.

---

## 2026.01.08 - Bootstrap Typography Override and Header Spacing Fixes

### CSS Overrides

**sw-overrides.css**
- Added Bootstrap typography override section using Jinja templating
- Generates theme typography rules with `body.sw-itt-header` prefix for higher specificity
- Overrides Bootstrap's fixed `rem` font sizes (h1: 2.5rem, h2: 2rem, etc.) with theme's responsive `clamp()` typography
- Uses same typography generation logic as `base-overrides.css` but with `body.sw-itt-header` selector
- Includes `clamp()` macro for responsive font sizes
- Applies to all headings (h1-h6) with proper font-family, line-height, margin-bottom, font-weight, letter-spacing, and color
- **Files Modified:** `css/sw-overrides.css`

### Templates

**SW General Page.html**
- Added `sw-itt-header` class to body tag (required for typography overrides to work)
- Added HubL documentation comment explaining the requirement for `sw-itt-header` class when SW Header ITT module is present
- **Files Modified:** `sw-templates/SW General Page.html`

### Partials

**sw-site_header-itt.html**
- Restored to version with spacing fixes (uses direct `{% module %}` tag instead of `{% dnd_area %}`)
- Removes extra wrapper divs that were causing navbar positioning issues
- **Files Modified:** `sw-partials/sw-site_header-itt.html`

### Modules

**SW Header ITT.module**
- Restored `module.css` to version with completed spacing fixes
- Spacing fixes use `px` values instead of `rem` to match live site's base font size:
  - `padding: 0 0 0 10px` for nav-item spacing (was 1rem)
  - `margin-left: 200px !important` for nav-right-items (was 20rem)
  - `margin-left: 160px !important` for nav-right-items at 1200-1600px breakpoint (was 16rem)
- Container and navbar spacing fixes maintained:
  - Container max-width: 1240px at 1200px+
  - Container padding: 7.5px left/right
  - Navbar padding: 14px 60px
  - Navbar margin: 32px -60px 0 -60px
- **Files Modified:** `sw-modules/SW Header ITT.module/module.css`

**Purpose:** These changes ensure that Bootstrap CSS loaded in the SW Header ITT module does not override the theme's responsive typography. The typography overrides use `body.sw-itt-header` selector for higher specificity and load after Bootstrap to restore the theme's intended responsive `clamp()` typography. Header spacing fixes ensure the navbar and navigation elements align correctly with the live site.

---

## 2026.01.08 - Bootstrap Button and Element Overrides for .sw-itt-header Pages

### CSS Overrides

**sw-overrides.css**
- Added comprehensive Bootstrap override section for `.sw-itt-header` pages
- **Display Classes:** Added overrides for `.display-1` through `.display-4` with theme typography
- **Buttons:** Added complete Bootstrap button override system:
  - Base button styles with all Bootstrap properties explicitly overridden
  - Changed `display: inline-block` to `display: inline-flex` with `align-items: center` and `justify-content: center` for proper vertical text centering
  - Overrides for all Bootstrap button properties: `display`, `font-weight`, `line-height`, `text-align`, `text-decoration`, `vertical-align`, `cursor`, `user-select`, `background-color`, `border`, `padding`, `font-size`, `border-radius`, `color`, `min-height`, `transition`
  - Button size variants (sm, md, lg) with theme values
  - Button color variants (primary, secondary, tertiary, success, info, warning, danger, light, dark, gradients) with theme colors
  - Button override support for custom button colors when enabled in theme
- **Links:** Added link color overrides for `.sw-itt-header` pages:
  - Standard links (excluding buttons/CTAs) use theme link colors
  - Context-aware link colors (paragraphs, lists, tables)
  - Links within headings inherit heading color
  - Hover states with theme link hover color
- **Lists:** Added conditional list style overrides (only if custom list styling enabled in theme):
  - Custom unordered list bullets
  - Custom ordered list numbering with theme colors
- **Paragraphs:** Added paragraph style overrides with theme typography
- **Small Text:** Added small text overrides (`.small`, `small`, `p.small`, `.font-small *`) with theme typography
- **Lead Paragraph:** Added lead paragraph overrides (`.lead`, `.large`) with theme typography
- **Blockquote:** Added blockquote overrides with theme typography
- All overrides use `body.sw-itt-header` prefix for higher specificity and only affect pages with the SW Header ITT module
- **Files Modified:** `css/sw-overrides.css`

**Purpose:** These changes ensure that Bootstrap CSS loaded in the SW Header ITT module does not override the theme's styling for buttons, links, lists, paragraphs, and other elements. All Bootstrap defaults are explicitly overridden with theme values, ensuring consistent styling across all page elements on `.sw-itt-header` pages. The button vertical alignment fix ensures text is properly centered within buttons using flexbox.

---

## 2026.01.08 - REM to PX Conversions, Resources Tab Fixes, and Language Switcher Toggle

### Modules

**SW Header ITT.module**
- **REM to PX Conversions:** Converted all `rem` values to `px` values throughout `module.css` to match live site's 10px base font size (new site uses 16px base)
  - Phase 1: Critical base font sizes (2 values) - `.itt-header-section` and form elements font-size: `1.6rem → 16px`
  - Phase 2: High-impact spacing (17 values) - navbar padding/margins, accordion padding, tab content spacing, icon padding, button margins, mobile nav item padding
  - Phase 3: Typography font sizes (10 values) - dropdown menu base, block info titles, block info paragraphs, line heights, button icon font-sizes, mobile tab link
  - Phase 4: Border radius and minor spacing (3 values) - button border-radius, icon padding, mobile nav collapse margin
  - All conversions use formula: `rem_value × 10px = px_value`
  - Added conversion comments documenting original rem values for reference
- **Resources Tab Border-Radius Fix:** Fixed tab title border-radius to round right side (not left) to match live site:
  - Changed `border-radius: 24px 0 0 24px !important;` to `border-radius: 0 24px 24px 0 !important;`
  - Updated in base `.nav-link` rule, `:hover`/`:focus` states, and `.active` state
  - Removed border-right line from resources tab navigation tabs (`border-right: none !important;`)
- **Language Switcher Toggle:** Added toggle field to enable/disable language switcher:
  - Added `enable_language_switcher` boolean field to `fields.json` (default: `false` - OFF)
  - Wrapped language switcher HTML in conditional `{% if module.default_navigation.enable_language_switcher %}...{% endif %}`
  - Added `language-switcher-disabled` class to parent `<li>` when toggle is OFF
  - Added CSS rule to push Contact Us button to the right (`margin-left: auto !important;`) when language switcher is hidden
  - Updated JavaScript to check if language switcher is visible before attaching event listeners
- **Files Modified:** `sw-modules/SW Header ITT.module/module.css`, `sw-modules/SW Header ITT.module/module.html`, `sw-modules/SW Header ITT.module/fields.json`

**Purpose:** These changes ensure the header module spacing and typography match the live site exactly by using pixel values instead of rem units (accounting for base font size differences). The resources tab styling now matches the live site with correct border-radius direction and no border line. The language switcher can now be toggled on/off, with Contact Us button automatically repositioning when the switcher is disabled.

---

