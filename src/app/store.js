import { configureStore } from '@reduxjs/toolkit'
import portfolioReducer from '../features/portfolio/portfolioSlice.js'

export const store = configureStore({
  reducer: { portfolio: portfolioReducer }
})
