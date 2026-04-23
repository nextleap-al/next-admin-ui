// Unified Dropdown Components
// ============================
// A consistent set of dropdown components for the application.
//
// Usage Guidelines:
// - SimpleDropdown: For static options with few items (<10), no search needed
// - SearchDropdown: For large option lists or API-loaded data, includes search
// - MultiSelectDropdown: For selecting multiple options with checkboxes and search
// - MultiSelectSimple: For selecting multiple options with checkboxes, no search
// - ActionMenu: For action menus (edit, delete, etc.) - NOT for form inputs

// Simple dropdown - no search, for static options with few items
export { SimpleDropdown } from './SimpleDropdown';
export type { SimpleDropdownProps, DropdownOption } from './SimpleDropdown';

// Search dropdown - with search, for large option lists or API data
export { SearchDropdown } from './SearchDropdown';
export type { SearchDropdownProps } from './SearchDropdown';

// Multi-select dropdown - checkboxes with search
export { MultiSelectDropdown } from './MultiSelectDropdown';
export type { MultiSelectDropdownProps } from './MultiSelectDropdown';

// Multi-select simple - checkboxes without search
export { MultiSelectSimple } from './MultiSelectSimple';
export type { MultiSelectSimpleProps } from './MultiSelectSimple';

// Action menu - for action buttons (edit, delete, etc.)
export { ActionMenu } from './ActionMenu';
export type { ActionMenuProps, ActionMenuItem } from './ActionMenu';
