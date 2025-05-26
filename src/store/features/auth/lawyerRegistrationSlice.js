import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 1,
  //  user data
  username: '',
  email: '',
  role: 'user',
  password: '',
  regUserType: 'lawyer',
  profile: {
    name: '',
    activeProfile: 'basic',
    country: '',
  },
  //  company profile data
  companyTeam: false,
  companyName: '',
  phone: '',
  website: '',
  companySize: '',
  // lawyer service map
  userProfile: '', // string (ObjectId)
  services: [], // string[] (ObjectId[])
  country: '', // string (ObjectId)
  zipCodes: [], // string[] (ObjectId[])
  rangeInKm: '', // string (ObjectId)
  practiceWithin: false,
  practiceInternationally: false,
  isSoloPractitioner: false,
};

export const registrationSlice = createSlice({
  name: 'lawyerRegistration',
  initialState,
  reducers: {
    updateField: (state, action) => {
      state[action.payload.field] = action.payload.value;
    },
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      state.step -= 1;
    },
    resetRegistration: () => initialState,
  },
});

export const { updateField, nextStep, prevStep, resetRegistration } =
  registrationSlice.actions;
export default registrationSlice.reducer;
