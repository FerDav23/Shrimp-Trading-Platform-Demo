/**
 * Clases reutilizables centralizadas.
 * Usa estas constantes en los componentes para mantener consistencia.
 */

/** Layout principal */
export const layout = {
  main: 'flex h-screen bg-gray-50',
  mainContent: 'flex-1 overflow-y-auto px-6',
  sidebar: 'w-64 bg-gray-900 text-white min-h-screen',
  topbar: 'bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center',
} as const;

/** Cards y contenedores */
export const card = {
  base: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
  hover: 'cursor-pointer hover:shadow-md transition-shadow',
} as const;

/** Formularios */
export const form = {
  label: 'block text-sm font-medium text-gray-700 mb-1',
  labelRequired: 'text-red-500 ml-1',
  row: 'mb-4',
  /** Input con ancho fijo para números */
  inputW24: 'w-24 border border-sky-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800',
  /** Input estándar (formularios offer) */
  input:
    'border border-sky-300 rounded-md px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-sky-400 focus:border-sky-400',
  inputReadonly:
    'border border-sky-300 rounded-md px-2 py-1.5 bg-white/80 cursor-not-allowed text-slate-800',
  inputSmall: 'border border-sky-300 rounded px-2 py-1.5 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800',
  inputSmallReadonly: 'border border-sky-300 rounded px-2 py-1.5 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800',
  select:
    'border border-sky-300 rounded-md px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-sky-400 focus:border-sky-400',
  radio: 'rounded border-sky-300 text-sky-600 focus:ring-sky-400',
  selectFilter: 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm',
  inputGray: 'w-full border border-gray-300 rounded-md px-3 py-2',
  inputDisabled: 'w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50',
  textareaGray: 'w-full border border-gray-300 rounded-md px-3 py-2',
  inputReadonlyGray: 'w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-gray-100 text-gray-700 cursor-not-allowed',
  inputEditable: 'w-full px-2 py-1.5 border border-gray-300 rounded text-sm',
  inputSmallGray: 'w-20 px-2 py-1 border border-gray-200 rounded text-sm',
  inputTableCell: 'w-full px-2 py-1 border border-gray-200 rounded text-sm',
} as const;

/** Botones */
export const button = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 rounded font-medium transition-colors',
  primarySky: 'bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 font-medium disabled:opacity-50 shadow-sm transition-colors',
  secondary: 'text-gray-700 hover:bg-gray-100',
  /** Botón secundario sky (añadir término, añadir item) */
  addSecondary:
    'bg-white text-sky-700 border border-sky-300 hover:bg-sky-50 hover:text-sky-800 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
  /** Botón eliminar (rojo) */
  delete: 'text-red-600 hover:text-red-700 hover:bg-red-50 rounded px-2 py-1 text-sm font-medium transition-colors',
  avatar: 'w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white',
  avatarLg: 'w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold',
  dismiss: 'flex-shrink-0 p-1 rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent',
  primaryFull: 'w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors font-medium',
  primaryMd: 'px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition-colors',
  actionSmallGreen: 'text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700',
  actionSmallRed: 'text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700',
  actionSmallBlue: 'text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700',
  skyPrimary: 'px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-600',
  skySmall: 'px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium text-sm transition-colors',
  cancelOutline: 'px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors',
  rejectOutline: 'px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 font-medium transition-colors',
  skyUpload: 'flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium text-sm transition-colors shadow-sm',
  linkRemove: 'text-red-600 hover:text-red-700 text-sm font-medium underline underline-offset-2',
} as const;

/** Badges de estado */
export const badge = {
  base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  neutral: 'bg-gray-100 text-gray-800 border-gray-200',
} as const;

/** Alertas */
export const alert = {
  base: 'rounded-lg border p-4',
  dismiss: 'flex-shrink-0 p-1 rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent',
  info: {
    container: 'bg-sky-50 border-sky-200 text-sky-800',
    title: 'text-sky-900',
    icon: 'text-sky-500',
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 text-amber-800',
    title: 'text-amber-900',
    icon: 'text-amber-500',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    title: 'text-red-900',
    icon: 'text-red-500',
  },
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    title: 'text-emerald-900',
    icon: 'text-emerald-500',
  },
} as const;

/** Modal */
export const modal = {
  overlay: 'fixed inset-0 z-50 overflow-y-auto',
  backdrop: 'fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75',
  container: 'inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full',
  header: 'px-6 py-4 border-b border-gray-200',
  title: 'text-lg font-medium text-gray-900',
  body: 'px-6 py-4',
  size: {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  } as const,
} as const;

/** Tablas (DataTable) */
export const table = {
  wrapper: 'overflow-x-auto',
  base: 'min-w-full divide-y divide-gray-200',
  thead: 'bg-gray-50',
  th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
  tbody: 'bg-white divide-y divide-gray-200',
  tr: 'hover:bg-gray-50',
  td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
} as const;

/** Sección de oferta (OfferFormAdjustments, etc.) */
export const offerSection = {
  container: 'mb-4 p-3 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm',
  containerFlex: 'flex flex-col p-3 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm min-h-0 overflow-hidden',
  containerStart: 'p-3 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm self-start',
  title: 'text-lg font-semibold text-white mb-0.5 pb-2 border-b border-white/30',
  titleMb2: 'text-lg font-semibold text-white mb-2 pb-2 border-b border-white/30',
  titleShrink: 'text-lg font-semibold text-white mb-2 pb-2 border-b border-white/30 shrink-0',
  inner: 'bg-white/70 border border-sky-300/60 rounded-lg p-3',
  innerFlex: 'bg-white/70 border border-sky-300/60 rounded-lg p-3 flex-1 min-h-0 flex flex-col',
  block: 'border border-sky-300/60 rounded-lg p-3 bg-white/70',
  footer: 'mt-2 pt-2 border-t border-sky-400/40',
  footerPublish: 'mt-4 pt-4 border-t border-sky-400/40',
  row: 'flex flex-wrap items-center gap-2 p-2 bg-white/80 border border-sky-300/60 rounded-lg',
  tableWrapper: 'w-full overflow-x-auto rounded-lg border border-sky-300/40 overflow-hidden inline-block min-w-0',
  table: 'w-full divide-y divide-sky-300/50 table-fixed',
  tableHead: 'bg-sky-500/25',
  tableTh: 'px-2 py-1.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide',
  tableBody: 'bg-white divide-y divide-sky-200/50',
  tableRow: 'hover:bg-white/80',
  tableCell: 'px-2 py-1',
  tableCellText: 'py-0.5 text-slate-800',
  input: 'w-24 border border-sky-300 rounded px-2 py-1.5 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800',
  inputWide: 'w-28 border border-sky-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800',
  select: 'border border-sky-300 rounded-md px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-sky-400 focus:border-sky-400',
  radio: 'rounded border-sky-300 text-sky-600 focus:ring-sky-400',
  textMuted: 'text-xs text-slate-500',
  textSm: 'text-sm text-slate-600',
  textLabel: 'text-sm text-slate-600',
  textBold: 'font-semibold text-slate-800',
  textUnit: 'text-sm font-medium text-slate-700 w-16',
  textMedium: 'text-sm font-medium text-slate-700',
  textError: 'text-sm text-red-600',
  /** Input readonly (fecha, etc.) */
  inputReadonly: 'w-full border border-sky-300 rounded-md px-3 py-2 bg-slate-100 cursor-not-allowed text-slate-800',
  /** Textarea estándar */
  textarea:
    'w-full border border-sky-300 rounded-md px-3 py-2 min-h-[80px] bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800 placeholder-slate-500',
  /** Label pequeño para formularios */
  labelSmall: 'block text-xs font-medium text-slate-600 mb-1',
  /** Checkbox item seleccionable */
  checkboxItem: 'flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-colors',
  checkboxItemSelected: 'bg-sky-50/80 border-sky-300',
  checkboxItemUnselected: 'bg-white/50 border-sky-200',
  checkboxItemLocked: 'cursor-not-allowed opacity-80',
  checkbox: 'mt-1 rounded border-sky-300 text-sky-600 focus:ring-sky-400 shrink-0',
  /** Tabla vacía mensaje */
  tableEmpty: 'px-2 py-3 text-center text-slate-500 text-sm',
  /** Wrapper tabla sin inline-block (para tablas que ocupan todo el ancho) */
  tableWrapperFull: 'overflow-x-auto rounded-lg border border-sky-300/40 overflow-hidden',
  /** Celda de tabla alineada a la derecha */
  tableCellRight: 'px-2 py-1 text-right',
} as const;

/** Vista previa de oferta (OfferPreviewContent) - solo lectura */
export const offerPreview = {
  section: 'mb-4 p-3 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm',
  sectionFlex: 'mb-4 p-3 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm h-full flex flex-col',
  title: 'text-lg font-semibold text-white mb-0.5 pb-2 border-b border-white/30',
  inner: 'bg-white/70 border border-sky-300/60 rounded-lg p-3',
  innerFlex: 'bg-white/70 border border-sky-300/60 rounded-lg p-3 flex-1 min-h-0 flex flex-col',
  /** Grid info: label (Empacadora:, Producto:, etc.) */
  infoLabel: 'text-slate-600',
  infoValue: 'ml-2 font-medium text-slate-800',
  /** Término de pago item */
  paymentTermItem: 'border-l-4 border-sky-500 pl-4 py-1',
  paymentTermTitle: 'font-medium text-slate-800',
  paymentTermText: 'text-sm text-slate-600',
  paymentTermTrigger: 'text-xs text-slate-500 mt-1',
  /** Lista condiciones adicionales */
  conditionsList: 'list-disc list-inside space-y-1 text-sm text-slate-700',
  /** Tabla wrapper con min-h-0 */
  tableWrapperOverflow: 'overflow-x-auto rounded-lg border border-sky-300/40 overflow-hidden min-h-0',
  /** Subsección título (Cola Directa, Venta Local) */
  subsectionTitle: 'text-sm font-semibold text-slate-800 mb-2',
  /** Texto de requisito de calidad */
  qualityText: 'text-sm text-slate-700',
  /** Ajuste por clase - título con nota */
  adjustmentTitle: 'text-base font-medium text-slate-800 mb-2',
  adjustmentNote: 'text-slate-600 font-normal text-sm ml-1',
} as const;

/** Toggle switch (checkbox estilizado) */
export const toggle = {
  track: 'w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary-600 transition-colors',
  knob: 'absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm border border-gray-200 transition-all peer-checked:left-6',
} as const;

/** Cuadro de información al mantener cursor sobre input (3+ segundos) */
export const inputInfoTooltip = {
  wrapper: 'relative',
  /** Usa position:fixed vía inline style cuando se renderiza en portal */
  box: 'z-[9999] min-w-[200px] max-w-[280px] px-3 py-2.5 rounded-lg shadow-lg border-2 border-sky-400/60 bg-white/95 backdrop-blur-sm text-sm text-slate-700',
  arrow: 'absolute -top-2 left-4 w-3 h-3 rotate-45 border-l border-t border-sky-400/60 bg-white/95',
} as const;

/** Sidebar navegación */
export const sidebar = {
  navItem: 'block px-6 py-3 text-sm font-medium transition-colors',
  navItemActive: 'bg-gray-800 text-white border-r-2 border-primary-500',
  navItemInactive: 'text-gray-300 hover:bg-gray-800 hover:text-white',
  navItemWithChildren: 'w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors text-left',
  navChild: 'block py-2 pl-10 pr-6 text-sm transition-colors',
  navChildActive: 'text-primary-400 font-medium border-r-2 border-primary-500 bg-gray-800/80',
  navChildInactive: 'text-gray-400 hover:text-white hover:bg-gray-800/80',
  submenu: 'bg-gray-800/50',
} as const;

/** Topbar / dropdown */
export const topbar = {
  userButton: 'flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900',
  dropdown: 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200',
  dropdownHeader: 'px-4 py-2 text-xs text-gray-500 border-b',
  dropdownItem: 'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100',
} as const;

/** Tipografía */
export const typography = {
  pageTitle: 'text-xl font-bold text-gray-900',
  sectionTitle: 'text-lg font-semibold',
  body: 'text-sm text-gray-600',
  bodyDark: 'text-sm text-gray-900',
  bodyMuted: 'text-xs text-gray-500',
  link: 'text-sm font-medium text-gray-500 hover:text-gray-700',
  linkActive: 'text-sm font-medium text-gray-900',
  linkPrimary: 'text-primary-600 hover:text-primary-700 font-medium',
  linkPrimarySm: 'text-primary-600 hover:text-primary-700 text-sm font-medium',
} as const;

/** Páginas - headers, tabs, contenido */
export const page = {
  header: 'sticky top-0 z-10 -mx-6 -mt-6 px-6 pt-6 pb-4 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm',
  title: 'text-2xl font-bold text-gray-900 mb-4',
  titleLg: 'text-2xl font-bold text-gray-900 mb-8',
  tab: 'px-4 py-2 font-medium border-b-2 -mb-px transition-colors',
  tabActive: 'border-primary-600 text-primary-600',
  tabInactive: 'border-transparent text-gray-600 hover:text-gray-900',
  /** Card de dashboard (label + número + descripción) */
  statLabel: 'text-sm font-medium text-gray-500 uppercase tracking-wide',
  statValue: 'mt-2 text-3xl font-bold text-gray-900',
  statValueEmerald: 'mt-2 text-3xl font-bold text-emerald-600',
  statValueAmber: 'mt-2 text-3xl font-bold text-amber-600',
  statValueSky: 'mt-2 text-3xl font-bold text-sky-600',
  statValueBlue: 'mt-2 text-3xl font-bold text-blue-600',
  statValueGreen: 'mt-2 text-3xl font-bold text-green-600',
  statValueYellow: 'mt-2 text-3xl font-bold text-yellow-600',
  statValuePurple: 'mt-2 text-3xl font-bold text-purple-600',
  statValuePrimary: 'mt-2 text-3xl font-bold text-primary-600',
  statDesc: 'mt-2 text-sm text-gray-600',
  /** Sección de card con header */
  cardHeader: 'flex justify-between items-center mb-5 pb-3 border-b border-gray-200',
  cardTitle: 'text-lg font-semibold text-gray-900',
  cardLink: 'text-sm font-medium text-sky-600 hover:text-sky-700',
  cardLinkPrimary: 'text-sm text-primary-600 hover:text-primary-700',
  cardEmpty: 'text-sm text-gray-500 py-4',
  sectionSubtitle: 'text-sm font-medium text-gray-700 mb-3',
  /** Lista de items con link */
  listItem: 'flex justify-between items-center py-2 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-left',
  listItemBorder: 'border-b border-gray-200 pb-3 last:border-0',
  listItemLink: 'font-medium text-gray-900 hover:text-primary-600',
  listItemLabel: 'text-sm text-gray-700 truncate pr-2',
  listItemCount: 'text-sm font-semibold text-sky-600 tabular-nums',
  /** Modal botones */
  modalCancel: 'px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium',
  modalConfirm: 'px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed',
  /** Info box (PublishPreviewModal) */
  infoBox: 'text-sm text-gray-600 bg-sky-50 border border-sky-200 rounded-lg p-3',
  previewBox: 'max-h-[50vh] overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50',
  modalSection: 'border-t border-gray-200 pt-3 space-y-2',
  checkboxLabel: 'flex items-start gap-3 cursor-pointer',
  checkboxInput: 'mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500',
  /** Sección subir archivos */
  uploadSection: 'rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] p-3 shadow-sm',
  uploadTitle: 'text-lg font-semibold text-white mb-2 pb-2 border-b border-white/30',
  uploadText: 'text-white/90 text-sm mb-3',
  uploadButton: 'w-full py-2.5 px-3 border-2 border-dashed border-white/60 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2',
  /** Lista de archivos subidos */
  fileListContainer: 'mt-4 p-3 bg-white rounded-xl border border-gray-200 shadow-sm',
  fileListTitle: 'text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200',
  fileListItem: 'flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg border border-gray-200',
  fileListName: 'block text-gray-900 font-medium text-sm break-all',
  fileListSize: 'block text-gray-500 text-xs mt-0.5',
  fileListRemove: 'shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded p-1 transition-colors',
  /** Header con subtítulo */
  headerWithSubtitle: 'sticky top-0 z-10 -mx-6 -mt-6 px-6 pt-6 pb-4 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm mb-6',
  headerTitle: 'text-2xl font-bold text-gray-900',
  headerSubtitle: 'text-sm text-gray-600 mt-1',
  gridStats: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6',
  gridStats4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6',
  gridStats3: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-6',
  gridCards: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  grid2: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  unreadDot: 'w-2 h-2 bg-yellow-600 rounded-full',
  calculatorResult: 'mt-4 p-4 bg-gray-50 rounded-md',
  certificateItem: 'flex justify-between items-center p-4 border border-gray-200 rounded-md',
} as const;

/** Collapsible section (saleRequestDetailModal) */
export const collapsible = {
  sectionDefault: 'rounded-xl border-2 border-sky-400/60 bg-sky-50 shadow-sm overflow-hidden',
  sectionRejection: 'rounded-xl border-2 border-red-200 bg-red-50/50 shadow-sm overflow-hidden',
  buttonDefault: 'w-full flex items-center justify-between p-4 text-left text-gray-900 hover:bg-sky-100/50 transition-colors',
  buttonRejection: 'w-full flex items-center justify-between p-4 text-left text-gray-900 hover:bg-red-100/50 transition-colors',
  title: 'text-lg font-semibold text-gray-900',
  chevron: 'w-5 h-5 transition-transform',
  chevronExpanded: 'rotate-180',
  content: 'px-6 pb-6',
  innerBox: 'bg-white border border-sky-200 rounded-lg p-4',
  innerBoxXl: 'bg-white border border-sky-200 rounded-xl p-6 space-y-8 shadow-sm',
  subsectionTitle: 'text-base font-semibold text-sky-800 tracking-tight border-b border-sky-200 pb-2',
  subsectionTitleMb: 'text-base font-semibold text-sky-800 tracking-tight border-b border-sky-200 pb-2 mb-4',
  fieldLabel: 'text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5',
  fieldValue: 'text-gray-900 font-medium',
  bankCard: 'mt-4 p-5 border border-sky-100 rounded-xl bg-sky-50/50 space-y-4',
  transferBox: 'border border-sky-200 rounded-xl p-5 bg-sky-50/30 print:bg-white',
  timerExpired: 'rounded-xl border-2 p-4 border-red-200 bg-red-50',
  timerActive: 'rounded-xl border-2 p-4 border-sky-200 bg-sky-50/50',
  timerTextExpired: 'text-lg font-bold text-red-700',
  timerDigits: 'text-2xl font-bold text-red-600 tabular-nums',
  proofImage: 'border border-sky-200 rounded-lg overflow-hidden bg-gray-100 max-w-sm',
  proofImageLg: 'border border-sky-200 rounded-lg overflow-hidden bg-gray-100 max-w-xs',
  skyButton: 'text-sm px-3 py-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium transition-colors',
  selectSky: 'w-full md:max-w-sm px-4 py-2.5 border border-sky-200 rounded-lg text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-shadow',
  rejectSelect: 'w-full px-3 py-2 border border-red-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
  rejectTextarea: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
  rejectReadonlyBox: 'bg-white border border-red-200 rounded-lg p-4',
  notesBox: 'text-sm text-gray-900 bg-gray-50 rounded p-3 border border-gray-200',
} as const;

/** Messages section (saleRequestDetailModal) */
export const messagesSection = {
  container: 'rounded-xl border-2 border-sky-400/60 bg-sky-50 shadow-sm overflow-hidden',
  headerButton: 'w-full flex items-center justify-between p-4 text-left text-gray-900 transition-colors hover:bg-sky-100/50',
  title: 'text-lg font-semibold text-gray-900',
  readOnlyBadge: 'text-xs font-medium text-gray-700 bg-gray-200 px-2 py-0.5 rounded',
  messagesBox: 'rounded-lg overflow-hidden border bg-white border-sky-200',
  messagesArea: 'h-64 overflow-y-auto p-4 space-y-3',
  messagesAreaReadOnly: 'bg-gray-100/50',
  messagesAreaActive: 'bg-gray-50/50',
  emptyText: 'text-center py-8 text-sm text-gray-500',
  emptyTextReadOnly: 'text-center py-8 text-sm text-gray-400',
  bubblePacker: 'max-w-[75%] rounded-lg p-3 bg-sky-500 text-white',
  bubbleProducer: 'max-w-[75%] rounded-lg p-3 bg-white border border-gray-200 text-gray-900',
  bubblePackerReadOnly: 'max-w-[75%] rounded-lg p-3 bg-gray-400 text-gray-100',
  bubbleProducerReadOnly: 'max-w-[75%] rounded-lg p-3 bg-gray-200 text-gray-700 border border-gray-300',
  inputArea: 'p-4 border-t border-sky-200 bg-white',
  textarea: 'flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none',
  sendButton: 'px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end',
  charCount: 'mt-2 text-xs text-gray-500 text-right',
} as const;

/** Settlement table (saleRequestDetailModal) */
export const settlementTable = {
  table: 'w-full text-sm border border-gray-200 rounded-lg',
  tableOverflow: 'w-full text-sm border border-gray-200 rounded-lg overflow-hidden',
  thead: 'bg-gray-100 text-left',
  th: 'px-2 py-2 font-medium text-gray-700',
  td: 'px-2 py-1.5 text-gray-900',
  tdMedium: 'px-2 py-1.5 font-medium text-gray-800',
  emptyCell: 'px-2 py-3 text-center text-gray-500',
  row: 'border-t border-gray-100',
  removeBtn: 'p-1 text-red-600 hover:bg-red-50 rounded',
  addLineBtn: 'text-xs px-2 py-1 bg-sky-600 text-white rounded hover:bg-sky-700',
} as const;

/** Detail actions (saleRequestDetailModal) */
export const detailActions = {
  container: 'flex justify-end gap-3 pt-4 border-t border-gray-200',
  cancel: 'px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors',
  reject: 'px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors',
  rejectDisabled: 'px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  accept: 'px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors',
  close: 'px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition-colors',
} as const;

/** Linked offer modal */
export const linkedOfferModal = {
  header: 'flex items-center justify-between border-b border-gray-200 pb-4 mb-2',
  title: 'text-lg font-medium text-gray-900',
  closeBtn: 'p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors',
  footer: 'flex justify-end pt-2 border-t border-gray-200',
} as const;

/** Login */
export const login = {
  container: 'min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4',
  title: 'text-4xl font-bold text-gray-900 mb-2',
  subtitle: 'text-gray-600',
  cardHover: 'hover:shadow-lg transition-all cursor-pointer',
} as const;
