import { createSlice } from '@reduxjs/toolkit'

const labSlice = createSlice({
  name: 'lab',
  initialState: {
    activeLab: 'warehouse',
    playback: { status: 'idle', step: -1, totalSteps: 0, runId: 0 }
  },
  reducers: {
    setActiveLab(state, action) {
      state.activeLab = action.payload
      state.playback = { status: 'idle', step: -1, totalSteps: 0, runId: state.playback.runId + 1 }
    },
    startPlayback(state, action) {
      state.playback = {
        status: 'running',
        step: -1,
        totalSteps: action.payload,
        runId: state.playback.runId + 1
      }
    },
    setPlaybackStep(state, action) {
      if (action.payload.runId === state.playback.runId) state.playback.step = action.payload.step
    },
    finishPlayback(state, action) {
      if (action.payload === state.playback.runId) state.playback.status = 'complete'
    },
    resetPlayback(state) {
      state.playback = { status: 'idle', step: -1, totalSteps: 0, runId: state.playback.runId + 1 }
    }
  }
})

export const { finishPlayback, resetPlayback, setActiveLab, setPlaybackStep, startPlayback } = labSlice.actions

export const runLabPlayback = ({ totalSteps, delay = 650 }) => async (dispatch, getState) => {
  dispatch(startPlayback(totalSteps))
  const runId = getState().lab.playback.runId

  for (let step = 0; step < totalSteps; step += 1) {
    if (getState().lab.playback.runId !== runId) return
    dispatch(setPlaybackStep({ runId, step }))
    await new Promise((resolve) => setTimeout(resolve, delay))
  }

  dispatch(finishPlayback(runId))
}

export default labSlice.reducer
