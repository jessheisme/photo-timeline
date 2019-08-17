
export const FIELD = {
  TEXT: 'text',
  SELECT: 'select',
  MULTIPLE_SELECT: 'multiple-select',
  CHECKBOX: 'checkbox',
}

export const FIELDS = {
  [FIELD.TEXT]: { id: FIELD.TEXT, name: 'Text', icon: 'type' },
  [FIELD.SELECT]: { id: FIELD.SELECT, name: 'Select', icon: 'circle' },
  [FIELD.MULTIPLE_SELECT]: { id: FIELD.MULTIPLE_SELECT, name: 'Multiple Select', icon: 'square' },
  [FIELD.CHECKBOX]: { id: FIELD.CHECKBOX, name: 'Checkbox', icon: 'check-square' }
}

export const CARD = {
  CLASSIC: 'classic',
  MINIMAL: 'minimal',
  COMPACT: 'compact',
}

export const CARDS = {
  [CARD.MINIMAL]: { id: CARD.MINIMAL, name: 'Minimal' },
  [CARD.CLASSIC]: { id: CARD.CLASSIC, name: 'Classic' },
  [CARD.COMPACT]: { id: CARD.COMPACT, name: 'Compact' },
}

export const VIEW = {
  GRID: 'grid',
  LIST: 'list',
  KANBAN: 'kanban',
  REEL: 'reel',
  BLOG: 'blog',
  DROP: 'drop',
}

export const VIEWS = {
  [VIEW.GRID]: { id: VIEW.GRID, name: 'Grid', icon: 'grid', defaults: { cardType: CARD.MINIMAL } },
  [VIEW.LIST]: { id: VIEW.LIST, name: 'List', icon: 'list', defaults: {} },
  [VIEW.KANBAN]: { id: VIEW.KANBAN, name: 'Kanban', icon: 'server', defaults: { cardType: CARD.COMPACT } },
  [VIEW.REEL]: { id: VIEW.REEL, name: 'Reel', icon: 'film', defaults: {} },
  [VIEW.BLOG]: { id: VIEW.BLOG, name: 'Blog', icon: 'file', defaults: {} },
  [VIEW.DROP]: { id: VIEW.DROP, name: 'Drop', icon: 'upload', defaults: {} },
}