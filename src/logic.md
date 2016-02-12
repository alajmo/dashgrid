rowHeight - auto or px
columnWidth - auto or px

numRows
minRows
maxRows

numColumns
minColumns
maxColumns

Case 1:
    rowHeight = undefined
    numRows = number

    * grid element height set to parent element height
    * cellHeight set to parent height / numRows

Case 2:
    rowHeight = number
    numRows = number

    * grid element height set to rowHeight times numRows
    * cellHeight set to rowHeight

Case 3:
    rowHeight = number
    numRows = undefined

    * grid element height set to rowHeight times minNumRows
    * cellHeight set to rowHeight

Case 4:
    rowHeight = undefined
    numRows = undefined

    * grid element height set to that of the parent element
    * cellHeight set to parent element height divided by minNumRows
