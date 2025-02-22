import React from 'react'
import { Box, BoxProps } from '@mui/material'
import Grid from '../Grid/Grid.tsx'
// import { toggleNestedGridSliderOpen } from '../../../../store/interface/interfaceSlice.ts'

interface InterfaceBoxProps {
  props: BoxProps | any
  [key: string]: any
}

function InterfaceBox({ props, componentId = '', dragRef = { current: '' }, ingrid = false }: InterfaceBoxProps) {
  return (
    <Box {...props} className='border-1 p-2   h-100 w-100 box-sizing-border-box '>
      {/* {!inpreview && (
        <Box className='flex-end-center w-100'>
          {ingrid ? (
            <Button
              variant='outlined'
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={() => dispatch(toggleNestedGridSliderOpen({ id: componentId, gridId: gridId }))}
            >
              Edit
            </Button>
          ) : (
            <Button variant='outlined' onClick={() => dispatch(toggleNestedGridSliderOpen(false))}>
              Close
            </Button>
          )}
        </Box>
      )} */}
      <form
        className='nested_grid'
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Grid dragRef={dragRef} ingrid={ingrid} gridId={componentId} />
      </form>
    </Box>
  )
}
export default InterfaceBox
