import { createSlice } from '@reduxjs/toolkit'

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: { activeTab: 'ai', selectedProjectId: null },
  reducers: {
    setActiveTab: (state, action) => { state.activeTab = action.payload },
    selectProject: (state, action) => { state.selectedProjectId = action.payload },
    clearSelectedProject: (state) => { state.selectedProjectId = null }
  }
})

export const { setActiveTab, selectProject, clearSelectedProject } = portfolioSlice.actions
export default portfolioSlice.reducer
