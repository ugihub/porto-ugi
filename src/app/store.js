import { configureStore } from '@reduxjs/toolkit'
import labReducer from '../features/lab/labSlice.js'
import portfolioReducer from '../features/portfolio/portfolioSlice.js'

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    lab: labReducer
  }
})
