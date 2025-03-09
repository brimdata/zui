export const isTabAction = ({type}) => {
  return (
    type.startsWith("TAB_") ||
    type.startsWith("SEARCH_") ||
    type.startsWith("VIEWER_") ||
    type.startsWith("CHART_") ||
    type.startsWith("COLUMNS_") ||
    type.startsWith("HISTORY_") ||
    type.startsWith("LOG_DETAIL_") ||
    type.startsWith("LAYOUT_") ||
    type.startsWith("CURRENT_") ||
    type.startsWith("LAST_") ||
    type.startsWith("TAB_LOCAL_STATE")
  )
}
