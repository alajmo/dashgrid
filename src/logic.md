rowHeight - auto or px
columnWidth - auto or px

numRows
minRows
maxRows

numColumns
minColumns
maxColumns

# Grid Dimension
Grid dimension (rowHeight / columnWidth)

* Case 1:
    rowHeight = undefined
    numRows = number

    * grid element height set to parent element height
    * cellHeight set to parent height / numRows

* Case 2:
    rowHeight = number
    numRows = number

    * grid element height set to rowHeight times numRows
    * cellHeight set to rowHeight

* Case 3:
    rowHeight = number
    numRows = undefined

    * grid element height set to rowHeight times minNumRows
    * cellHeight set to rowHeight

* Case 4:
    rowHeight = undefined
    numRows = undefined

    * grid element height set to that of the parent element
    * cellHeight set to parent element height divided by minNumRows

# Row height and column width.

row / height are set at initialization and do not change.
If you want rowHeight / columnWidth to change dynamically, you are responsible for
calling the functions themselves to do it. One example would be:

# Grid

Grid width / height are dynamic and change as number of rows / columns change.

# Move Box

1. Decorate box with valid parameters if missing.

2. Check if move is valid (min / max rowspan / columnspan).

3. Check for intersected boxes / inside boundaries etc.

4. Update if valid move.
