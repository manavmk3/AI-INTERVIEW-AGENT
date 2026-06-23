import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        currentUser: null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
            state.currentUser = action.payload
        }
    }
})

export const { setUserData } = userSlice.actions
export default userSlice.reducer
